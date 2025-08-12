const express = require('express');
const router = express.Router();
const { login, getProfile } = require('../controllers/adminController');
const auth = require('../middleware/auth');

// @route   POST api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', login);

// @route   GET api/admin/profile
// @desc    Get admin profile
// @access  Private
router.get('/profile', auth, getProfile);

module.exports = router; 