const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');

// Middleware import
const { protectAdmin } = require('../middleware/adminAuthMiddleware');

// Public & Admin Routes mixed
router.route('/')
  .get(getServices)
  .post(protectAdmin, createService);

// ID specific routes (Get, Update, Delete)
router.route('/:id')
  .get(getServiceById)          // Public: Single Service dekhne ke liye
  .put(protectAdmin, updateService)   // Admin: Update karne ke liye
  .delete(protectAdmin, deleteService); // Admin: Delete karne ke liye

module.exports = router;
