const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Login & Register
router.post('/login', loginUser);
router.post('/register', registerUser);

// Get Current User (Required for Dashboard)
router.get('/me', protect, getMe); 

module.exports = router;


