const { Resend } = require('resend');
const nodemailer = require('nodemailer');

// Initialize Resend if API key exists
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Gmail transporter
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
 * Send email - Uses Gmail for all emails (more reliable for customer emails)
 */
const sendEmail = async ({ to, subject, html, from }) => {
  const fromEmail = from || `Tax Filer <${process.env.EMAIL_USER}>`;
  
  // Use Gmail (works for all recipients)
  const transporter = getGmailTransporter();
  if (transporter) {
    try {
      console.log('📧 Sending email via Gmail to:', to);
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
      
      // Try Resend as fallback (only works for verified domains)
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
        } catch (resendError) {
          console.log('❌ Resend also failed:', resendError.message);
        }
      }
      
      throw error;
    }
  }
  
  throw new Error('No email provider configured');
};

/**
 * Send bulk emails
 */
const sendBulkEmails = async (emails) => {
  const results = [];
  const transporter = getGmailTransporter();
  
  if (!transporter) {
    throw new Error('Email not configured');
  }
  
  for (const email of emails) {
    try {
      const result = await transporter.sendMail({
        from: `Tax Filer <${process.env.EMAIL_USER}>`,
        to: email.to,
        subject: email.subject,
        html: email.html
      });
      results.push({ to: email.to, success: true, id: result.messageId });
      console.log('✅ Bulk email sent to:', email.to);
    } catch (error) {
      results.push({ to: email.to, success: false, error: error.message });
      console.log('❌ Bulk email failed for:', email.to, error.message);
    }
  }
  
  return results;
};

module.exports = { sendEmail, sendBulkEmails };
