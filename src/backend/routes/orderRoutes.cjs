const express = require("express");
const Order = require("../models/orderModel.cjs");
const authMiddleware = require("../middleware/authMiddleware.cjs");

const router = express.Router();

router.get("/ping", (req, res) => {
    res.send("Orders route is connected!");
  });
  

// ✅ Create a new order (Authenticated)
router.post("/create", authMiddleware, async (req, res) => {
    try {
        const { items, totalPrice } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Order must contain at least one item." });
        }

        if (!totalPrice || isNaN(totalPrice) || totalPrice <= 0) {
            return res.status(400).json({ message: "Invalid total price." });
        }

        const newOrder = new Order({
            userId,
            items,
            totalPrice,
            createdAt: new Date(),
            status: "To Receive"
        });

        await newOrder.save();

        res.status(201).json({
            message: "Order placed successfully!",
            order: newOrder
        });
    } catch (error) {
        console.error("🔥 Error creating order:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ (Optional) Fetch all orders for authenticated user
router.get("/my-orders", authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const orders = await Order.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error("❌ Error fetching user orders:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
