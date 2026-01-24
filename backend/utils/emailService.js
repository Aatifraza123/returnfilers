const nodemailer = require('nodemailer');
const { Resend } = require('resend');

// Initialize Resend (fallback)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Initialize Nodemailer with SMTP (supports Zoho, Gmail, etc.)
const createTransporter = () => {
  // Use environment variables or fallback to hardcoded for testing
  const smtpHost = process.env.SMTP_HOST || 'smtppro.zoho.in';
  const emailUser = process.env.EMAIL_USER || 'info@returnfilers.in';
  const emailPass = process.env.EMAIL_PASS || 'rdwnce0XQPa5';
  
  if (!smtpHost || !emailUser || !emailPass) {
    return null;
  }

  console.log('🔧 Creating SMTP transporter:', {
    host: smtpHost,
    user: emailUser,
    pass: '***' + (emailPass?.slice(-4) || '')
  });

  // Detect provider and use appropriate settings
  const isZoho = smtpHost.includes('zoho');
  const isGmail = smtpHost.includes('gmail');

  let config = {
    host: smtpHost,
    auth: {
      user: emailUser,
      pass: emailPass
    }
  };

  if (isZoho) {
    // Try alternative Zoho configuration - smtp.zoho.in instead of smtppro
    const alternativeHost = 'smtp.zoho.in';
    config = {
      host: alternativeHost,
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass
      },
      tls: {
        rejectUnauthorized: false
      }
    };
    console.log('🔧 Using alternative Zoho config:', alternativeHost);
  } else if (isGmail) {
    // Gmail specific configuration
    config = {
      ...config,
      port: 587,
      secure: false,
      requireTLS: true,
      tls: {
        rejectUnauthorized: false
      }
    };
  } else {
    // Generic SMTP configuration
    config = {
      ...config,
      port: 587,
      secure: false,
      tls: {
        rejectUnauthorized: false
      }
    };
  }

  return nodemailer.createTransport(config);
};

/**
 * Send email via SMTP (Zoho) - Simple format to avoid spam
 */
const sendEmail = async ({ to, subject, html, text, from }) => {
  console.log('=================================================');
  console.log('📧 EMAIL SERVICE CALLED - ZOHO SMTP MODE');
  console.log('📧 To:', to);
  console.log('📧 Subject:', subject);
  console.log('=================================================');
  
  const transporter = createTransporter();
  if (!transporter) {
    throw new Error('SMTP transporter not configured');
  }
  
  try {
    console.log('🔄 Sending via Zoho SMTP...');
    
    const mailOptions = {
      from: from || `ReturnFilers <${process.env.EMAIL_USER || 'info@returnfilers.in'}>`,
      to: to,
      subject: subject,
      html: html,
      text: text || html.replace(/<[^>]*>/g, ''), // Auto-generate text from HTML
      headers: {
        'X-Mailer': 'Nodemailer',
        'Reply-To': process.env.EMAIL_USER || 'info@returnfilers.in'
      }
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅✅✅ EMAIL SENT VIA ZOHO SMTP:', info.messageId);
    console.log('=================================================');
    return { success: true, provider: 'smtp', id: info.messageId };
  } catch (error) {
    console.log('❌❌❌ SMTP FAILED:', error.message);
    console.log('❌ Error details:', error);
    console.log('=================================================');
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
