/**
 * Modern Professional Email Templates for ReturnFilers
 * Fresh, clean, and minimal design with excellent readability
 */

const getEmailTemplate = ({ title, content, footerText, ctaButton }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif; background: #f8f9fb; }
        table { border-collapse: collapse; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8f9fb;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fb; padding: 30px 15px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
              
              <!-- Modern Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #4F46E5 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="color: white; font-size: 26px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">ReturnFilers</h1>
                  <p style="color: rgba(255,255,255,0.85); font-size: 12px; font-weight: 500; margin: 6px 0 0 0; letter-spacing: 0.8px; text-transform: uppercase;">Professional Tax Services</p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 45px 35px 35px;">
                  <h2 style="color: #1f2937; font-size: 20px; font-weight: 600; margin: 0 0 20px 0; line-height: 1.4;">${title}</h2>
                  <div style="color: #525f7f; font-size: 15px; line-height: 1.7; margin: 0;">
                    ${content}
                  </div>
                  ${ctaButton ? `
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0 0 0;">
                      <tr>
                        <td align="center">
                          <a href="${ctaButton.url}" style="display: inline-block; padding: 12px 36px; background: linear-gradient(135deg, #4F46E5 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; transition: all 0.3s ease;">${ctaButton.text}</a>
                        </td>
                      </tr>
                    </table>
                  ` : ''}
                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="height: 1px; background: linear-gradient(to right, transparent, #e5e7eb, transparent);"></td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 30px 35px; text-align: center; background-color: #f9fafb;">
                  <p style="color: #525f7f; font-size: 13px; line-height: 1.6; margin: 0 0 20px 0;">
                    ${footerText || 'Your trusted partner for professional tax and financial services'}
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0 0 0;">
                    <tr>
                      <td align="center" style="padding: 0 10px;">
                        <p style="color: #6b7280; font-size: 12px; margin: 0;">
                          <a href="mailto:info@returnfilers.in" style="color: #4F46E5; text-decoration: none; font-weight: 500;">info@returnfilers.in</a>
                        </p>
                      </td>
                      <td style="border-left: 1px solid #e5e7eb; padding: 0 10px;">
                        <p style="color: #6b7280; font-size: 12px; margin: 0;">
                          <a href="tel:+918447127264" style="color: #4F46E5; text-decoration: none; font-weight: 500;">+91 84471 27264</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                  <p style="color: #9ca3af; font-size: 11px; margin: 15px 0 0 0; padding-top: 15px; border-top: 1px solid #e5e7eb;">
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

  // Ultra simple clean template - no border radius, no fancy colors, fully responsive
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @media only screen and (max-width: 600px) {
          .email-container { width: 100% !important; }
          .email-padding { padding: 20px !important; }
          .email-header { padding: 15px 20px !important; }
          .email-footer { padding: 15px 20px !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table class="email-container" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 600px;">
              
              <!-- Header -->
              <tr>
                <td class="email-header" style="padding: 20px 40px; text-align: center; border-bottom: 1px solid #e5e7eb;">
                  <h1 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">ReturnFilers Admin</h1>
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

  // Ultra simple clean template - no border radius, fully responsive
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @media only screen and (max-width: 600px) {
          .email-container { width: 100% !important; }
          .email-padding { padding: 20px !important; }
          .email-header { padding: 15px 20px !important; }
          .email-footer { padding: 15px 20px !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table class="email-container" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 600px;">
              
              <!-- Header -->
              <tr>
                <td class="email-header" style="padding: 20px 40px; text-align: center; border-bottom: 1px solid #e5e7eb;">
                  <h1 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">ReturnFilers</h1>
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
