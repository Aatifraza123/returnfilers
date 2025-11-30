const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');

// Middleware import (aapke path ke hisab se adjust karein)
const { protect, admin } = require('../middleware/authMiddleware');

// Public & Admin Routes mixed
router.route('/')
  .get(getServices)
  .post(protect, admin, createService);

// ID specific routes (Get, Update, Delete)
router.route('/:id')
  .get(getServiceById)          // Public: Single Service dekhne ke liye
  .put(protect, admin, updateService)   // Admin: Update karne ke liye
  .delete(protect, admin, deleteService); // Admin: Delete karne ke liye

module.exports = router;
