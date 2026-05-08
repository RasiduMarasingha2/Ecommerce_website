const Product = require('../../models/Product');
const Seller = require('../../models/Seller');

// @desc    Create a product
// @route   POST /api/seller/products
// @access  Private/Seller
const createProduct = async (req, res, next) => {
    try {
        const seller = await Seller.findOne({ user: req.user._id });
        if (!seller) {
            res.status(404);
            return next(new Error('Seller profile not found'));
        }

        const { title, description, price, stock, category } = req.body;
        
        let images = [];
        if (req.files && req.files.images) {
            images = req.files.images.map(file => file.path);
        }
        
        let model3D = null;
        if (req.files && req.files.model) {
            model3D = req.files.model[0].path;
        }

        const product = await Product.create({
            seller: seller._id,
            title,
            description,
            price,
            stock,
            category,
            images,
            model3D
        });

        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

module.exports = { createProduct };
