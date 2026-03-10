const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { generateOTP, sendOTP } = require('../utils/smsService');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Send OTP to phone
// @route   POST /api/user/auth/phone/send-otp
// @access  Public
const sendPhoneOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Validate phone format (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit phone number'
      });
    }

    const fullPhone = `+91${phone}`;

    // Generate OTP
    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Check if user exists
    let user = await User.findOne({ phone: fullPhone });

    if (user) {
      // Update existing user's OTP
      user.mobileOTP = otp;
      user.mobileOTPExpire = otpExpire;
      await user.save();
    } else {
      // Create temporary user record for OTP verification
      user = await User.create({
        phone: fullPhone,
        mobileOTP: otp,
        mobileOTPExpire: otpExpire,
        isMobileVerified: false,
        isVerified: false,
        name: `User ${phone.slice(-4)}`,
        password: crypto.randomBytes(32).toString('hex') // Random password
      });
    }

    // Send OTP via SMS
    try {
      await sendOTP(fullPhone, otp);
      
      res.json({
        success: true,
        message: 'OTP sent successfully to your phone',
        phone: fullPhone,
        // For development only - remove in production
        ...(process.env.NODE_ENV === 'development' && { devOTP: otp })
      });
    } catch (smsError) {
      console.error('SMS sending failed:', smsError);
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again.'
      });
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending OTP'
    });
  }
};

// @desc    Verify phone OTP and login/register
// @route   POST /api/user/auth/phone/verify-otp
// @access  Public
const verifyPhoneOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
    }

    const fullPhone = `+91${phone}`;

    // Find user
    const user = await User.findOne({ phone: fullPhone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please request OTP first.'
      });
    }

    // Check OTP
    if (!user.mobileOTP || user.mobileOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Check OTP expiry
    if (user.mobileOTPExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Verify user
    user.isMobileVerified = true;
    user.isVerified = true;
    user.mobileOTP = undefined;
    user.mobileOTPExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Phone verified successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        isMobileVerified: user.isMobileVerified,
        avatar: user.avatar
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OTP verification'
    });
  }
};

module.exports = {
  sendPhoneOTP,
  verifyPhoneOTP
};
