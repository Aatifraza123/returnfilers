const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
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
router.get('/admin/all', protect, getAllTestimonials);
router.post('/admin', protect, createTestimonial);
router.put('/admin/:id', protect, updateTestimonial);
router.delete('/admin/:id', protect, deleteTestimonial);
router.patch('/admin/:id/toggle', protect, toggleTestimonial);

module.exports = router;
