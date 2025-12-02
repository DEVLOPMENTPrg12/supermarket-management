const express = require('express');
const router = express.Router();
const { registerUser, authUser, getMe } = require('../controllers/authController');
const protect = require('../middleware/protect');
const authorizeRoles = require('../middleware/authorizeRoles');

// Public
router.post('/login', authUser);

// Private (Admin only)
router.post('/register', protect, authorizeRoles('admin'), registerUser);

// Private (any logged-in user)
router.get('/me', protect, getMe);

module.exports = router;
