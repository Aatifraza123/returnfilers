/**
 * Simple Clean Email Templates for ReturnFilers
 * No border radius, no gradients, no fancy colors
 */

const getEmailTemplate = ({ title, content, footerText, ctaButton, unsubscribeUrl }) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <!--<![endif]-->
      <style type="text/css">
        @media only screen and (max-width: 600px) {
          .email-container {
            width: 100% !important;
          }
          .email-padding {
            padding: 20px !important;
          }
          .logo-img {
            max-width: 140px !important;
          }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f5f5f5; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; margin: 0; padding: 0;">
        <tr>
          <td align="center" style="padding: 20px 10px;">
            <table class="email-container" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; max-width: 600px; width: 100%;">
              
              <!-- Header with Logo -->
              <tr>
                <td align="center" class="email-padding" style="padding: 30px 20px; border-bottom: 1px solid #e5e7eb; background-color: #ffffff;">
                  <img src="https://res.cloudinary.com/derzj7d4u/image/upload/v1767980265/Minimalist_logo_with_blue_and_gray_color_scheme-removebg-preview_cngnod.png" alt="ReturnFilers" class="logo-img" width="160" style="display: block; border: 0; max-width: 160px; height: auto; margin: 0 auto;" />
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="email-padding" style="padding: 30px 20px; color: #4b5563; font-size: 14px; line-height: 1.6;">
                  <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #111827; font-family: Arial, Helvetica, sans-serif;">${title}</h2>
                  <div style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0; font-family: Arial, Helvetica, sans-serif;">
                    ${content}
                  </div>
                  ${ctaButton ? `
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0 0 0;">
                      <tr>
                        <td align="center">
                          <a href="${ctaButton.url}" style="display: inline-block; padding: 12px 30px; background-color: #111827; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; font-family: Arial, Helvetica, sans-serif;">${ctaButton.text}</a>
                        </td>
                      </tr>
                    </table>
                  ` : ''}
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td align="center" class="email-padding" style="padding: 20px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px 0; font-size: 13px; color: #6b7280; font-family: Arial, Helvetica, sans-serif;">
                    ${footerText || 'Your trusted partner for professional tax and financial services'}
                  </p>
                  <p style="margin: 0 0 10px 0; font-size: 13px; color: #6b7280; font-family: Arial, Helvetica, sans-serif;">
                    <a href="https://returnfilers.in" style="color: #2563eb; text-decoration: none;">returnfilers.in</a> | 
                    <a href="mailto:info@returnfilers.in" style="color: #2563eb; text-decoration: none;">info@returnfilers.in</a>
                  </p>
                  ${unsubscribeUrl ? `
                  <p style="margin: 10px 0 0 0; font-size: 12px; color: #9ca3af; font-family: Arial, Helvetica, sans-serif;">
                    <a href="${unsubscribeUrl}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe from this list</a>
                  </p>
                  ` : ''}
                  <p style="margin: 10px 0 0 0; font-size: 12px; color: #9ca3af; font-family: Arial, Helvetica, sans-serif;">
                    © ${new Date().getFullYear()} ReturnFilers. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// Admin Notification Template - Ultra Simple & Clean
const getAdminNotificationTemplate = ({ type, data }) => {
  let content = '';
  let title = '';
  
  if (type === 'contact') {
    title = 'New Contact Inquiry';
    content = `
      <p style="margin: 0 0 16px 0; color: #4b5563;">You have received a new contact inquiry.</p>
      <div style="background: #f9fafb; padding: 16px; margin: 20px 0; border: 1px solid #e5e7eb;">
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Name</p>
        <p style="margin: 0 0 12px 0; color: #4b5563; font-size: 14px;">${data.name}</p>
        
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Email</p>
        <p style="margin: 0 0 12px 0;"><a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none; font-size: 14px;">${data.email}</a></p>
        
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Phone</p>
        <p style="margin: 0 0 12px 0;"><a href="tel:${data.phone}" style="color: #2563eb; text-decoration: none; font-size: 14px;">${data.phone || 'Not provided'}</a></p>
        
        <div style="padding-top: 12px; margin-top: 12px; border-top: 1px solid #e5e7eb;">
          <p style="color: #111827; font-weight: 600; margin: 0 0 6px 0; font-size: 13px;">Message</p>
          <p style="color: #4b5563; margin: 0; line-height: 1.6; font-size: 14px;">${data.message}</p>
        </div>
      </div>
      <p style="margin: 16px 0 0 0; color: #4b5563;">Please respond within 24 hours.</p>
    `;
  } else if (type === 'consultation') {
    title = 'New Consultation Request';
    content = `
      <p style="margin: 0 0 16px 0; color: #4b5563;">A new consultation request has been submitted.</p>
      <div style="background: #f9fafb; padding: 16px; margin: 20px 0; border: 1px solid #e5e7eb;">
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Name</p>
        <p style="margin: 0 0 12px 0; color: #4b5563; font-size: 14px;">${data.name}</p>
        
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Email</p>
        <p style="margin: 0 0 12px 0;"><a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none; font-size: 14px;">${data.email}</a></p>
        
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Phone</p>
        <p style="margin: 0 0 12px 0;"><a href="tel:${data.phone}" style="color: #2563eb; text-decoration: none; font-size: 14px;">${data.phone || 'Not provided'}</a></p>
        
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Service</p>
        <p style="margin: 0 0 12px 0; color: #111827; font-weight: 600; font-size: 14px;">${data.service}</p>
        
        ${data.message ? `
        <div style="padding-top: 12px; margin-top: 12px; border-top: 1px solid #e5e7eb;">
          <p style="color: #111827; font-weight: 600; margin: 0 0 6px 0; font-size: 13px;">Additional Notes</p>
          <p style="color: #4b5563; margin: 0; line-height: 1.6; font-size: 14px;">${data.message}</p>
        </div>
        ` : ''}
      </div>
      <p style="margin: 16px 0 0 0; color: #4b5563;">Schedule consultation within 24 hours.</p>
    `;
  } else if (type === 'quote') {
    title = 'New Quote Request';
    content = `
      <p style="margin: 0 0 16px 0; color: #4b5563;">A new quote request has been received.</p>
      <div style="background: #f9fafb; padding: 16px; margin: 20px 0; border: 1px solid #e5e7eb;">
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Name</p>
        <p style="margin: 0 0 12px 0; color: #4b5563; font-size: 14px;">${data.name}</p>
        
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Email</p>
        <p style="margin: 0 0 12px 0;"><a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none; font-size: 14px;">${data.email}</a></p>
        
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Phone</p>
        <p style="margin: 0 0 12px 0;"><a href="tel:${data.phone}" style="color: #2563eb; text-decoration: none; font-size: 14px;">${data.phone || 'Not provided'}</a></p>
        
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Service</p>
        <p style="margin: 0 0 12px 0; color: #111827; font-weight: 600; font-size: 14px;">${data.service}</p>
        
        ${data.message ? `
        <div style="padding-top: 12px; margin-top: 12px; border-top: 1px solid #e5e7eb;">
          <p style="color: #111827; font-weight: 600; margin: 0 0 6px 0; font-size: 13px;">Requirements</p>
          <p style="color: #4b5563; margin: 0; line-height: 1.6; font-size: 14px;">${data.message}</p>
        </div>
        ` : ''}
      </div>
      <p style="margin: 16px 0 0 0; color: #4b5563;">Send quote within 24-48 hours.</p>
    `;
  } else if (type === 'booking') {
    title = 'New Service Booking';
    content = `
      <p style="margin: 0 0 16px 0; color: #4b5563;">A new service booking has been confirmed.</p>
      <div style="background: #f9fafb; padding: 16px; margin: 20px 0; border: 1px solid #e5e7eb;">
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Name</p>
        <p style="margin: 0 0 12px 0; color: #4b5563; font-size: 14px;">${data.name}</p>
        
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Email</p>
        <p style="margin: 0 0 12px 0;"><a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none; font-size: 14px;">${data.email}</a></p>
        
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Phone</p>
        <p style="margin: 0 0 12px 0;"><a href="tel:${data.phone}" style="color: #2563eb; text-decoration: none; font-size: 14px;">${data.phone || 'Not provided'}</a></p>
        
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Service</p>
        <p style="margin: 0 0 12px 0; color: #111827; font-weight: 600; font-size: 14px;">${data.service}</p>
        
        ${data.preferredDate ? `
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Preferred Date</p>
        <p style="margin: 0 0 12px 0; color: #4b5563; font-size: 14px;">${data.preferredDate}</p>
        ` : ''}
        
        ${data.preferredTime ? `
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Preferred Time</p>
        <p style="margin: 0; color: #4b5563; font-size: 14px;">${data.preferredTime}</p>
        ` : ''}
      </div>
      <p style="margin: 16px 0 0 0; color: #4b5563;">Confirm booking and schedule appointment.</p>
    `;
  }

  // Ultra simple clean template - no border radius, no fancy colors, fully responsive with logo
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 0; width: 100% !important; }
        table { border-collapse: collapse; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; pointer-events: none; }
        @media only screen and (max-width: 600px) {
          .email-container { width: 100% !important; }
          .email-padding { padding: 20px !important; }
          .email-header { padding: 12px 20px !important; }
          .email-footer { padding: 12px 20px !important; }
          .logo-img { max-width: 120px !important; height: auto !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; width: 100%;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
          <td align="center">
            <table class="email-container" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 600px;">
              
              <!-- Header with Logo -->
              <tr>
                <td class="email-header" style="padding: 20px 40px; text-align: center; border-bottom: 1px solid #e5e7eb; background-color: #ffffff;">
                  <img src="https://res.cloudinary.com/derzj7d4u/image/upload/v1767980265/Minimalist_logo_with_blue_and_gray_color_scheme-removebg-preview_cngnod.png" alt="ReturnFilers" class="logo-img" style="max-width: 160px; height: auto; display: block; margin: 0 auto;" />
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="email-padding" style="padding: 40px;">
                  <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #111827;">${title}</h2>
                  ${content}
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="email-footer" style="padding: 20px 40px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px 0; font-size: 13px; color: #6b7280;">
                    <a href="https://returnfilers.in" style="color: #2563eb; text-decoration: none;">returnfilers.in</a> | 
                    <a href="mailto:info@returnfilers.in" style="color: #2563eb; text-decoration: none;">info@returnfilers.in</a>
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                    Automated notification from ReturnFilers admin panel
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// Customer Confirmation Template - Ultra Simple & Clean
const getCustomerConfirmationTemplate = ({ type, data }) => {
  let content = '';
  let title = '';

  if (type === 'contact') {
    title = 'Thank You for Contacting Us';
    content = `
      <p style="margin: 0 0 16px 0; color: #4b5563;">Hi <strong>${data.name}</strong>,</p>
      <p style="margin: 0 0 16px 0; color: #4b5563;">Thank you for reaching out to ReturnFilers. We have received your message.</p>
      <div style="background: #f9fafb; padding: 16px; margin: 20px 0; border: 1px solid #e5e7eb;">
        <p style="color: #111827; font-weight: 600; margin: 0 0 8px 0; font-size: 13px;">Your Message:</p>
        <p style="color: #4b5563; margin: 0; line-height: 1.6; font-size: 14px;">${data.message}</p>
      </div>
      <p style="margin: 16px 0; color: #4b5563;">Our team will respond within 24 hours.</p>
      <p style="margin: 20px 0 0 0; color: #4b5563;">Best regards,<br><strong style="color: #111827;">Team ReturnFilers</strong></p>
    `;
  } else if (type === 'consultation') {
    title = 'Consultation Request Confirmed';
    content = `
      <p style="margin: 0 0 16px 0; color: #4b5563;">Hi <strong>${data.name}</strong>,</p>
      <p style="margin: 0 0 16px 0; color: #4b5563;">Thank you for requesting a consultation with ReturnFilers.</p>
      <div style="background: #f9fafb; padding: 16px; margin: 20px 0; border: 1px solid #e5e7eb;">
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Service</p>
        <p style="margin: 0; color: #111827; font-weight: 600; font-size: 14px;">${data.service}</p>
        ${data.message ? `
        <div style="padding-top: 12px; margin-top: 12px; border-top: 1px solid #e5e7eb;">
          <p style="color: #111827; font-weight: 600; margin: 0 0 6px 0; font-size: 13px;">Your Notes</p>
          <p style="color: #4b5563; margin: 0; line-height: 1.6; font-size: 14px;">${data.message}</p>
        </div>
        ` : ''}
      </div>
      <p style="margin: 16px 0; color: #4b5563;">Our team will contact you shortly to schedule your consultation.</p>
      <p style="margin: 20px 0 0 0; color: #4b5563;">Best regards,<br><strong style="color: #111827;">Team ReturnFilers</strong></p>
    `;
  } else if (type === 'quote') {
    title = 'Quote Request Received';
    content = `
      <p style="margin: 0 0 16px 0; color: #4b5563;">Hi <strong>${data.name}</strong>,</p>
      <p style="margin: 0 0 16px 0; color: #4b5563;">Thank you for requesting a quote for <strong>${data.service}</strong>.</p>
      <div style="background: #f9fafb; padding: 16px; margin: 20px 0; border: 1px solid #e5e7eb;">
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Service</p>
        <p style="margin: 0; color: #111827; font-weight: 600; font-size: 14px;">${data.service}</p>
        ${data.message ? `
        <div style="padding-top: 12px; margin-top: 12px; border-top: 1px solid #e5e7eb;">
          <p style="color: #111827; font-weight: 600; margin: 0 0 6px 0; font-size: 13px;">Requirements</p>
          <p style="color: #4b5563; margin: 0; line-height: 1.6; font-size: 14px;">${data.message}</p>
        </div>
        ` : ''}
      </div>
      <p style="margin: 16px 0; color: #4b5563;">You will receive a detailed quote within 24-48 hours.</p>
      <p style="margin: 20px 0 0 0; color: #4b5563;">Best regards,<br><strong style="color: #111827;">Team ReturnFilers</strong></p>
    `;
  } else if (type === 'booking') {
    title = 'Service Booking Confirmed';
    content = `
      <p style="margin: 0 0 16px 0; color: #4b5563;">Hi <strong>${data.name}</strong>,</p>
      <p style="margin: 0 0 16px 0; color: #4b5563;">Your booking for <strong>${data.service}</strong> has been confirmed.</p>
      <div style="background: #f9fafb; padding: 16px; margin: 20px 0; border: 1px solid #e5e7eb;">
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Service</p>
        <p style="margin: 0 0 12px 0; color: #111827; font-weight: 600; font-size: 14px;">${data.service}</p>
        ${data.preferredDate ? `
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Preferred Date</p>
        <p style="margin: 0 0 12px 0; color: #4b5563; font-size: 14px;">${data.preferredDate}</p>
        ` : ''}
        ${data.preferredTime ? `
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Preferred Time</p>
        <p style="margin: 0; color: #4b5563; font-size: 14px;">${data.preferredTime}</p>
        ` : ''}
      </div>
      <p style="margin: 16px 0; color: #4b5563;">We will contact you shortly to confirm the details.</p>
      <p style="margin: 20px 0 0 0; color: #4b5563;">Best regards,<br><strong style="color: #111827;">Team ReturnFilers</strong></p>
    `;
  }

  // Ultra simple clean template - no border radius, fully responsive with logo
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 0; width: 100% !important; }
        table { border-collapse: collapse; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; pointer-events: none; }
        @media only screen and (max-width: 600px) {
          .email-container { width: 100% !important; }
          .email-padding { padding: 20px !important; }
          .email-header { padding: 12px 20px !important; }
          .email-footer { padding: 12px 20px !important; }
          .logo-img { max-width: 120px !important; height: auto !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; width: 100%;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
          <td align="center">
            <table class="email-container" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 600px;">
              
              <!-- Header with Logo -->
              <tr>
                <td class="email-header" style="padding: 20px 40px; text-align: center; border-bottom: 1px solid #e5e7eb; background-color: #ffffff;">
                  <img src="https://res.cloudinary.com/derzj7d4u/image/upload/v1767980265/Minimalist_logo_with_blue_and_gray_color_scheme-removebg-preview_cngnod.png" alt="ReturnFilers" class="logo-img" style="max-width: 160px; height: auto; display: block; margin: 0 auto;" />
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="email-padding" style="padding: 40px;">
                  <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #111827;">${title}</h2>
                  ${content}
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="email-footer" style="padding: 20px 40px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px 0; font-size: 13px; color: #6b7280;">
                    <a href="https://returnfilers.in" style="color: #2563eb; text-decoration: none;">returnfilers.in</a> | 
                    <a href="mailto:info@returnfilers.in" style="color: #2563eb; text-decoration: none;">info@returnfilers.in</a>
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                    © ${new Date().getFullYear()} ReturnFilers. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

module.exports = {
  getEmailTemplate,
  getAdminNotificationTemplate,
  getCustomerConfirmationTemplate
};


