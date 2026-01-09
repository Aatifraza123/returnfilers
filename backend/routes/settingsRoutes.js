const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes (for testing - remove protect/admin temporarily)
router.get('/', getSettings);
router.put('/', updateSettings); // Temporarily public for testing

module.exports = router;
