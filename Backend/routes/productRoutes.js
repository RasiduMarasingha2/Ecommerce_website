const express = require('express');
const router = express.Router();
const { getProducts, getProductById, getRelatedProducts, createProductReview } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);
router.post('/:id/reviews', protect, createProductReview);

module.exports = router;
