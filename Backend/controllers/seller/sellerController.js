const Product = require('../../models/Product');
const Seller = require('../../models/Seller');
const Category = require('../../models/Category');
const mongoose = require('mongoose');

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

        let { title, description, price, stock, category, inFlashSale } = req.body;
        
        // Smart Category Handling
        if (category && !mongoose.Types.ObjectId.isValid(category)) {
            // Find category by name
            let existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
            if (!existingCategory) {
                // Auto-create category if it doesn't exist
                existingCategory = await Category.create({ name: category });
            }
            category = existingCategory._id;
        }

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
            model3D,
            inFlashSale: inFlashSale === 'true' || inFlashSale === true
        });

        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

const Order = require('../../models/Order');

// @desc    Get Seller Dashboard Stats
// @route   GET /api/seller/dashboard
// @access  Private/Seller
const getSellerDashboard = async (req, res, next) => {
    try {
        const seller = await Seller.findOne({ user: req.user._id });
        if (!seller) return res.status(404).json({ message: 'Seller not found' });

        // Calculate stats
        const productCount = await Product.countDocuments({ seller: seller._id });
        
        // Find orders containing this seller's products
        const orders = await Order.find({ 'orderItems.product': { $in: await Product.find({ seller: seller._id }).distinct('_id') } })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'name email');

        res.json({
            stats: {
                totalRevenue: seller.revenue || 0,
                totalProducts: productCount,
                totalViews: seller.analytics?.totalViews || 0,
                totalSales: seller.analytics?.totalSales || 0,
            },
            recentOrders: orders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Seller Products
// @route   GET /api/seller/products
// @access  Private/Seller
const getSellerProducts = async (req, res, next) => {
    try {
        const seller = await Seller.findOne({ user: req.user._id });
        if (!seller) return res.status(404).json({ message: 'Seller not found' });

        const products = await Product.find({ seller: seller._id }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a product
// @route   PUT /api/seller/products/:id
// @access  Private/Seller
const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const seller = await Seller.findOne({ user: req.user._id });
        if (product.seller.toString() !== seller._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized to update this product' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(updatedProduct);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a product
// @route   DELETE /api/seller/products/:id
// @access  Private/Seller
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const seller = await Seller.findOne({ user: req.user._id });
        if (product.seller.toString() !== seller._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to delete this product' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product removed' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Seller Orders
// @route   GET /api/seller/orders
// @access  Private/Seller
const getSellerOrders = async (req, res, next) => {
    try {
        const seller = await Seller.findOne({ user: req.user._id });
        const sellerProducts = await Product.find({ seller: seller._id }).distinct('_id');
        
        const orders = await Order.find({ 'orderItems.product': { $in: sellerProducts } })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
            
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Get Seller Profile
// @route   GET /api/seller/profile
// @access  Private/Seller
const getSellerProfile = async (req, res, next) => {
    try {
        const seller = await Seller.findOne({ user: req.user._id }).populate('user', 'name email phone');
        if (!seller) return res.status(404).json({ message: 'Seller profile not found' });
        res.json(seller);
    } catch (error) {
        next(error);
    }
};

// @desc    Update Seller Profile
// @route   PUT /api/seller/profile
// @access  Private/Seller
const updateSellerProfile = async (req, res, next) => {
    try {
        const seller = await Seller.findOneAndUpdate(
            { user: req.user._id },
            { $set: req.body },
            { new: true, runValidators: true }
        );
        res.json(seller);
    } catch (error) {
        next(error);
    }
};

module.exports = { 
    createProduct, getSellerDashboard, getSellerProducts, updateProduct, 
    deleteProduct, getSellerOrders, getSellerProfile, updateSellerProfile 
};
