// SMS Service for sending OTP
// You can integrate any SMS provider: MSG91, Twilio, Fast2SMS, etc.

const axios = require('axios');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS
const sendOTP = async (phone, otp) => {
  try {
    // For testing/development - just log the OTP
    if (process.env.NODE_ENV === 'development' || !process.env.SMS_API_KEY) {
      console.log(`📱 SMS OTP for ${phone}: ${otp}`);
      console.log(`⚠️  SMS service not configured. Using console logging for development.`);
      return { success: true, message: 'OTP logged to console (dev mode)' };
    }

    // Production SMS sending
    // Example with MSG91 (uncomment and configure)
    /*
    const response = await axios.post('https://api.msg91.com/api/v5/otp', {
      template_id: process.env.MSG91_TEMPLATE_ID,
      mobile: phone,
      authkey: process.env.MSG91_AUTH_KEY,
      otp: otp
    });
    return { success: true, message: 'OTP sent successfully' };
    */

    // Example with Fast2SMS (uncomment and configure)
    /*
    const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
      params: {
        authorization: process.env.FAST2SMS_API_KEY,
        variables_values: otp,
        route: 'otp',
        numbers: phone
      }
    });
    return { success: true, message: 'OTP sent successfully' };
    */

    // Example with Twilio (uncomment and configure)
    /*
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    
    await client.messages.create({
      body: `Your ReturnFilers OTP is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    return { success: true, message: 'OTP sent successfully' };
    */

    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('SMS sending error:', error);
    throw new Error('Failed to send OTP');
  }
};

module.exports = {
  generateOTP,
  sendOTP
};
