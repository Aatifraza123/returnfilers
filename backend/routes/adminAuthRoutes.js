const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword
} = require('../controllers/adminAuthController');
const { protectAdmin } = require('../middleware/adminAuthMiddleware');

// Public routes
router.post('/login', loginAdmin);

// Protected routes
router.get('/me', protectAdmin, getAdminProfile);
router.put('/profile', protectAdmin, updateAdminProfile);
router.put('/change-password', protectAdmin, changeAdminPassword);

module.exports = router;
