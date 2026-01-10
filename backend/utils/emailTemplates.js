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

// Admin Notification Template - Fresh & Clean Design
const getAdminNotificationTemplate = ({ type, data }) => {
  let content = '';
  
  if (type === 'contact') {
    content = `
      <p style="margin: 0 0 18px 0; color: #525f7f;">You have received a new contact inquiry from a potential client.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0f4ff 0%, #f5f7ff 100%); border-radius: 8px; padding: 22px; margin: 20px 0; ">
        <tr>
          <td>
            <table width="100%" cellpadding="6" cellspacing="0">
              <tr>
                <td style="color: #1f2937; font-weight: 600; width: 90px; vertical-align: top; font-size: 14px;">Name</td>
                <td style="color: #525f7f; font-size: 14px;">${data.name}</td>
              </tr>
              <tr>
                <td style="color: #1f2937; font-weight: 600; vertical-align: top; font-size: 14px;">Email</td>
                <td><a href="mailto:${data.email}" style="color: #4F46E5; text-decoration: none; font-size: 14px;">${data.email}</a></td>
              </tr>
              <tr>
                <td style="color: #1f2937; font-weight: 600; vertical-align: top; font-size: 14px;">Phone</td>
                <td><a href="tel:${data.phone}" style="color: #4F46E5; text-decoration: none; font-size: 14px;">${data.phone || 'Not provided'}</a></td>
              </tr>
              <tr>
                <td colspan="2" style="padding-top: 12px; border-top: 1px solid rgba(79,70,229,0.15);">
                  <p style="color: #1f2937; font-weight: 600; margin: 0 0 8px 0; font-size: 13px;">Message</p>
                  <p style="color: #525f7f; margin: 0; padding: 12px; background: white; border-radius: 6px; line-height: 1.6; font-size: 14px;">${data.message}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <div style="background: #fef3c7; border-radius: 6px; padding: 14px 16px; margin: 18px 0 0 0;">
        <p style="color: #92400e; font-size: 13px; margin: 0; font-weight: 500;">⚡ <strong>Action:</strong> Please respond within 24 hours</p>
      </div>
    `;
  } else if (type === 'consultation') {
    content = `
      <p style="margin: 0 0 18px 0; color: #525f7f;">A new consultation request has been submitted.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0f4ff 0%, #f5f7ff 100%); border-radius: 8px; padding: 22px; margin: 20px 0; ">
        <tr>
          <td>
            <table width="100%" cellpadding="6" cellspacing="0">
              <tr>
                <td style="color: #1f2937; font-weight: 600; width: 90px; vertical-align: top; font-size: 14px;">Name</td>
                <td style="color: #525f7f; font-size: 14px;">${data.name}</td>
              </tr>
              <tr>
                <td style="color: #1f2937; font-weight: 600; vertical-align: top; font-size: 14px;">Email</td>
                <td><a href="mailto:${data.email}" style="color: #4F46E5; text-decoration: none; font-size: 14px;">${data.email}</a></td>
              </tr>
              <tr>
                <td style="color: #1f2937; font-weight: 600; vertical-align: top; font-size: 14px;">Phone</td>
                <td><a href="tel:${data.phone}" style="color: #4F46E5; text-decoration: none; font-size: 14px;">${data.phone || 'Not provided'}</a></td>
              </tr>
              <tr>
                <td style="color: #1f2937; font-weight: 600; vertical-align: top; font-size: 14px;">Service</td>
                <td style="color: #4F46E5; font-weight: 600; font-size: 14px;">${data.service}</td>
              </tr>
              ${data.message ? `
              <tr>
                <td colspan="2" style="padding-top: 12px; border-top: 1px solid rgba(79,70,229,0.15);">
                  <p style="color: #1f2937; font-weight: 600; margin: 0 0 8px 0; font-size: 13px;">Additional Notes</p>
                  <p style="color: #525f7f; margin: 0; padding: 12px; background: white; border-radius: 6px; line-height: 1.6; font-size: 14px;">${data.message}</p>
                </td>
              </tr>
              ` : ''}
            </table>
          </td>
        </tr>
      </table>
      <div style="background: #fef3c7; border-radius: 6px; padding: 14px 16px; margin: 18px 0 0 0;">
        <p style="color: #92400e; font-size: 13px; margin: 0; font-weight: 500;">⚡ <strong>Action:</strong> Schedule consultation within 24 hours</p>
      </div>
    `;
  } else if (type === 'quote') {
    content = `
      <p style="margin: 0 0 18px 0; color: #525f7f;">A new quote request has been received.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0f4ff 0%, #f5f7ff 100%); border-radius: 8px; padding: 22px; margin: 20px 0; ">
        <tr>
          <td>
            <table width="100%" cellpadding="6" cellspacing="0">
              <tr>
                <td style="color: #1f2937; font-weight: 600; width: 90px; vertical-align: top; font-size: 14px;">Name</td>
                <td style="color: #525f7f; font-size: 14px;">${data.name}</td>
              </tr>
              <tr>
                <td style="color: #1f2937; font-weight: 600; vertical-align: top; font-size: 14px;">Email</td>
                <td><a href="mailto:${data.email}" style="color: #4F46E5; text-decoration: none; font-size: 14px;">${data.email}</a></td>
              </tr>
              <tr>
                <td style="color: #1f2937; font-weight: 600; vertical-align: top; font-size: 14px;">Phone</td>
                <td><a href="tel:${data.phone}" style="color: #4F46E5; text-decoration: none; font-size: 14px;">${data.phone || 'Not provided'}</a></td>
              </tr>
              <tr>
                <td style="color: #1f2937; font-weight: 600; vertical-align: top; font-size: 14px;">Service</td>
                <td style="color: #4F46E5; font-weight: 600; font-size: 14px;">${data.service}</td>
              </tr>
              ${data.message ? `
              <tr>
                <td colspan="2" style="padding-top: 12px; border-top: 1px solid rgba(79,70,229,0.15);">
                  <p style="color: #1f2937; font-weight: 600; margin: 0 0 8px 0; font-size: 13px;">Requirements</p>
                  <p style="color: #525f7f; margin: 0; padding: 12px; background: white; border-radius: 6px; line-height: 1.6; font-size: 14px;">${data.message}</p>
                </td>
              </tr>
              ` : ''}
            </table>
          </td>
        </tr>
      </table>
      <div style="background: #fef3c7; border-radius: 6px; padding: 14px 16px; margin: 18px 0 0 0;">
        <p style="color: #92400e; font-size: 13px; margin: 0; font-weight: 500;">⚡ <strong>Action:</strong> Send quote within 24-48 hours</p>
      </div>
    `;
  } else if (type === 'booking') {
    content = `
      <p style="margin: 0 0 18px 0; color: #525f7f;">A new service booking has been confirmed.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0f4ff 0%, #f5f7ff 100%); border-radius: 8px; padding: 22px; margin: 20px 0; ">
        <tr>
          <td>
            <table width="100%" cellpadding="6" cellspacing="0">
              <tr>
                <td style="color: #1f2937; font-weight: 600; width: 90px; vertical-align: top; font-size: 14px;">Name</td>
                <td style="color: #525f7f; font-size: 14px;">${data.name}</td>
              </tr>
              <tr>
                <td style="color: #1f2937; font-weight: 600; vertical-align: top; font-size: 14px;">Email</td>
                <td><a href="mailto:${data.email}" style="color: #4F46E5; text-decoration: none; font-size: 14px;">${data.email}</a></td>
              </tr>
              <tr>
                <td style="color: #1f2937; font-weight: 600; vertical-align: top; font-size: 14px;">Phone</td>
                <td><a href="tel:${data.phone}" style="color: #4F46E5; text-decoration: none; font-size: 14px;">${data.phone || 'Not provided'}</a></td>
              </tr>
              <tr>
                <td style="color: #1f2937; font-weight: 600; vertical-align: top; font-size: 14px;">Service</td>
                <td style="color: #4F46E5; font-weight: 600; font-size: 14px;">${data.service}</td>
              </tr>
              ${data.preferredDate ? `
              <tr>
                <td style="color: #1f2937; font-weight: 600; vertical-align: top; font-size: 14px;">Date</td>
                <td style="color: #525f7f; font-size: 14px;">${data.preferredDate}</td>
              </tr>
              ` : ''}
              ${data.preferredTime ? `
              <tr>
                <td style="color: #1f2937; font-weight: 600; vertical-align: top; font-size: 14px;">Time</td>
                <td style="color: #525f7f; font-size: 14px;">${data.preferredTime}</td>
              </tr>
              ` : ''}
            </table>
          </td>
        </tr>
      </table>
      <div style="background: #fef3c7; border-radius: 6px; padding: 14px 16px; margin: 18px 0 0 0;">
        <p style="color: #92400e; font-size: 13px; margin: 0; font-weight: 500;">⚡ <strong>Action:</strong> Confirm booking and schedule appointment</p>
      </div>
    `;
  }

  return getEmailTemplate({
    title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Request`,
    content,
    footerText: 'Automated notification from your ReturnFilers admin panel.'
  });
};

// Customer Confirmation Template - Fresh & Modern
const getCustomerConfirmationTemplate = ({ type, data }) => {
  let content = '';
  let title = '';

  if (type === 'contact') {
    title = 'Thank You for Contacting Us';
    content = `
      <p style="margin: 0 0 18px 0; color: #525f7f;">Hi <strong>${data.name}</strong>,</p>
      <p style="margin: 0 0 18px 0; color: #525f7f;">Thank you for reaching out to ReturnFilers. We have received your message and appreciate you taking the time to contact us.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0f4ff 0%, #f5f7ff 100%); border-radius: 8px; padding: 18px; margin: 20px 0; ">
        <tr>
          <td>
            <p style="color: #1f2937; font-weight: 600; margin: 0 0 8px 0; font-size: 13px;">Your Message:</p>
            <p style="color: #525f7f; margin: 0; line-height: 1.6; font-size: 14px;">${data.message}</p>
          </td>
        </tr>
      </table>
      <p style="margin: 18px 0; color: #525f7f;">Our team will review your inquiry and respond within 24 hours. If your matter is urgent, please feel free to call us directly.</p>
      <p style="margin: 25px 0 0 0; color: #525f7f;">Best regards,<br><strong style="color: #1f2937;">Team ReturnFilers</strong></p>
    `;
  } else if (type === 'consultation') {
    title = 'Consultation Request Confirmed';
    content = `
      <p style="margin: 0 0 18px 0; color: #525f7f;">Hi <strong>${data.name}</strong>,</p>
      <p style="margin: 0 0 18px 0; color: #525f7f;">Thank you for requesting a consultation with ReturnFilers. We are pleased to assist you with <strong>${data.service}</strong>.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0f4ff 0%, #f5f7ff 100%); border-radius: 8px; padding: 18px; margin: 20px 0; ">
        <tr>
          <td>
            <p style="margin: 0 0 6px 0; color: #1f2937; font-weight: 600; font-size: 13px;">Service Requested</p>
            <p style="margin: 0; color: #4F46E5; font-weight: 600; font-size: 14px;">${data.service}</p>
            ${data.message ? `
            <div style="padding-top: 12px; margin-top: 12px; border-top: 1px solid rgba(79,70,229,0.15);">
              <p style="color: #1f2937; font-weight: 600; margin: 0 0 6px 0; font-size: 13px;">Your Notes</p>
              <p style="color: #525f7f; margin: 0; line-height: 1.6; font-size: 14px;">${data.message}</p>
            </div>
            ` : ''}
          </td>
        </tr>
      </table>
      <p style="margin: 18px 0; color: #525f7f;">Our expert team will contact you shortly to schedule your consultation at a convenient time.</p>
      <p style="margin: 25px 0 0 0; color: #525f7f;">Best regards,<br><strong style="color: #1f2937;">Team ReturnFilers</strong></p>
    `;
  } else if (type === 'quote') {
    title = 'Quote Request Received';
    content = `
      <p style="margin: 0 0 18px 0; color: #525f7f;">Hi <strong>${data.name}</strong>,</p>
      <p style="margin: 0 0 18px 0; color: #525f7f;">Thank you for requesting a quote for <strong>${data.service}</strong>. We appreciate your interest in our services.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0f4ff 0%, #f5f7ff 100%); border-radius: 8px; padding: 18px; margin: 20px 0; ">
        <tr>
          <td>
            <p style="margin: 0 0 6px 0; color: #1f2937; font-weight: 600; font-size: 13px;">Service</p>
            <p style="margin: 0; color: #4F46E5; font-weight: 600; font-size: 14px;">${data.service}</p>
            ${data.message ? `
            <div style="padding-top: 12px; margin-top: 12px; border-top: 1px solid rgba(79,70,229,0.15);">
              <p style="color: #1f2937; font-weight: 600; margin: 0 0 6px 0; font-size: 13px;">Requirements</p>
              <p style="color: #525f7f; margin: 0; line-height: 1.6; font-size: 14px;">${data.message}</p>
            </div>
            ` : ''}
          </td>
        </tr>
      </table>
      <p style="margin: 18px 0; color: #525f7f;">Our team is preparing a detailed quote based on your requirements. You can expect to receive it within 24-48 hours.</p>
      <p style="margin: 25px 0 0 0; color: #525f7f;">Best regards,<br><strong style="color: #1f2937;">Team ReturnFilers</strong></p>
    `;
  } else if (type === 'booking') {
    title = 'Service Booking Confirmed';
    content = `
      <p style="margin: 0 0 18px 0; color: #525f7f;">Hi <strong>${data.name}</strong>,</p>
      <p style="margin: 0 0 18px 0; color: #525f7f;">Your booking for <strong>${data.service}</strong> has been confirmed successfully! 🎉</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0f4ff 0%, #f5f7ff 100%); border-radius: 8px; padding: 18px; margin: 20px 0; ">
        <tr>
          <td>
            <p style="margin: 0 0 6px 0; color: #1f2937; font-weight: 600; font-size: 13px;">Service</p>
            <p style="margin: 0 0 12px 0; color: #4F46E5; font-weight: 600; font-size: 14px;">${data.service}</p>
            ${data.preferredDate ? `
            <p style="margin: 0 0 6px 0; color: #1f2937; font-weight: 600; font-size: 13px;">Preferred Date</p>
            <p style="margin: 0 0 12px 0; color: #525f7f; font-size: 14px;">${data.preferredDate}</p>
            ` : ''}
            ${data.preferredTime ? `
            <p style="margin: 0 0 6px 0; color: #1f2937; font-weight: 600; font-size: 13px;">Preferred Time</p>
            <p style="margin: 0; color: #525f7f; font-size: 14px;">${data.preferredTime}</p>
            ` : ''}
          </td>
        </tr>
      </table>
      <p style="margin: 18px 0; color: #525f7f;">We will contact you shortly to confirm the final details. Please keep your documents ready for a smooth process.</p>
      <p style="margin: 25px 0 0 0; color: #525f7f;">Best regards,<br><strong style="color: #1f2937;">Team ReturnFilers</strong></p>
    `;
  }

  return getEmailTemplate({
    title,
    content,
    footerText: 'Thank you for choosing ReturnFilers as your trusted financial partner.',
    ctaButton: {
      text: 'Visit Our Website',
      url: 'https://returnfilers.in'
    }
  });
};

module.exports = {
  getEmailTemplate,
  getAdminNotificationTemplate,
  getCustomerConfirmationTemplate
};
