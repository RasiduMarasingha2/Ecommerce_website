const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, forgotPassword, verifyOTP, resetPassword } = require('../controllers/auth/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

module.exports = router;
