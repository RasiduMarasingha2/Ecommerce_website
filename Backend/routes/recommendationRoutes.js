const express = require('express');
const router = express.Router();
const { saveUserOnboarding, getRecommendations } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');


router.post('/onboarding', protect, saveUserOnboarding);
router.get('/:userId', protect, getRecommendations);

module.exports = router;
