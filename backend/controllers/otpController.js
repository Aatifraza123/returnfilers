const { sendEmail } = require('../utils/emailService');

// In-memory OTP storage (for production, use Redis or database)
const otpStorage = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Send OTP to email
// @route   POST /api/otp/send-email-otp
// @access  Public
const sendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP in memory (use Redis in production)
    otpStorage.set(email, {
      otp,
      expires: otpExpire,
      attempts: 0
    });

    // Send OTP email
    try {
      await sendEmail({
        to: email,
        subject: 'Email Verification - ReturnFilers',
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Email Verification</title>
<style type="text/css">
body { margin: 0; padding: 0; width: 100% !important; min-height: 100vh; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; max-width: 100%; display: block; }
@media only screen and (max-width: 600px) {
  .email-container { width: 100% !important; min-width: 100% !important; }
  .email-padding { padding: 20px !important; }
  .text-content { width: 100% !important; max-width: 100% !important; }
  img { max-width: 100% !important; height: auto !important; }
}
</style>
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f5f5f5;width:100%;min-height:100vh;">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f5f5f5;width:100%;min-height:100vh;">
<tr><td align="center" style="padding:0;">
<table class="email-container" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color:#ffffff;max-width:600px;width:100%;margin:0;padding:0;border:0;">
<tr><td align="center" class="email-padding" style="padding:20px;">
<img src="https://res.cloudinary.com/derzj7d4u/image/upload/v1767980265/Minimalist_logo_with_blue_and_gray_color_scheme-removebg-preview_cngnod.png" alt="ReturnFilers" width="100" height="auto" style="display:block;border:0;max-width:100px;width:100%;height:auto;margin:0 auto;" />
</td></tr>
<tr><td class="email-padding" style="padding:30px 40px;">
<div class="text-content" style="max-width:540px;margin:0 auto;">
<h2 style="margin:0 0 20px 0;font-size:18px;font-weight:600;color:#000000;font-family:Arial,Helvetica,sans-serif;">Email Verification</h2>
<p style="margin:0 0 20px 0;font-size:14px;line-height:1.6;color:#333333;">Please verify your email address using the OTP below:</p>
<div style="background-color:#f5f5f5;border:2px solid #dddddd;padding:30px;text-align:center;margin:25px 0;">
<p style="color:#666666;font-size:13px;margin:0 0 15px 0;">Your OTP Code</p>
<h1 style="color:#000000;font-size:36px;letter-spacing:6px;margin:0;font-weight:700;">${otp}</h1>
</div>
<p style="color:#666666;font-size:13px;margin:20px 0;text-align:center;font-weight:500;">This OTP will expire in 10 minutes</p>
<div style="background-color:#f5f5f5;border-left:3px solid #999999;padding:14px;margin:20px 0;">
<p style="color:#333333;font-size:13px;margin:0;line-height:1.5;"><strong>Security Note:</strong> Never share this OTP with anyone.</p>
</div>
</div>
</td></tr>
<tr><td align="center" class="email-padding" style="padding:20px 40px;background-color:#f5f5f5;">
<div class="text-content" style="max-width:540px;margin:0 auto;">
<p style="margin:0 0 10px 0;font-size:13px;color:#666666;font-family:Arial,Helvetica,sans-serif;"><a href="https://returnfilers.in" style="color:#000000;text-decoration:none;">returnfilers.in</a> | <a href="mailto:info@returnfilers.in" style="color:#000000;text-decoration:none;">info@returnfilers.in</a></p>
<p style="margin:10px 0 0 0;font-size:12px;color:#999999;font-family:Arial,Helvetica,sans-serif;">© ${new Date().getFullYear()} ReturnFilers. All rights reserved.</p>
</div>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
      });

      res.json({
        success: true,
        message: 'OTP sent successfully to your email',
        // For development only - remove in production
        ...(process.env.NODE_ENV === 'development' && { devOTP: otp })
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Remove OTP from storage if email fails
      otpStorage.delete(email);
      
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
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

// @desc    Verify email OTP
// @route   POST /api/otp/verify-email-otp
// @access  Public
const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Get stored OTP
    const storedData = otpStorage.get(email);

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found. Please request a new one.'
      });
    }

    // Check OTP expiry
    if (Date.now() > storedData.expires) {
      otpStorage.delete(email);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check attempts (max 3)
    if (storedData.attempts >= 3) {
      otpStorage.delete(email);
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      storedData.attempts += 1;
      otpStorage.set(email, storedData);
      
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${3 - storedData.attempts} attempts remaining.`
      });
    }

    // OTP verified successfully
    otpStorage.delete(email);

    res.json({
      success: true,
      message: 'Email verified successfully!',
      verified: true
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
  sendEmailOTP,
  verifyEmailOTP
};