const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cartItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            qty: { type: Number, required: true, default: 1 },
            price: { type: Number, required: true }, // Snapshotted price at add time
            seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }
        }
    ],
    totalPrice: { type: Number, required: true, default: 0.0 }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
