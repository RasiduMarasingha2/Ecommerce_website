const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/admin/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/users', protect, authorizeRoles('admin'), getUsers);

module.exports = router;
