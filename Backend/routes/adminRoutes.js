const express = require('express');
const router = express.Router();
const { 
    getUsers, deleteUser, getDashboardStats, 
    getProducts, deleteProduct, getOrders, updateOrderStatus,
    getTheme, updateTheme, getContent, updateContent,
    getOffers, createOffer, updateOffer, deleteOffer
} = require('../controllers/admin/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const adminGuard = [protect, authorizeRoles('admin', 'superadmin')];

// Dashboard
router.get('/dashboard', adminGuard, getDashboardStats);

// Users
router.get('/users', adminGuard, getUsers);
router.delete('/users/:id', adminGuard, deleteUser);

// Products
router.get('/products', adminGuard, getProducts);
router.delete('/products/:id', adminGuard, deleteProduct);

// Orders
router.get('/orders', adminGuard, getOrders);
router.put('/orders/:id/status', adminGuard, updateOrderStatus);

// Theme
router.get('/theme', getTheme); // Public access for frontend to load theme
router.put('/theme', adminGuard, updateTheme);

// Homepage Content
router.get('/content', getContent); // Public access for frontend
router.put('/content', adminGuard, updateContent);

// Offers
router.get('/offers', getOffers); // Public
router.post('/offers', adminGuard, createOffer);
router.put('/offers/:id', adminGuard, updateOffer);
router.delete('/offers/:id', adminGuard, deleteOffer);

module.exports = router;
