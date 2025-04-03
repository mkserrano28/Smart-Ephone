const express = require("express");
const Order = require("../models/orderModel.cjs");
const authMiddleware = require("../middleware/authMiddleware.cjs"); // ✅ Fix import path

const router = express.Router();

// ✅ Create an order
router.post("/create", authMiddleware, async (req, res) => {
    try {
        const { items, totalPrice } = req.body;
        const userId = req.user.userId;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Order must contain at least one item." });
        }

        if (!totalPrice || totalPrice <= 0) {
            return res.status(400).json({ message: "Invalid total price." });
        }

        const newOrder = new Order({
            userId,
            items,
            totalPrice
        });

        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully!", order: newOrder });

    } catch (error) {
        console.error("🔥 Error creating order:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
