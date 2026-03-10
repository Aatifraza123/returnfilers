const express = require('express');
const router = express.Router();
const {
  sendEmailOTP,
  verifyEmailOTP
} = require('../controllers/otpController');

// Public OTP routes (no auth required)
router.post('/send-email-otp', sendEmailOTP);
router.post('/verify-email-otp', verifyEmailOTP);

module.exports = router;