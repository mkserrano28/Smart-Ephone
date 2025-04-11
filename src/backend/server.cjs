const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require('bcryptjs');
require("dotenv").config({ path: __dirname + "/.env" }); // ✅ Manually set path
const cors = require("cors"); // Remove duplicate import
const orderRoutes = require('./routes/orderRoutes.cjs');

const app = express();
const PORT = process.env.PORT || 8080;  // Use the environment-defined port or 8080
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";  // MongoDB URI
let db;

console.log("🔍 PAYMONGO_SECRET_KEY:", process.env.PAYMONGO_SECRET_KEY);
if (!process.env.PAYMONGO_SECRET_KEY) {
    console.warn("⚠️ PAYMONGO_SECRET_KEY is not defined. Make sure to set it in EB env vars.");
}


if (!global.ObjectId) {
    global.ObjectId = require("mongodb").ObjectId; // ✅ Set it globally to avoid re-import
}

// Middleware
app.use(express.json());


const corsOptions = {
    origin: process.env.FRONTEND_URL || '*', // use your cloudfront url
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  app.use(cors(corsOptions));

app.use('/api/orders', orderRoutes);
  

app.get("/", (req, res) => {
    res.send("Server is running");
});

// Connect to MongoDB
const client = new MongoClient(MONGO_URI);

async function connectToDB() {
    try {
        await client.connect();
        db = client.db("Smart-Ephone");
        console.log(" Connected to MongoDB: Smart-Ephone");

        // Update to listen on all interfaces for external access
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
          });
          
    } catch (error) {
        console.error(" MongoDB Connection Error:", error);
        process.exit(1);  // Ensure process exits on DB connection failure
    }
}
connectToDB();

// ✅ User Registration Route
app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const usersCollection = db.collection("registration");
        const existingUser = await usersCollection.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Email already in use!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await usersCollection.insertOne({ username, email, password: hashedPassword });

        res.status(201).json({ message: "Registration successful!", userId: newUser.insertedId });
    } catch (error) {
        console.error("❌ Error in /register:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



// ✅ Login Route
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "All fields are required!" });

        const usersCollection = db.collection("registration");
        const user = await usersCollection.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid email or password!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password!" });

        // Retrieve user's cart from MongoDB
        const cart = await db.collection("carts").findOne({ userId: user._id.toString() });

        res.status(200).json({
            user: { _id: user._id, username: user.username, email: user.email },
            cart: cart ? cart.cartItems : [],
        });
    } catch (error) {
        console.error("❌ Error in /login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// ✅ Add to Cart (Save Cart to MongoDB)
app.post("/cart", async (req, res) => {
    try {
        const { userId, cartItems } = req.body;

        if (!userId || !cartItems) {
            return res.status(400).json({ message: "Missing userId or cartItems!" });
        }

        await db.collection("carts").updateOne(
            { userId: userId.toString() },
            { $set: { cartItems } },
            { upsert: true }
        );

        res.status(200).json({ message: "Cart updated successfully!" });
    } catch (error) {
        console.error("❌ Error in /cart:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Get Cart for a User
app.post("/checkout/cod", async (req, res) => {
    try {
        const { userId, cartItems } = req.body;

        if (!userId || !cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "Invalid checkout data!" });
        }

        console.log("🛒 Incoming cart items:", JSON.stringify(cartItems, null, 2));

        // ✅ Safely calculate total
        const total = cartItems.reduce((sum, item) => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 0;
            return sum + price * quantity;
        }, 0);

        console.log("🧮 Calculated total:", total);

        const newOrder = {
            orderId: new ObjectId().toString(),
            userId,
            cartItems,
            total, // ✅ Now guaranteed to be correct
            status: "To Receive", // ✅ Update status from "Pending" to "To Receive"
            paymentMethod: "Cash on Delivery",
            paymentStatus: "To Receive", // ✅ Optional: align with status or use "Unpaid"
            createdAt: new Date()
        };

        const result = await db.collection("orders").insertOne(newOrder);
        console.log("📦 Order saved with ID:", result.insertedId);

        await db.collection("carts").deleteOne({ userId });

        res.status(201).json({
            message: "Cash on Delivery order placed successfully!",
            orderId: result.insertedId
        });

    } catch (error) {
        console.error("❌ COD Checkout Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



const axios = require("axios");
app.post("/checkout/paymongo-link", async (req, res) => {
    try {
        const { userId, cartItems, totalAmount } = req.body;

        if (!userId || !cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "Invalid checkout data!" });
        }

        console.log(`🔹 Creating PayMongo Payment Link for user ${userId}`);

        // ✅ Call PayMongo API to create a Payment Link
        const response = await axios.post(
            "https://api.paymongo.com/v1/links",
            {
                data: {
                    attributes: {
                        amount: Math.round(totalAmount * 100),
                        description: "Order Payment",
                        remarks: `Payment for order by ${userId}`,
                        metadata: { userId }
                    }
                }
            },
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY).toString("base64")}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("✅ PayMongo Response:", response.data);

        // ✅ Extract `reference_number` and `checkout_url`
        let referenceNumber = response.data?.data?.attributes?.reference_number;
        let paymentUrl = response.data?.data?.attributes?.checkout_url;

        if (!referenceNumber || !paymentUrl) {
            throw new Error("❌ Missing referenceNumber or paymentUrl in PayMongo response.");
        }

        console.log("🔹 Payment Link:", paymentUrl);
        console.log("🔹 Storing order with reference number:", referenceNumber);

        // ✅ Store the order in MongoDB with `Pending` status
        await db.collection("orders").insertOne({
            orderId: referenceNumber,
            userId,
            cartItems,
            totalAmount,
            paymentMethod: "PayMongo Payment Link",
            paymentStatus: "Pending",
            paymentUrl, // ✅ Store it here
            createdAt: new Date(),
          });
          

        res.status(200).json({ paymentUrl });

    } catch (error) {
        console.error("❌ PayMongo Payment Link Error:", error.response?.data || error.message);
        res.status(500).json({ message: "Error creating payment link" });
    }
});



const crypto = require("crypto");
app.post("/webhook/payment-confirmation", async (req, res) => {
    console.log("🔍 Received Webhook Payload:", JSON.stringify(req.body, null, 2));

    const paymentEvent = req.body.data;
    if (!paymentEvent || !paymentEvent.attributes || !paymentEvent.attributes.data) {
        return res.status(400).json({ message: "Invalid webhook payload" });
    }

    const paymentData = paymentEvent.attributes.data;
    const paymentStatus = paymentData.attributes.status;
    const referenceNumber = paymentData.attributes.external_reference_number;

    if (!referenceNumber) {
        return res.status(400).json({ message: "Missing reference number" });
    }

    if (paymentStatus === "paid") {
        console.log(`✅ Payment for Order ${referenceNumber} confirmed! Updating database...`);

        await db.collection("orders").updateOne(
            { orderId: referenceNumber },
            {
                $set: {
                    paymentStatus: "Paid",
                    status: "To Ship",
                    paidAt: new Date()
                }
            }
        );
    }

    res.status(200).json({ message: "Webhook processed successfully" });
});


// ✅ Mark order as Completed (Order Received)
app.patch("/orders/:id/received", async (req, res) => {
    const id = req.params.id;
  
    try {
      const query = ObjectId.isValid(id)
        ? { _id: new ObjectId(id) }
        : { orderId: id };
  
      const result = await db.collection("orders").updateOne(query, {
        $set: { status: "Completed" },
      });
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Order not found or already completed" });
      }
  
      res.json({ message: "Order marked as received (completed)" });
    } catch (error) {
      console.error("❌ Error marking order as received:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  
  // ✅ Cancel order (set status to Cancelled)
  app.patch("/orders/:id/cancel", async (req, res) => {
    const id = req.params.id;
  
    try {
      const query = ObjectId.isValid(id)
        ? { _id: new ObjectId(id) }
        : { orderId: id };
  
      const result = await db.collection("orders").updateOne(query, {
        $set: { status: "Cancelled", cancelledAt: new Date() },
      });
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Order not found or already cancelled" });
      }
  
      res.json({ message: "Order cancelled successfully" });
    } catch (error) {
      console.error("❌ Error cancelling order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  



// ✅ Get Order History for a User
app.get("/orders/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) return res.status(400).json({ message: "User ID is required!" });

        const orders = await db.collection("orders").find({ userId }).toArray();

        // ✅ Ensure date formatting for frontend
        const formattedOrders = orders.map(order => ({
            ...order,
            createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : null,
        }));

        res.status(200).json(formattedOrders);
    } catch (error) {
        console.error("❌ Error in GET /orders:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
