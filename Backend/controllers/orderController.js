const Order = require('../models/Order');
const Product = require('../models/Product');


const addOrderItems = async (req, res, next) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            return next(new Error('No order items'));
        }


        for (let i = 0; i < orderItems.length; i++) {
            if (!orderItems[i].seller) {
                const product = await Product.findById(orderItems[i].product);
                if (product) {
                    orderItems[i].seller = product.seller;
                }
            }
        }

        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        next(error);
    }
};

module.exports = { addOrderItems };
