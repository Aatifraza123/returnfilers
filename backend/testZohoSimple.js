require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔍 Simple Zoho SMTP Test\n');
console.log('Email:', process.env.EMAIL_USER);
console.log('Password:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET');
console.log('\n');

// Create transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true,
  logger: true
});

// Test connection
console.log('Testing connection...\n');
transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ Connection FAILED:');
    console.log('Error:', error.message);
    console.log('Code:', error.code);
    console.log('Response:', error.response);
    console.log('\n');
    console.log('🔧 TROUBLESHOOTING:');
    console.log('1. Check if SMTP is enabled in Zoho Mail settings (not just IMAP)');
    console.log('2. Try using your actual Zoho password (if no 2FA)');
    console.log('3. Generate a fresh app-specific password');
    console.log('4. Verify the email account is active and not locked');
  } else {
    console.log('✅ Connection SUCCESSFUL!');
    console.log('Server is ready to send emails');
  }
  process.exit(error ? 1 : 0);
});
