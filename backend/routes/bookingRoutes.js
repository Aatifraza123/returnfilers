const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/adminAuthMiddleware');
const { protectUser, optionalAuth } = require('../middleware/userAuth');
const { verifyRecaptcha } = require('../middleware/recaptchaMiddleware');
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  replyToBooking,
  getUserBookings
} = require('../controllers/bookingController');

// Public route with optional auth (works for both logged-in and guest users)
// Skip reCAPTCHA for AI Chatbot bookings
router.post('/', optionalAuth, (req, res, next) => {
  // Skip reCAPTCHA verification for AI Chatbot source
  if (req.body.source === 'AI Chatbot') {
    console.log('🤖 Skipping reCAPTCHA for AI Chatbot booking');
    return next();
  }
  // Apply reCAPTCHA for other sources
  return verifyRecaptcha(0.5)(req, res, next);
}, createBooking);

// User routes - protected
router.get('/my-bookings', protectUser, getUserBookings);

// Admin routes
router.get('/', protectAdmin, getBookings);
router.post('/reply', protectAdmin, replyToBooking);
router.get('/:id', protectAdmin, getBookingById);
router.patch('/:id', protectAdmin, updateBooking);
router.delete('/:id', protectAdmin, deleteBooking);

module.exports = router;
