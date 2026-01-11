const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const { sendEmail } = require('../utils/emailService');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register new user
// @route   POST /api/user/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      // If user exists but not verified, resend OTP
      if (!userExists.isVerified) {
        // Generate new OTP
        const otp = generateOTP();
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000);
        
        userExists.emailOTP = otp;
        userExists.emailOTPExpire = otpExpire;
        await userExists.save();

        // Send OTP email
        try {
          console.log('📧 Resending OTP to existing unverified user:', email);
          await sendEmail({
            to: email,
            subject: 'Email Verification - OTP',
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { margin: 0; padding: 0; width: 100% !important; }
                  table { border-collapse: collapse; }
                  img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; pointer-events: none; }
                  @media only screen and (max-width: 600px) {
                    .email-container { width: 100% !important; }
                    .email-padding { padding: 20px !important; }
                    .email-header { padding: 12px 20px !important; }
                    .email-footer { padding: 12px 20px !important; }
                    .logo-img { max-width: 120px !important; height: auto !important; }
                  }
                </style>
              </head>
              <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; width: 100%;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
                  <tr>
                    <td align="center">
                      <table class="email-container" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 600px;">
                        
                        <!-- Header with Logo -->
                        <tr>
                          <td class="email-header" style="padding: 20px 40px; text-align: center; border-bottom: 1px solid #e5e7eb; background-color: #ffffff;">
                            <img src="https://res.cloudinary.com/derzj7d4u/image/upload/v1767980265/Minimalist_logo_with_blue_and_gray_color_scheme-removebg-preview_cngnod.png" alt="ReturnFilers" class="logo-img" style="max-width: 160px; height: auto; display: block; margin: 0 auto;" />
                          </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                          <td class="email-padding" style="padding: 40px;">
                            <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #111827;">Email Verification</h2>
                            <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #4b5563;">Please verify your email address using the OTP below:</p>
                            
                            <div style="background-color: #f9fafb; border: 2px solid #e5e7eb; padding: 30px; text-align: center; margin: 25px 0;">
                              <p style="color: #6b7280; font-size: 13px; margin: 0 0 15px 0;">Your OTP Code</p>
                              <h1 style="color: #111827; font-size: 36px; letter-spacing: 6px; margin: 0; font-weight: 700;">${otp}</h1>
                            </div>
                            
                            <p style="color: #ef4444; font-size: 13px; margin: 20px 0; text-align: center; font-weight: 500;">This OTP will expire in 10 minutes</p>
                            
                            <div style="background-color: #fef3c7; border-left: 3px solid #f59e0b; padding: 14px; margin: 20px 0;">
                              <p style="color: #92400e; font-size: 13px; margin: 0; line-height: 1.5;"><strong>Security Note:</strong> Never share this OTP with anyone.</p>
                            </div>
                          </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                          <td class="email-footer" style="padding: 20px 40px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px 0; font-size: 13px; color: #6b7280;">
                              <a href="https://returnfilers.in" style="color: #2563eb; text-decoration: none;">returnfilers.in</a> | 
                              <a href="mailto:info@returnfilers.in" style="color: #2563eb; text-decoration: none;">info@returnfilers.in</a>
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                              © ${new Date().getFullYear()} ReturnFilers. All rights reserved.
                            </p>
                          </td>
                        </tr>
                        
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
              </html>
            `
          });
          console.log('✅ OTP resent successfully');

          return res.status(200).json({
            success: true,
            message: 'Account exists but not verified. New OTP sent to your email.',
            userId: userExists._id,
            email: userExists.email
          });
        } catch (emailError) {
          console.error('❌ Email sending failed:', emailError);
          return res.status(500).json({
            success: false,
            message: 'Failed to send verification email. Please try again.'
          });
        }
      }
      
      // User exists and is verified
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user (not verified yet)
    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      emailOTP: otp,
      emailOTPExpire: otpExpire,
      isVerified: false
    });

    // Send OTP email
    try {
      console.log('📧 Sending OTP email to:', email);
      await sendEmail({
        to: email,
        subject: 'Email Verification - OTP',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { margin: 0; padding: 0; width: 100% !important; }
              table { border-collapse: collapse; }
              img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; pointer-events: none; }
              @media only screen and (max-width: 600px) {
                .email-container { width: 100% !important; }
                .email-padding { padding: 20px !important; }
                .email-header { padding: 12px 20px !important; }
                .email-footer { padding: 12px 20px !important; }
                .logo-img { max-width: 120px !important; height: auto !important; }
              }
            </style>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; width: 100%;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
              <tr>
                <td align="center">
                  <table class="email-container" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 600px;">
                    
                    <!-- Header with Logo -->
                    <tr>
                      <td class="email-header" style="padding: 20px 40px; text-align: center; border-bottom: 1px solid #e5e7eb; background-color: #ffffff;">
                        <img src="https://res.cloudinary.com/derzj7d4u/image/upload/v1767980265/Minimalist_logo_with_blue_and_gray_color_scheme-removebg-preview_cngnod.png" alt="ReturnFilers" class="logo-img" style="max-width: 160px; height: auto; display: block; margin: 0 auto;" />
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td class="email-padding" style="padding: 40px;">
                        <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #111827;">Welcome to ReturnFilers!</h2>
                        <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #4b5563;">Thank you for registering. Please verify your email address using the OTP below:</p>
                        
                        <div style="background-color: #f9fafb; border: 2px solid #e5e7eb; padding: 30px; text-align: center; margin: 25px 0;">
                          <p style="color: #6b7280; font-size: 13px; margin: 0 0 15px 0;">Your OTP Code</p>
                          <h1 style="color: #111827; font-size: 36px; letter-spacing: 6px; margin: 0; font-weight: 700;">${otp}</h1>
                        </div>
                        
                        <p style="color: #ef4444; font-size: 13px; margin: 20px 0; text-align: center; font-weight: 500;">This OTP will expire in 10 minutes</p>
                        
                        <div style="background-color: #fef3c7; border-left: 3px solid #f59e0b; padding: 14px; margin: 20px 0;">
                          <p style="color: #92400e; font-size: 13px; margin: 0; line-height: 1.5;"><strong>Security Note:</strong> Never share this OTP with anyone.</p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td class="email-footer" style="padding: 20px 40px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 10px 0; font-size: 13px; color: #6b7280;">
                          <a href="https://returnfilers.in" style="color: #2563eb; text-decoration: none;">returnfilers.in</a> | 
                          <a href="mailto:info@returnfilers.in" style="color: #2563eb; text-decoration: none;">info@returnfilers.in</a>
                        </p>
                        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                          © ${new Date().getFullYear()} ReturnFilers. All rights reserved.
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `
      });
      console.log('✅ OTP email sent successfully');

      res.status(201).json({
        success: true,
        message: 'Registration successful! Please check your email for OTP verification.',
        userId: user._id,
        email: user.email
      });
    } catch (emailError) {
      // If email fails, delete the user
      await User.findByIdAndDelete(user._id);
      console.error('❌ Email sending failed:', emailError);
      res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.'
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email first. Check your inbox for OTP.',
        requiresVerification: true,
        email: user.email
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('bookings')
      .populate('quotes')
      .populate('consultations');

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        bookings: user.bookings,
        quotes: user.quotes,
        consultations: user.consultations,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Request password reset
// @route   POST /api/user/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    
    // Send email with reset link
    try {
      await sendEmail({
        to: email,
        subject: 'Password Reset Request - ReturnFilers',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { margin: 0; padding: 0; width: 100% !important; }
              table { border-collapse: collapse; }
              img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; pointer-events: none; }
              @media only screen and (max-width: 600px) {
                .email-container { width: 100% !important; }
                .email-padding { padding: 20px !important; }
                .email-header { padding: 12px 20px !important; }
                .email-footer { padding: 12px 20px !important; }
                .logo-img { max-width: 120px !important; height: auto !important; }
              }
            </style>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; width: 100%;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
              <tr>
                <td align="center">
                  <table class="email-container" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 600px;">
                    
                    <!-- Header with Logo -->
                    <tr>
                      <td class="email-header" style="padding: 20px 40px; text-align: center; border-bottom: 1px solid #e5e7eb; background-color: #ffffff;">
                        <img src="https://res.cloudinary.com/derzj7d4u/image/upload/v1767980265/Minimalist_logo_with_blue_and_gray_color_scheme-removebg-preview_cngnod.png" alt="ReturnFilers" class="logo-img" style="max-width: 160px; height: auto; display: block; margin: 0 auto;" />
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td class="email-padding" style="padding: 40px;">
                        <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #111827;">Reset Your Password</h2>
                        <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
                          We received a request to reset your password. Click the button below to create a new password:
                        </p>
                        
                        <!-- Button -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                          <tr>
                            <td align="center">
                              <a href="${resetUrl}" style="display: inline-block; padding: 12px 30px; background: #111827; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px;">Reset Password</a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 20px 0 10px 0; font-size: 13px; line-height: 1.6; color: #6b7280;">
                          Or copy and paste this link into your browser:
                        </p>
                        <div style="background-color: #f9fafb; padding: 12px; word-break: break-all; font-size: 13px; color: #4b5563; border: 1px solid #e5e7eb;">
                          ${resetUrl}
                        </div>
                        
                        <!-- Warning -->
                        <div style="margin: 25px 0 0 0; padding: 14px; background-color: #fef3c7; border-left: 3px solid #f59e0b;">
                          <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #92400e;">
                            <strong>Important:</strong> This link will expire in 30 minutes. If you didn't request this password reset, please ignore this email.
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td class="email-footer" style="padding: 20px 40px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 10px 0; font-size: 13px; color: #6b7280;">
                          <a href="https://returnfilers.in" style="color: #2563eb; text-decoration: none;">returnfilers.in</a> | 
                          <a href="mailto:info@returnfilers.in" style="color: #2563eb; text-decoration: none;">info@returnfilers.in</a>
                        </p>
                        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                          © ${new Date().getFullYear()} ReturnFilers. All rights reserved.
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `
      });

      res.json({
        success: true,
        message: 'Password reset link sent to your email'
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Reset the token fields if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      
      res.status(500).json({
        success: false,
        message: 'Failed to send reset email. Please try again.'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide new password'
      });
    }

    // Hash token
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful',
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Google OAuth login
// @route   POST /api/user/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // Update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = picture;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
        isVerified: true, // Google accounts are pre-verified
        password: crypto.randomBytes(32).toString('hex') // Random password for Google users
      });
    }

    res.json({
      success: true,
      message: 'Google login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      message: 'Google authentication failed'
    });
  }
};

// @desc    Verify email OTP
// @route   POST /api/user/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP'
      });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    // Check OTP
    if (!user.emailOTP || user.emailOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Check OTP expiry
    if (user.emailOTPExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Verify user
    user.isVerified = true;
    user.emailOTP = undefined;
    user.emailOTPExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
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

// @desc    Resend OTP
// @route   POST /api/user/auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.emailOTP = otp;
    user.emailOTPExpire = otpExpire;
    await user.save();

    // Send OTP email
    try {
      await sendEmail({
        to: email,
        subject: 'Email Verification - New OTP',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { margin: 0; padding: 0; width: 100% !important; }
              table { border-collapse: collapse; }
              img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; pointer-events: none; }
              @media only screen and (max-width: 600px) {
                .email-container { width: 100% !important; }
                .email-padding { padding: 20px !important; }
                .email-header { padding: 12px 20px !important; }
                .email-footer { padding: 12px 20px !important; }
                .logo-img { max-width: 120px !important; height: auto !important; }
              }
            </style>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; width: 100%;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
              <tr>
                <td align="center">
                  <table class="email-container" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 600px;">
                    
                    <!-- Header with Logo -->
                    <tr>
                      <td class="email-header" style="padding: 20px 40px; text-align: center; border-bottom: 1px solid #e5e7eb; background-color: #ffffff;">
                        <img src="https://res.cloudinary.com/derzj7d4u/image/upload/v1767980265/Minimalist_logo_with_blue_and_gray_color_scheme-removebg-preview_cngnod.png" alt="ReturnFilers" class="logo-img" style="max-width: 160px; height: auto; display: block; margin: 0 auto;" />
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td class="email-padding" style="padding: 40px;">
                        <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #111827;">Email Verification</h2>
                        <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #4b5563;">Here is your new OTP for email verification:</p>
                        
                        <div style="background-color: #f9fafb; border: 2px solid #e5e7eb; padding: 30px; text-align: center; margin: 25px 0;">
                          <p style="color: #6b7280; font-size: 13px; margin: 0 0 15px 0;">Your OTP Code</p>
                          <h1 style="color: #111827; font-size: 36px; letter-spacing: 6px; margin: 0; font-weight: 700;">${otp}</h1>
                        </div>
                        
                        <p style="color: #ef4444; font-size: 13px; margin: 20px 0; text-align: center; font-weight: 500;">This OTP will expire in 10 minutes</p>
                        
                        <div style="background-color: #fef3c7; border-left: 3px solid #f59e0b; padding: 14px; margin: 20px 0;">
                          <p style="color: #92400e; font-size: 13px; margin: 0; line-height: 1.5;"><strong>Security Note:</strong> Never share this OTP with anyone.</p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td class="email-footer" style="padding: 20px 40px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 10px 0; font-size: 13px; color: #6b7280;">
                          <a href="https://returnfilers.in" style="color: #2563eb; text-decoration: none;">returnfilers.in</a> | 
                          <a href="mailto:info@returnfilers.in" style="color: #2563eb; text-decoration: none;">info@returnfilers.in</a>
                        </p>
                        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                          © ${new Date().getFullYear()} ReturnFilers. All rights reserved.
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `
      });

      res.json({
        success: true,
        message: 'New OTP sent to your email'
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OTP resend'
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  verifyOTP,
  resendOTP,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
};


