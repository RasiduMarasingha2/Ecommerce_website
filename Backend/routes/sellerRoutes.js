const express = require('express');
const router = express.Router();
const { createProduct } = require('../controllers/seller/sellerController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { uploadImage, uploadModel } = require('../middleware/uploadMiddleware');

router.post('/products', protect, authorizeRoles('seller', 'admin'), uploadImage.fields([{ name: 'images', maxCount: 5 }, { name: 'model', maxCount: 1 }]), createProduct);

module.exports = router;
