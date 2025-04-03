const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const router = express.Router();
const client = new MongoClient(process.env.MONGO_URI);

client.connect().then(() => {
    console.log("✅ Connected to MongoDB for Cart Operations");
});
const db = client.db("Smart-Ephone");
const cartCollection = db.collection("carts");

// ✅ Handle Cart Updates
router.post("/cart", async (req, res) => {
    try {
        const { userId, cartItems } = req.body;
        if (!userId) return res.status(400).json({ message: "User ID is required" });

        const result = await cartCollection.updateOne(
            { userId }, // ✅ Find the user's cart
            { $set: { cartItems } }, // ✅ Replace cart with updated items
            { upsert: true } // ✅ Insert if no cart exists
        );

        console.log("✅ Cart saved in MongoDB:", result);
        res.status(200).json({ message: "Cart updated successfully", result });

    } catch (error) {
        console.error("❌ Error updating cart in MongoDB:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
