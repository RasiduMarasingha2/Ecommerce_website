const Cart = require('../models/Cart');


const syncCart = async (req, res, next) => {
    try {
        const { cartItems, totalPrice } = req.body;
        
        let cart = await Cart.findOne({ user: req.user._id });
        
        if (cart) {
            cart.cartItems = cartItems;
            cart.totalPrice = totalPrice;
            await cart.save();
        } else {
            cart = await Cart.create({
                user: req.user._id,
                cartItems,
                totalPrice
            });
        }
        
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};


const getCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');
        res.status(200).json(cart || { cartItems: [], totalPrice: 0 });
    } catch (error) {
        next(error);
    }
};

module.exports = { syncCart, getCart };
