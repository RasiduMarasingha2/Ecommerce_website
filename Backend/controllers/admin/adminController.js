const User = require('../../models/User');
const Product = require('../../models/Product');
const Order = require('../../models/Order');
const Theme = require('../../models/Theme');
const HomepageContent = require('../../models/HomepageContent');
const Offer = require('../../models/Offer');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
    try {
        const usersCount = await User.countDocuments();
        const productsCount = await Product.countDocuments();
        const ordersCount = await Order.countDocuments();
        
        const orders = await Order.find();
        const totalRevenue = orders.reduce((acc, item) => acc + item.totalPrice, 0);
        
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email');

        res.json({
            usersCount,
            productsCount,
            ordersCount,
            totalRevenue,
            recentOrders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await User.deleteOne({ _id: user._id });
            res.json({ message: 'User removed' });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get all products
// @route   GET /api/admin/products
// @access  Private/Admin
const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find({}).populate('category', 'name');
        res.json(products);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a product (fake product cleanup)
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }
        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email');
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get theme
// @route   GET /api/admin/theme
// @access  Public
const getTheme = async (req, res, next) => {
    try {
        const theme = await Theme.findOne({ isActive: true });
        res.json(theme || {});
    } catch (error) {
        next(error);
    }
};

// @desc    Update theme
// @route   PUT /api/admin/theme
// @access  Private/Admin
const updateTheme = async (req, res, next) => {
    try {
        let theme = await Theme.findOne({ isActive: true });
        if (theme) {
            Object.assign(theme, req.body);
            const updatedTheme = await theme.save();
            res.json(updatedTheme);
        } else {
            const newTheme = await Theme.create(req.body);
            res.status(201).json(newTheme);
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get homepage content
// @route   GET /api/admin/content
// @access  Public
const getContent = async (req, res, next) => {
    try {
        const content = await HomepageContent.findOne({ isActive: true }).populate('featuredCategories featuredProducts');
        res.json(content || {});
    } catch (error) {
        next(error);
    }
};

// @desc    Update homepage content
// @route   PUT /api/admin/content
// @access  Private/Admin
const updateContent = async (req, res, next) => {
    try {
        let content = await HomepageContent.findOne({ isActive: true });
        if (content) {
            Object.assign(content, req.body);
            const updatedContent = await content.save();
            res.json(updatedContent);
        } else {
            const newContent = await HomepageContent.create(req.body);
            res.status(201).json(newContent);
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get all offers
// @route   GET /api/admin/offers
// @access  Public
const getOffers = async (req, res, next) => {
    try {
        const offers = await Offer.find({}).populate('applicableProducts');
        res.json(offers);
    } catch (error) {
        next(error);
    }
};

// @desc    Create an offer
// @route   POST /api/admin/offers
// @access  Private/Admin
const createOffer = async (req, res, next) => {
    try {
        const offer = await Offer.create(req.body);
        res.status(201).json(offer);
    } catch (error) {
        next(error);
    }
};

// @desc    Update an offer
// @route   PUT /api/admin/offers/:id
// @access  Private/Admin
const updateOffer = async (req, res, next) => {
    try {
        const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!offer) {
            res.status(404);
            throw new Error('Offer not found');
        }
        res.json(offer);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete an offer
// @route   DELETE /api/admin/offers/:id
// @access  Private/Admin
const deleteOffer = async (req, res, next) => {
    try {
        const offer = await Offer.findByIdAndDelete(req.params.id);
        if (!offer) {
            res.status(404);
            throw new Error('Offer not found');
        }
        res.json({ message: 'Offer deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = { 
    getUsers, deleteUser, getDashboardStats, 
    getProducts, deleteProduct, getOrders, updateOrderStatus,
    getTheme, updateTheme, getContent, updateContent,
    getOffers, createOffer, updateOffer, deleteOffer
};
