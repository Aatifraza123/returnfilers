require('dotenv').config();
const { sendEmail } = require('./utils/emailService');

console.log('🔍 Testing Email Service\n');
console.log('Configuration:');
console.log('- SMTP Host:', process.env.SMTP_HOST);
console.log('- Email User:', process.env.EMAIL_USER);
console.log('- Password:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET');
console.log('- Admin Email:', process.env.ADMIN_EMAIL);
console.log('\n');

async function testEmail() {
  try {
    console.log('📧 Sending test email...\n');
    
    const result = await sendEmail({
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: 'Test Email - ' + new Date().toLocaleString(),
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #0B1530;">✅ Email Service Working!</h2>
          <p>This is a test email from ReturnFilers backend.</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          <p><strong>Provider:</strong> ${process.env.SMTP_HOST}</p>
          <hr>
          <p style="color: #D4AF37; font-weight: bold;">ReturnFilers</p>
          <p style="font-size: 12px;">Professional Tax & Financial Services</p>
          <p style="font-size: 12px;"><a href="https://returnfilers.in">www.returnfilers.in</a></p>
        </body>
        </html>
      `
    });
    
    console.log('\n✅ SUCCESS!');
    console.log('Provider:', result.provider);
    console.log('Message ID:', result.id);
    console.log('\n🎉 Email service is working correctly!');
    
  } catch (error) {
    console.log('\n❌ FAILED!');
    console.log('Error:', error.message);
    console.log('\n🔧 TROUBLESHOOTING:');
    
    if (process.env.SMTP_HOST?.includes('zoho')) {
      console.log('\nZoho Mail Issues:');
      console.log('1. Check if SMTP is enabled in Zoho Mail settings');
      console.log('2. Try using your actual Zoho password (if no 2FA)');
      console.log('3. Generate a fresh app-specific password');
      console.log('4. Verify email account is active');
      console.log('\nOR switch to Gmail temporarily:');
      console.log('1. Comment out Zoho settings in .env');
      console.log('2. Uncomment Gmail settings');
      console.log('3. Add Gmail app password');
    } else if (process.env.SMTP_HOST?.includes('gmail')) {
      console.log('\nGmail Issues:');
      console.log('1. Enable 2-Step Verification in Google Account');
      console.log('2. Generate App Password: https://myaccount.google.com/apppasswords');
      console.log('3. Use the 16-character app password in .env');
    }
  }
}

testEmail();
