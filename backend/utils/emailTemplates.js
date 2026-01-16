/**
 * Email Templates for ReturnFilers
 * Clean, simple, spam-free
 */

const getEmailTemplate = ({ title, content, footerText, ctaButton, unsubscribeUrl }) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${title}</title>
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
<h2 style="margin:0 0 20px 0;font-size:18px;font-weight:600;color:#000000;font-family:Arial,Helvetica,sans-serif;">${title}</h2>
<div style="color:#333333;font-size:14px;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
${content}
</div>
${ctaButton ? `<table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:25px 0 0 0;"><tr><td align="center"><a href="${ctaButton.url}" style="display:inline-block;padding:12px 30px;background-color:#000000;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;font-family:Arial,Helvetica,sans-serif;">${ctaButton.text}</a></td></tr></table>` : ''}
</div>
</td></tr>
<tr><td align="center" class="email-padding" style="padding:20px 40px;background-color:#f5f5f5;">
<div class="text-content" style="max-width:540px;margin:0 auto;">
<p style="margin:0 0 10px 0;font-size:13px;color:#666666;font-family:Arial,Helvetica,sans-serif;">${footerText || 'Your trusted partner for professional tax and financial services'}</p>
<p style="margin:0 0 10px 0;font-size:13px;color:#666666;font-family:Arial,Helvetica,sans-serif;"><a href="https://returnfilers.in" style="color:#000000;text-decoration:none;">returnfilers.in</a> | <a href="mailto:info@returnfilers.in" style="color:#000000;text-decoration:none;">info@returnfilers.in</a></p>
${unsubscribeUrl ? `<p style="margin:10px 0 0 0;font-size:12px;color:#999999;font-family:Arial,Helvetica,sans-serif;"><a href="${unsubscribeUrl}" style="color:#999999;text-decoration:underline;">Unsubscribe</a></p>` : ''}
<p style="margin:10px 0 0 0;font-size:12px;color:#999999;font-family:Arial,Helvetica,sans-serif;">© ${new Date().getFullYear()} ReturnFilers. All rights reserved.</p>
</div>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
};

const getAdminNotificationTemplate = ({ type, data }) => {
  let content = '';
  let title = '';
  
  if (type === 'contact') {
    title = 'New Contact Inquiry';
    content = `<p style="margin:0 0 16px 0;color:#333333;">You have received a new contact inquiry.</p><table width="100%" cellpadding="12" cellspacing="0" border="0" style="background:#f5f5f5;margin:20px 0;"><tr><td><p style="margin:0 0 6px 0;color:#000000;font-weight:600;font-size:13px;">Name</p><p style="margin:0 0 12px 0;color:#333333;">${data.name}</p><p style="margin:0 0 6px 0;color:#000000;font-weight:600;font-size:13px;">Email</p><p style="margin:0 0 12px 0;"><a href="mailto:${data.email}" style="color:#000000;text-decoration:none;">${data.email}</a></p><p style="margin:0 0 6px 0;color:#000000;font-weight:600;font-size:13px;">Phone</p><p style="margin:0 0 12px 0;"><a href="tel:${data.phone}" style="color:#000000;text-decoration:none;">${data.phone || 'Not provided'}</a></p><p style="margin:12px 0 6px 0;padding-top:12px;color:#000000;font-weight:600;font-size:13px;">Message</p><p style="margin:0;color:#333333;line-height:1.6;">${data.message}</p></td></tr></table><p style="margin:16px 0 0 0;color:#333333;">Please respond within 24 hours.</p>`;
  } else if (type === 'consultation') {
    title = 'New Consultation Request';
    content = `<p style="margin:0 0 16px 0;color:#333333;">A new consultation request has been submitted.</p><table width="100%" cellpadding="12" cellspacing="0" border="0" style="background:#f5f5f5;margin:20px 0;"><tr><td><p style="margin:0 0 6px 0;color:#000000;font-weight:600;font-size:13px;">Name</p><p style="margin:0 0 12px 0;color:#333333;">${data.name}</p><p style="margin:0 0 6px 0;color:#000000;font-weight:600;font-size:13px;">Email</p><p style="margin:0 0 12px 0;"><a href="mailto:${data.email}" style="color:#000000;text-decoration:none;">${data.email}</a></p><p style="margin:0 0 6px 0;color:#000000;font-weight:600;font-size:13px;">Phone</p><p style="margin:0 0 12px 0;"><a href="tel:${data.phone}" style="color:#000000;text-decoration:none;">${data.phone || 'Not provided'}</a></p><p style="margin:0 0 6px 0;color:#000000;font-weight:600;font-size:13px;">Service</p><p style="margin:0 0 12px 0;color:#000000;font-weight:600;">${data.service}</p>${data.message ? `<p style="margin:12px 0 6px 0;padding-top:12px;color:#000000;font-weight:600;font-size:13px;">Additional Notes</p><p style="margin:0;color:#333333;line-height:1.6;">${data.message}</p>` : ''}</td></tr></table><p style="margin:16px 0 0 0;color:#333333;">Schedule consultation within 24 hours.</p>`;
  } else if (type === 'quote') {
    title = 'New Quote Request';
    content = `<p style="margin:0 0 16px 0;color:#333333;">A new quote request has been received.</p><table width="100%" cellpadding="12" cellspacing="0" border="0" style="background:#f5f5f5;margin:20px 0;"><tr><td><p style="margin:0 0 6px 0;color:#000000;font-weight:600;font-size:13px;">Name</p><p style="margin:0 0 12px 0;color:#333333;">${data.name}</p><p style="margin:0 0 6px 0;color:#000000;font-weight:600;font-size:13px;">Email</p><p style="margin:0 0 12px 0;"><a href="mailto:${data.email}" style="color:#000000;text-decoration:none;">${data.email}</a></p><p style="margin:0 0 6px 0;color:#000000;font-weight:600;font-size:13px;">Phone</p><p style="margin:0 0 12px 0;"><a href="tel:${data.phone}" style="color:#000000;text-decoration:none;">${data.phone || 'Not provided'}</a></p><p style="margin:0 0 6px 0;color:#000000;font-weight:600;font-size:13px;">Service</p><p style="margin:0 0 12px 0;color:#000000;font-weight:600;">${data.service}</p>${data.message ? `<p style="margin:12px 0 6px 0;padding-top:12px;color:#000000;font-weight:600;font-size:13px;">Requirements</p><p style="margin:0;color:#333333;line-height:1.6;">${data.message}</p>` : ''}</td></tr></table><p style="margin:16px 0 0 0;color:#333333;">Send quote within 24-48 hours.</p>`;
  } else if (type === 'booking') {
    title = 'New Service Booking';
    content = `<p style="margin:0 0 16px 0;color:#333333;">A new service booking has been confirmed.</p><table width="100%" cellpadding="12" cellspacing="0" border="0" style="background:#f5f5f5;margin:20px 0;"><tr><td><p style="margin:0 0 6px 0;color:#000000;font-weight:600;font-size:13px;">Name</p><p style="margin:0 0 12px 0;color:#333333;">${data.name}</p><p style="margin:0 0 6px 0;color:#000000;font-weight:600;font-size:13px;">Email</p><p style="margin:0 0 12px 0;"><a href="mailto:${data.email}" style="color:#000000;text-decoration:none;">${data.email}</a></p><p style="margin:0 0 6px 0;color:#000000;font-weight:600;font-size:13px;">Phone</p><p style="margin:0 0 12px 0;"><a href="tel:${data.phone}" style="color:#000000;text-decoration:none;">${data.phone || 'Not provided'}</a></p><p style="margin:0 0 6px 0;color:#000000;font-weight:600;font-size:13px;">Service</p><p style="margin:0 0 12px 0;color:#000000;font-weight:600;">${data.service}</p>${data.preferredDate ? `<p style="margin:0 0 6px 0;color:#000000;font-weight:600;font-size:13px;">Preferred Date</p><p style="margin:0 0 12px 0;color:#333333;">${data.preferredDate}</p>` : ''}${data.preferredTime ? `<p style="margin:0 0 6px 0;color:#000000;font-weight:600;font-size:13px;">Preferred Time</p><p style="margin:0;color:#333333;">${data.preferredTime}</p>` : ''}</td></tr></table><p style="margin:16px 0 0 0;color:#333333;">Confirm booking and schedule appointment.</p>`;
  }

  return getEmailTemplate({ title, content, footerText: 'Automated notification from ReturnFilers admin panel' });
};

const getCustomerConfirmationTemplate = ({ type, data }) => {
  let content = '';
  let title = '';

  if (type === 'contact') {
    title = 'Thank You for Contacting Us';
    content = `<p style="margin:0 0 16px 0;color:#333333;">Hi <strong>${data.name}</strong>,</p><p style="margin:0 0 16px 0;color:#333333;">Thank you for reaching out to ReturnFilers. We have received your message.</p><table width="100%" cellpadding="12" cellspacing="0" border="0" style="background:#f5f5f5;margin:20px 0;"><tr><td><p style="margin:0 0 8px 0;color:#000000;font-weight:600;font-size:13px;">Your Message:</p><p style="margin:0;color:#333333;line-height:1.6;">${data.message}</p></td></tr></table><p style="margin:16px 0;color:#333333;">Our team will respond within 24 hours.</p><p style="margin:20px 0 0 0;color:#333333;">Best regards,<br><strong style="color:#000000;">Team ReturnFilers</strong></p>`;
  } else if (type === 'consultation') {
    title = 'Consultation Request Confirmed';
    content = `<p style="margin:0 0 16px 0;color:#333333;">Hi <strong>${data.name}</strong>,</p><p style="margin:0 0 16px 0;color:#333333;">Thank you for requesting a consultation with ReturnFilers.</p><table width="100%" cellpadding="12" cellspacing="0" border="0" style="background:#f5f5f5;margin:20px 0;"><tr><td><p style="margin:0 0 6px 0;color:#000000;font-weight:600;font-size:13px;">Service</p><p style="margin:0;color:#000000;font-weight:600;">${data.service}</p>${data.message ? `<p style="margin:12px 0 6px 0;padding-top:12px;color:#000000;font-weight:600;font-size:13px;">Your Notes</p><p style="margin:0;color:#333333;line-height:1.6;">${data.message}</p>` : ''}</td></tr></table><p style="margin:16px 0;color:#333333;">Our team will contact you shortly to schedule your consultation.</p><p style="margin:20px 0 0 0;color:#333333;">Best regards,<br><strong style="color:#000000;">Team ReturnFilers</strong></p>`;
  } else if (type === 'quote') {
    title = 'Quote Request Received';
    content = `<p style="margin:0 0 16px 0;color:#333333;">Hi <strong>${data.name}</strong>,</p><p style="margin:0 0 16px 0;color:#333333;">Thank you for requesting a quote for <strong>${data.service}</strong>.</p><table width="100%" cellpadding="12" cellspacing="0" border="0" style="background:#f5f5f5;margin:20px 0;"><tr><td><p style="margin:0 0 6px 0;color:#000000;font-weight:600;font-size:13px;">Service</p><p style="margin:0;color:#000000;font-weight:600;">${data.service}</p>${data.message ? `<p style="margin:12px 0 6px 0;padding-top:12px;color:#000000;font-weight:600;font-size:13px;">Requirements</p><p style="margin:0;color:#333333;line-height:1.6;">${data.message}</p>` : ''}</td></tr></table><p style="margin:16px 0;color:#333333;">You will receive a detailed quote within 24-48 hours.</p><p style="margin:20px 0 0 0;color:#333333;">Best regards,<br><strong style="color:#000000;">Team ReturnFilers</strong></p>`;
  } else if (type === 'booking') {
    title = 'Service Booking Confirmed';
    content = `<p style="margin:0 0 16px 0;color:#333333;">Hi <strong>${data.name}</strong>,</p><p style="margin:0 0 16px 0;color:#333333;">Your booking for <strong>${data.service}</strong> has been confirmed.</p><table width="100%" cellpadding="12" cellspacing="0" border="0" style="background:#f5f5f5;margin:20px 0;"><tr><td><p style="margin:0 0 6px 0;color:#000000;font-weight:600;font-size:13px;">Service</p><p style="margin:0 0 12px 0;color:#000000;font-weight:600;">${data.service}</p>${data.preferredDate ? `<p style="margin:0 0 6px 0;color:#000000;font-weight:600;font-size:13px;">Preferred Date</p><p style="margin:0 0 12px 0;color:#333333;">${data.preferredDate}</p>` : ''}${data.preferredTime ? `<p style="margin:0 0 6px 0;color:#000000;font-weight:600;font-size:13px;">Preferred Time</p><p style="margin:0;color:#333333;">${data.preferredTime}</p>` : ''}</td></tr></table><p style="margin:16px 0;color:#333333;">We will contact you shortly to confirm the details.</p><p style="margin:20px 0 0 0;color:#333333;">Best regards,<br><strong style="color:#000000;">Team ReturnFilers</strong></p>`;
  }

  return getEmailTemplate({ title, content });
};

// Bulk email template with unsubscribe (no title heading)
const getBulkEmailTemplate = ({ subject, content, recipientName, unsubscribeUrl }) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${subject}</title>
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
<p style="margin:0 0 16px 0;color:#333333;">Dear ${recipientName || 'Valued Client'},</p>
<div style="color:#333333;font-size:14px;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
${content}
</div>
<p style="margin:30px 0 0 0;color:#333333;">Best regards,<br><strong style="color:#000000;">Team ReturnFilers</strong></p>
</div>
</td></tr>
<tr><td align="center" class="email-padding" style="padding:20px 40px;background-color:#f5f5f5;">
<div class="text-content" style="max-width:540px;margin:0 auto;">
<p style="margin:0 0 10px 0;font-size:13px;color:#666666;font-family:Arial,Helvetica,sans-serif;">Thank you for being a valued member of the ReturnFilers community.</p>
<p style="margin:0 0 10px 0;font-size:13px;color:#666666;font-family:Arial,Helvetica,sans-serif;"><a href="https://returnfilers.in" style="color:#000000;text-decoration:none;">returnfilers.in</a> | <a href="mailto:info@returnfilers.in" style="color:#000000;text-decoration:none;">info@returnfilers.in</a></p>
${unsubscribeUrl ? `<p style="margin:10px 0 0 0;font-size:12px;color:#999999;font-family:Arial,Helvetica,sans-serif;"><a href="${unsubscribeUrl}" style="color:#999999;text-decoration:underline;">Unsubscribe</a></p>` : ''}
<p style="margin:10px 0 0 0;font-size:12px;color:#999999;font-family:Arial,Helvetica,sans-serif;">© ${new Date().getFullYear()} ReturnFilers. All rights reserved.</p>
</div>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
};

module.exports = {
  getEmailTemplate,
  getAdminNotificationTemplate,
  getCustomerConfirmationTemplate,
  getBulkEmailTemplate
};

