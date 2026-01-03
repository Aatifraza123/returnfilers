const { Resend } = require('resend');
const nodemailer = require('nodemailer');

// Initialize Resend if API key exists
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Gmail transporter (fallback)
const getGmailTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }
  
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000
  });
};

/**
 * Send email using Resend (primary) or Gmail (fallback)
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} [options.from] - Sender (optional)
 */
const sendEmail = async ({ to, subject, html, from }) => {
  const fromEmail = from || `Tax Filer <${process.env.EMAIL_USER || 'noreply@taxfiler.in'}>`;
  
  // Try Resend first (works better on cloud)
  if (resend) {
    try {
      console.log('📧 Sending email via Resend...');
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
    } catch (error) {
      console.log('❌ Resend failed:', error.message);
    }
  }
  
  // Fallback to Gmail
  const transporter = getGmailTransporter();
  if (transporter) {
    try {
      console.log('📧 Sending email via Gmail...');
      const result = await transporter.sendMail({
        from: fromEmail,
        to: to,
        subject: subject,
        html: html
      });
      
      console.log('✅ Email sent via Gmail:', result.messageId);
      return { success: true, provider: 'gmail', id: result.messageId };
    } catch (error) {
      console.log('❌ Gmail failed:', error.message);
      throw error;
    }
  }
  
  throw new Error('No email provider configured');
};

/**
 * Send multiple emails
 */
const sendBulkEmails = async (emails) => {
  const results = [];
  
  for (const email of emails) {
    try {
      const result = await sendEmail(email);
      results.push({ ...email, ...result });
    } catch (error) {
      results.push({ ...email, success: false, error: error.message });
    }
  }
  
  return results;
};

module.exports = { sendEmail, sendBulkEmails };
