const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

mongoose.connect(process.env.MONGODB_URL).then(async () => {
    console.log("Connected to DB");
    try {
        const user = await User.findOne();
        if (!user) return console.log("No users");
        console.log("Found user:", user._id);
        const orders = await Order.find({ user: user._id }).populate('orderItems.product', 'title price images');
        console.log("Orders populated:", orders.length);
        const cart = await Cart.findOne({ user: user._id }).populate('cartItems.product', 'title price images');
        console.log("Cart populated:", cart ? "Yes" : "No");
        console.log("Success!");
    } catch (err) {
        console.error("DB Error:", err);
    }
    process.exit(0);
});
