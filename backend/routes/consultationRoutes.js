const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/adminAuthMiddleware');
const { protectUser } = require('../middleware/userAuth');
const {
  createConsultation,
  getConsultations,
  getConsultationById,
  updateConsultation,
  deleteConsultation,
  getUserConsultations
} = require('../controllers/consultationController');

// User route - get user's own consultations
router.get('/my-consultations', protectUser, getUserConsultations);

// Public route - anyone can submit (but will link to user if logged in)
router.post('/', protectUser, createConsultation);

// Admin routes - protected
router.get('/', protectAdmin, getConsultations);
router.get('/:id', protectAdmin, getConsultationById);
router.patch('/:id', protectAdmin, updateConsultation);
router.delete('/:id', protectAdmin, deleteConsultation);

module.exports = router;












