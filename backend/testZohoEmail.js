require('dotenv').config();
const nodemailer = require('nodemailer');

// Check if nodemailer is properly loaded
if (!nodemailer || !nodemailer.createTransport) {
  console.error('❌ Nodemailer not properly loaded!');
  process.exit(1);
}

console.log('🔍 Testing Zoho SMTP Configuration...\n');

// Test configuration
const config = {
  host: process.env.SMTP_HOST,
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS
};

console.log('Configuration:');
console.log('- Host:', config.host);
console.log('- User:', config.user);
console.log('- Pass:', config.pass ? '***' + config.pass.slice(-4) : 'NOT SET');
console.log('\n');

// Test 1: Port 465 with SSL
async function testPort465() {
  console.log('📧 Test 1: Port 465 (SSL)...');
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: 465,
    secure: true,
    auth: {
      user: config.user,
      pass: config.pass
    },
    tls: {
      rejectUnauthorized: false,
      ciphers: 'SSLv3'
    },
    debug: true,
    logger: true
  });

  try {
    await transporter.verify();
    console.log('✅ Port 465 (SSL) - SUCCESS!\n');
    return transporter;
  } catch (error) {
    console.log('❌ Port 465 (SSL) - FAILED:', error.message);
    console.log('Error code:', error.code);
    console.log('Response:', error.response);
    console.log('\n');
    return null;
  }
}

// Test 2: Port 587 with STARTTLS
async function testPort587() {
  console.log('📧 Test 2: Port 587 (STARTTLS)...');
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: 587,
    secure: false,
    auth: {
      user: config.user,
      pass: config.pass
    },
    tls: {
      rejectUnauthorized: false
    },
    debug: true,
    logger: true
  });

  try {
    await transporter.verify();
    console.log('✅ Port 587 (STARTTLS) - SUCCESS!\n');
    return transporter;
  } catch (error) {
    console.log('❌ Port 587 (STARTTLS) - FAILED:', error.message);
    console.log('Error code:', error.code);
    console.log('Response:', error.response);
    console.log('\n');
    return null;
  }
}

// Test 3: Send actual email
async function sendTestEmail(transporter) {
  if (!transporter) {
    console.log('⚠️ No working transporter found. Skipping email send test.\n');
    return;
  }

  console.log('📧 Test 3: Sending test email...');
  try {
    const info = await transporter.sendMail({
      from: `"ReturnFilers" <${config.user}>`,
      to: process.env.ADMIN_EMAIL || config.user,
      subject: 'Zoho SMTP Test - ' + new Date().toLocaleString(),
      html: `
        <h2>Zoho SMTP Test Successful!</h2>
        <p>This email confirms that your Zoho SMTP configuration is working correctly.</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        <p><strong>From:</strong> ${config.user}</p>
      `
    });
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  } catch (error) {
    console.log('❌ Email send failed:', error.message);
    console.log('Error code:', error.code);
    console.log('Response:', error.response);
  }
}

// Run all tests
async function runTests() {
  console.log('='.repeat(60));
  console.log('Starting Zoho SMTP Tests...');
  console.log('='.repeat(60));
  console.log('\n');

  let workingTransporter = null;

  // Test port 465
  workingTransporter = await testPort465();
  
  // If 465 failed, test port 587
  if (!workingTransporter) {
    workingTransporter = await testPort587();
  }

  // If either worked, try sending email
  if (workingTransporter) {
    await sendTestEmail(workingTransporter);
  }

  console.log('\n');
  console.log('='.repeat(60));
  console.log('Tests Complete');
  console.log('='.repeat(60));
  
  if (!workingTransporter) {
    console.log('\n⚠️ TROUBLESHOOTING STEPS:');
    console.log('1. Verify IMAP Access is enabled in Zoho Mail settings');
    console.log('2. Generate a NEW app-specific password:');
    console.log('   - Go to: https://accounts.zoho.com/home#security/application-specific-passwords');
    console.log('   - Delete old passwords and create a new one');
    console.log('3. Check if your Zoho account has 2FA enabled');
    console.log('4. Verify domain is properly configured in Zoho');
    console.log('5. Try logging into Zoho webmail to ensure account is active');
    console.log('6. Check if there are any security restrictions on your account');
  }
}

runTests().catch(console.error);
