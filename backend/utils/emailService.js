const { Resend } = require('resend');

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Send email via Resend
 * Note: Free tier only sends to verified emails. Verify domain for sending to any email.
 */
const sendEmail = async ({ to, subject, html, from }) => {
  console.log('📧 Attempting to send email to:', to);
  console.log('📧 Subject:', subject);
  
  if (!resend) {
    console.log('❌ Resend not configured');
    throw new Error('Email service not configured');
  }
  
  try {
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
      throw new Error(result.error.message || 'Resend failed');
    }
  } catch (error) {
    console.log('❌ Email failed:', error.message);
    throw error;
  }
};

/**
 * Send email to admin only (works on free tier)
 */
const sendAdminEmail = async ({ subject, html }) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  return sendEmail({ to: adminEmail, subject, html });
};

/**
 * Send bulk emails (admin only on free tier)
 */
const sendBulkEmails = async (emails) => {
  const results = [];
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  
  for (const email of emails) {
    try {
      // On free tier, only send to admin/verified emails
      const targetEmail = email.to;
      
      const result = await sendEmail({
        to: targetEmail,
        subject: email.subject,
        html: email.html
      });
      results.push({ to: targetEmail, success: true, id: result.id });
      
      // Small delay between emails
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      results.push({ to: email.to, success: false, error: error.message });
      console.log('❌ Bulk email failed for:', email.to, error.message);
    }
  }
  
  return results;
};

module.exports = { sendEmail, sendAdminEmail, sendBulkEmails };
