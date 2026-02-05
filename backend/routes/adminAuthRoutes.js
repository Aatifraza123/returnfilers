const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  googleLoginAdmin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword
} = require('../controllers/adminAuthController');
const { protectAdmin } = require('../middleware/adminAuthMiddleware');
const { verifyRecaptcha } = require('../middleware/recaptchaMiddleware');

// Public routes (with reCAPTCHA for login)
router.post('/login', verifyRecaptcha(0.7), loginAdmin);
router.post('/google', googleLoginAdmin);

// Protected routes
router.get('/me', protectAdmin, getAdminProfile);
router.put('/profile', protectAdmin, updateAdminProfile);
router.put('/change-password', protectAdmin, changeAdminPassword);

module.exports = router;
