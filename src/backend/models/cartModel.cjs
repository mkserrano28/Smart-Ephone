const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            name: String,
            price: Number,
            quantity: { type: Number, required: true, min: 1 },
            image: String,
        },
    ],
    updatedAt: { type: Date, default: Date.now }
});

// ✅ Automatically update `updatedAt` timestamp before saving
CartSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
