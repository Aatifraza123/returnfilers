const { Resend } = require('resend');
const nodemailer = require('nodemailer');

// Initialize Resend if API key exists
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Gmail transporter - Try multiple configurations
const getGmailTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }
  
  // Use port 587 with STARTTLS - works better on cloud platforms
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false
    },
    connectionTimeout: 60000,
    greetingTimeout: 60000,
    socketTimeout: 60000,
    debug: true,
    logger: true
  });
};

/**
 * Send email - Uses Gmail with retry logic
 */
const sendEmail = async ({ to, subject, html, from }) => {
  const fromEmail = from || `Tax Filer <${process.env.EMAIL_USER}>`;
  
  console.log('📧 Attempting to send email to:', to);
  console.log('📧 From:', fromEmail);
  console.log('📧 Subject:', subject);
  
  // Try Gmail first
  const transporter = getGmailTransporter();
  if (transporter) {
    try {
      console.log('📧 Using Gmail SMTP (port 587)...');
      
      // Verify connection first
      await transporter.verify();
      console.log('✅ Gmail SMTP connection verified');
      
      const result = await transporter.sendMail({
        from: fromEmail,
        to: to,
        subject: subject,
        html: html
      });
      
      console.log('✅ Email sent via Gmail:', result.messageId);
      console.log('✅ Response:', result.response);
      return { success: true, provider: 'gmail', id: result.messageId };
    } catch (error) {
      console.log('❌ Gmail failed:', error.message);
      console.log('❌ Error code:', error.code);
      console.log('❌ Full error:', JSON.stringify(error, null, 2));
    }
  }
  
  // Try Resend as fallback
  if (resend) {
    try {
      console.log('📧 Trying Resend as fallback...');
      const result = await resend.emails.send({
        from: process.env.RESEND_FROM || 'Tax Filer <onboarding@resend.dev>',
        to: to,
        subject: subject,
        html: html
      });
      
      if (result.data?.id) {
        console.log('✅ Email sent via Resend:', result.data.id);
        return { success: true, provider: 'resend', id: result.data.id };
      }
      if (result.error) {
        console.log('❌ Resend error:', result.error);
      }
    } catch (resendError) {
      console.log('❌ Resend also failed:', resendError.message);
    }
  }
  
  console.log('❌ All email providers failed');
  throw new Error('Failed to send email - all providers failed');
};

/**
 * Send bulk emails
 */
const sendBulkEmails = async (emails) => {
  const results = [];
  
  for (const email of emails) {
    try {
      const result = await sendEmail({
        to: email.to,
        subject: email.subject,
        html: email.html
      });
      results.push({ to: email.to, success: true, id: result.id });
      console.log('✅ Bulk email sent to:', email.to);
      
      // Small delay between emails
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      results.push({ to: email.to, success: false, error: error.message });
      console.log('❌ Bulk email failed for:', email.to, error.message);
    }
  }
  
  return results;
};

module.exports = { sendEmail, sendBulkEmails };
