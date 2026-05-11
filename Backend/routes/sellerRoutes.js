const express = require('express');
const router = express.Router();
const { 
    createProduct, getSellerDashboard, getSellerProducts, 
    updateProduct, deleteProduct, getSellerOrders, 
    getSellerProfile, updateSellerProfile 
} = require('../controllers/seller/sellerController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { uploadImage, uploadModel } = require('../middleware/uploadMiddleware');

// Dashboard & Analytics
router.get('/dashboard', protect, authorizeRoles('seller'), getSellerDashboard);

// Products
router.post('/products', protect, authorizeRoles('seller', 'admin'), uploadImage.fields([{ name: 'images', maxCount: 5 }, { name: 'model', maxCount: 1 }]), createProduct);
router.get('/products', protect, authorizeRoles('seller'), getSellerProducts);
router.put('/products/:id', protect, authorizeRoles('seller'), updateProduct);
router.delete('/products/:id', protect, authorizeRoles('seller', 'admin'), deleteProduct);

// Orders
router.get('/orders', protect, authorizeRoles('seller'), getSellerOrders);

// Profile
router.get('/profile', protect, authorizeRoles('seller'), getSellerProfile);
router.put('/profile', protect, authorizeRoles('seller'), updateSellerProfile);

module.exports = router;
