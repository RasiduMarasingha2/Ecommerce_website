const express = require('express');
const router = express.Router();
const { saveUserOnboarding, getRecommendations } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

// Using protect middleware to ensure only logged-in users can save/get recommendations
router.post('/onboarding', protect, saveUserOnboarding);
router.get('/:userId', protect, getRecommendations);

module.exports = router;
