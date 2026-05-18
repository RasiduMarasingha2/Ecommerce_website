const Product = require('../models/Product');
const Review = require('../models/Review');
const mongoose = require('mongoose');


const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find({}).populate('category', 'name').populate('seller', 'storeName').sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        next(error);
    }
};


const getProductById = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const product = await Product.findById(req.params.id)
            .populate('category', 'name')
            .populate('seller', 'storeName sellerVerification analytics revenue user');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        
        const reviews = await Review.find({ product: product._id })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 });

        res.json({ product, reviews });
    } catch (error) {
        next(error);
    }
};


const getRelatedProducts = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const relatedProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id }
        }).limit(6).populate('category', 'name');

        res.json(relatedProducts);
    } catch (error) {
        next(error);
    }
};


const createProductReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            
            const alreadyReviewed = await Review.findOne({
                product: product._id,
                user: req.user._id
            });

            if (alreadyReviewed) {
                return res.status(400).json({ message: 'Product already reviewed' });
            }

            const review = await Review.create({
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
                product: product._id
            });

           
            const reviews = await Review.find({ product: product._id });
            product.numReviews = reviews.length;
            product.ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

            await product.save();

            res.status(201).json({ message: 'Review added', review });
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { getProducts, getProductById, getRelatedProducts, createProductReview };
