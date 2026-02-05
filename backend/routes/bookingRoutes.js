const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/adminAuthMiddleware');
const { protectUser } = require('../middleware/userAuth');
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

// User routes - protected (with reCAPTCHA)
router.post('/', protectUser, verifyRecaptcha(0.5), createBooking);
router.get('/my-bookings', protectUser, getUserBookings);

// Admin routes
router.get('/', protectAdmin, getBookings);
router.post('/reply', protectAdmin, replyToBooking);
router.get('/:id', protectAdmin, getBookingById);
router.patch('/:id', protectAdmin, updateBooking);
router.delete('/:id', protectAdmin, deleteBooking);

module.exports = router;
