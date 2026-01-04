const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  replyToBooking
} = require('../controllers/bookingController');

// Public
router.post('/', createBooking);

// Admin
router.get('/', protect, admin, getBookings);
router.post('/reply', protect, admin, replyToBooking);
router.get('/:id', protect, admin, getBookingById);
router.patch('/:id', protect, admin, updateBooking);
router.delete('/:id', protect, admin, deleteBooking);

module.exports = router;
