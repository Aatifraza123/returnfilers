const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/adminAuthMiddleware');
const {
  getTestimonials,
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonial
} = require('../controllers/testimonialController');

// Public routes
router.get('/', getTestimonials);
router.get('/:id', getTestimonialById);

// Admin routes
router.get('/admin/all', protectAdmin, getAllTestimonials);
router.post('/admin', protectAdmin, createTestimonial);
router.put('/admin/:id', protectAdmin, updateTestimonial);
router.delete('/admin/:id', protectAdmin, deleteTestimonial);
router.patch('/admin/:id/toggle', protectAdmin, toggleTestimonial);

module.exports = router;
