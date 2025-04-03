const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        index: true // Indexing for faster lookups
    },
    items: [{ 
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product', 
            required: true 
        },
        quantity: { 
            type: Number, 
            required: true, 
            min: [1, 'Quantity must be at least 1'] // Prevents invalid order quantity
        }
    }],
    totalPrice: { 
        type: Number, 
        required: true, 
        min: [0, 'Total price must be positive'] 
    },
    status: { 
        type: String, 
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], 
        default: 'pending' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true }); // Automatically adds createdAt & updatedAt fields

// Pre-save middleware to update the updatedAt timestamp
OrderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
