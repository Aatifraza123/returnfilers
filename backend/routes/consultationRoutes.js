const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createConsultation,
  getConsultations,
  getConsultationById,
  updateConsultation,
  deleteConsultation
} = require('../controllers/consultationController');

// Public route - anyone can submit
router.post('/', createConsultation);

// Admin routes - protected
router.get('/', protect, getConsultations);
router.get('/:id', protect, getConsultationById);
router.patch('/:id', protect, updateConsultation);
router.delete('/:id', protect, deleteConsultation);

module.exports = router;











