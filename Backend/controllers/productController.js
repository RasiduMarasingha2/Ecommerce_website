const Product = require('../models/Product');

// @desc    Fetch all public products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find({}).populate('category', 'name').sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        next(error);
    }
};

module.exports = { getProducts };
