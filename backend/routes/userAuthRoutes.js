const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/userAuthController');
const { protectUser } = require('../middleware/userAuth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me', protectUser, getMe);
router.put('/profile', protectUser, updateProfile);
router.put('/change-password', protectUser, changePassword);

module.exports = router;
