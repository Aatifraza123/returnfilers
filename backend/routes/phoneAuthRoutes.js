const express = require('express');
const router = express.Router();
const {
  sendPhoneOTP,
  verifyPhoneOTP
} = require('../controllers/phoneAuthController');

// Phone authentication routes
router.post('/send-otp', sendPhoneOTP);
router.post('/verify-otp', verifyPhoneOTP);

module.exports = router;
