const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/adminAuthMiddleware');
const { protectUser } = require('../middleware/userAuth');
const { verifyRecaptcha } = require('../middleware/recaptchaMiddleware');
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

// Public route - anyone can submit (with reCAPTCHA, except AI Chatbot)
router.post('/', (req, res, next) => {
  // Skip reCAPTCHA for AI Chatbot submissions
  if (req.body.source === 'AI Chatbot') {
    return next();
  }
  // Apply reCAPTCHA for other sources
  return verifyRecaptcha(0.5)(req, res, next);
}, createConsultation);

// Admin routes - protected
router.get('/', protectAdmin, getConsultations);
router.get('/:id', protectAdmin, getConsultationById);
router.patch('/:id', protectAdmin, updateConsultation);
router.delete('/:id', protectAdmin, deleteConsultation);

module.exports = router;












