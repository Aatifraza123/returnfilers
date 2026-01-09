/**
 * Professional Email Templates for ReturnFilers
 */

const getEmailTemplate = ({ title, content, footerText, ctaButton }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #0B1530 0%, #1a2e5c 100%); padding: 50px 40px; text-align: center;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <div style="background-color: #C9A227; width: 60px; height: 60px; border-radius: 12px; display: inline-block; line-height: 60px; text-align: center; margin-bottom: 20px;">
                          <span style="color: #0B1530; font-size: 28px; font-weight: 800;">RF</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: 0.5px;">ReturnFilers</h1>
                        <p style="color: #C9A227; font-size: 13px; font-weight: 500; margin: 8px 0 0 0; letter-spacing: 1.5px; text-transform: uppercase;">Tax & Financial Services</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 50px 40px;">
                  <h2 style="color: #0B1530; font-size: 22px; font-weight: 700; margin: 0 0 25px 0; line-height: 1.3;">${title}</h2>
                  <div style="color: #4a5568; font-size: 15px; line-height: 1.8;">
                    ${content}
                  </div>
                  ${ctaButton ? `
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                      <tr>
                        <td align="center">
                          <a href="${ctaButton.url}" style="display: inline-block; padding: 14px 40px; background-color: #C9A227; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">${ctaButton.text}</a>
                        </td>
                      </tr>
                    </table>
                  ` : ''}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #0B1530; padding: 40px; text-align: center;">
                  <h3 style="color: #C9A227; font-size: 18px; font-weight: 700; margin: 0 0 15px 0;">ReturnFilers</h3>
                  <p style="color: #cbd5e0; font-size: 13px; line-height: 1.6; margin: 0 0 25px 0;">
                    ${footerText || 'Your trusted partner for professional tax and financial services'}
                  </p>
                  <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 25px; margin-top: 25px;">
                    <p style="color: #e2e8f0; font-size: 14px; margin: 0 0 8px 0;">
                      Email: <a href="mailto:info@returnfilers.in" style="color: #C9A227; text-decoration: none;">info@returnfilers.in</a>
                    </p>
                    <p style="color: #e2e8f0; font-size: 14px; margin: 0 0 15px 0;">
                      Phone: <a href="tel:+918447127264" style="color: #C9A227; text-decoration: none;">+91 84471 27264</a>
                    </p>
                    <p style="color: #a0aec0; font-size: 12px; line-height: 1.6; margin: 15px 0 0 0;">
                      SA-28 First Floor, Jaipuria Sunrise Plaza<br>
                      Indrapuram, Ghaziabad, UP 201014
                    </p>
                  </div>
                  <p style="color: #718096; font-size: 11px; margin: 25px 0 0 0; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                    &copy; ${new Date().getFullYear()} ReturnFilers. All rights reserved.
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

// Admin Notification Template
const getAdminNotificationTemplate = ({ type, data }) => {
  let content = '';
  
  if (type === 'contact') {
    content = `
      <p style="margin: 0 0 20px 0;">You have received a new contact inquiry from a potential client.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-left: 4px solid #C9A227; border-radius: 6px; padding: 25px; margin: 25px 0;">
        <tr>
          <td>
            <table width="100%" cellpadding="8" cellspacing="0">
              <tr>
                <td style="color: #0B1530; font-weight: 600; width: 100px; vertical-align: top;">Name:</td>
                <td style="color: #2d3748;">${data.name}</td>
              </tr>
              <tr>
                <td style="color: #0B1530; font-weight: 600; vertical-align: top;">Email:</td>
                <td><a href="mailto:${data.email}" style="color: #C9A227; text-decoration: none;">${data.email}</a></td>
              </tr>
              <tr>
                <td style="color: #0B1530; font-weight: 600; vertical-align: top;">Phone:</td>
                <td><a href="tel:${data.phone}" style="color: #C9A227; text-decoration: none;">${data.phone || 'Not provided'}</a></td>
              </tr>
              <tr>
                <td colspan="2" style="padding-top: 15px; border-top: 1px solid #e2e8f0;">
                  <p style="color: #0B1530; font-weight: 600; margin: 0 0 10px 0;">Message:</p>
                  <p style="color: #4a5568; margin: 0; padding: 15px; background-color: #ffffff; border-radius: 4px; line-height: 1.6;">${data.message}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <p style="margin: 20px 0 0 0; padding: 15px; background-color: #fef3c7; border-left: 4px solid #C9A227; border-radius: 4px; color: #92400e;">
        <strong>Action Required:</strong> Please respond to this inquiry within 24 hours.
      </p>
    `;
  } else if (type === 'consultation') {
    content = `
      <p style="margin: 0 0 20px 0;">A new consultation request has been submitted for the following service.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-left: 4px solid #C9A227; border-radius: 6px; padding: 25px; margin: 25px 0;">
        <tr>
          <td>
            <table width="100%" cellpadding="8" cellspacing="0">
              <tr>
                <td style="color: #0B1530; font-weight: 600; width: 100px; vertical-align: top;">Name:</td>
                <td style="color: #2d3748;">${data.name}</td>
              </tr>
              <tr>
                <td style="color: #0B1530; font-weight: 600; vertical-align: top;">Email:</td>
                <td><a href="mailto:${data.email}" style="color: #C9A227; text-decoration: none;">${data.email}</a></td>
              </tr>
              <tr>
                <td style="color: #0B1530; font-weight: 600; vertical-align: top;">Phone:</td>
                <td><a href="tel:${data.phone}" style="color: #C9A227; text-decoration: none;">${data.phone || 'Not provided'}</a></td>
              </tr>
              <tr>
                <td style="color: #0B1530; font-weight: 600; vertical-align: top;">Service:</td>
                <td style="color: #C9A227; font-weight: 600;">${data.service}</td>
              </tr>
              ${data.message ? `
              <tr>
                <td colspan="2" style="padding-top: 15px; border-top: 1px solid #e2e8f0;">
                  <p style="color: #0B1530; font-weight: 600; margin: 0 0 10px 0;">Additional Notes:</p>
                  <p style="color: #4a5568; margin: 0; padding: 15px; background-color: #ffffff; border-radius: 4px; line-height: 1.6;">${data.message}</p>
                </td>
              </tr>
              ` : ''}
            </table>
          </td>
        </tr>
      </table>
      <p style="margin: 20px 0 0 0; padding: 15px; background-color: #fef3c7; border-left: 4px solid #C9A227; border-radius: 4px; color: #92400e;">
        <strong>Action Required:</strong> Schedule consultation within 24 hours.
      </p>
    `;
  } else if (type === 'quote') {
    content = `
      <p style="margin: 0 0 20px 0;">A new quote request has been received for the following service.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-left: 4px solid #C9A227; border-radius: 6px; padding: 25px; margin: 25px 0;">
        <tr>
          <td>
            <table width="100%" cellpadding="8" cellspacing="0">
              <tr>
                <td style="color: #0B1530; font-weight: 600; width: 100px; vertical-align: top;">Name:</td>
                <td style="color: #2d3748;">${data.name}</td>
              </tr>
              <tr>
                <td style="color: #0B1530; font-weight: 600; vertical-align: top;">Email:</td>
                <td><a href="mailto:${data.email}" style="color: #C9A227; text-decoration: none;">${data.email}</a></td>
              </tr>
              <tr>
                <td style="color: #0B1530; font-weight: 600; vertical-align: top;">Phone:</td>
                <td><a href="tel:${data.phone}" style="color: #C9A227; text-decoration: none;">${data.phone || 'Not provided'}</a></td>
              </tr>
              <tr>
                <td style="color: #0B1530; font-weight: 600; vertical-align: top;">Service:</td>
                <td style="color: #C9A227; font-weight: 600;">${data.service}</td>
              </tr>
              ${data.message ? `
              <tr>
                <td colspan="2" style="padding-top: 15px; border-top: 1px solid #e2e8f0;">
                  <p style="color: #0B1530; font-weight: 600; margin: 0 0 10px 0;">Requirements:</p>
                  <p style="color: #4a5568; margin: 0; padding: 15px; background-color: #ffffff; border-radius: 4px; line-height: 1.6;">${data.message}</p>
                </td>
              </tr>
              ` : ''}
            </table>
          </td>
        </tr>
      </table>
      <p style="margin: 20px 0 0 0; padding: 15px; background-color: #fef3c7; border-left: 4px solid #C9A227; border-radius: 4px; color: #92400e;">
        <strong>Action Required:</strong> Prepare and send quote within 24-48 hours.
      </p>
    `;
  } else if (type === 'booking') {
    content = `
      <p style="margin: 0 0 20px 0;">A new service booking has been confirmed. Please schedule the appointment.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-left: 4px solid #C9A227; border-radius: 6px; padding: 25px; margin: 25px 0;">
        <tr>
          <td>
            <table width="100%" cellpadding="8" cellspacing="0">
              <tr>
                <td style="color: #0B1530; font-weight: 600; width: 100px; vertical-align: top;">Name:</td>
                <td style="color: #2d3748;">${data.name}</td>
              </tr>
              <tr>
                <td style="color: #0B1530; font-weight: 600; vertical-align: top;">Email:</td>
                <td><a href="mailto:${data.email}" style="color: #C9A227; text-decoration: none;">${data.email}</a></td>
              </tr>
              <tr>
                <td style="color: #0B1530; font-weight: 600; vertical-align: top;">Phone:</td>
                <td><a href="tel:${data.phone}" style="color: #C9A227; text-decoration: none;">${data.phone || 'Not provided'}</a></td>
              </tr>
              <tr>
                <td style="color: #0B1530; font-weight: 600; vertical-align: top;">Service:</td>
                <td style="color: #C9A227; font-weight: 600;">${data.service}</td>
              </tr>
              ${data.preferredDate ? `
              <tr>
                <td style="color: #0B1530; font-weight: 600; vertical-align: top;">Preferred Date:</td>
                <td style="color: #2d3748;">${data.preferredDate}</td>
              </tr>
              ` : ''}
              ${data.preferredTime ? `
              <tr>
                <td style="color: #0B1530; font-weight: 600; vertical-align: top;">Preferred Time:</td>
                <td style="color: #2d3748;">${data.preferredTime}</td>
              </tr>
              ` : ''}
            </table>
          </td>
        </tr>
      </table>
      <p style="margin: 20px 0 0 0; padding: 15px; background-color: #fef3c7; border-left: 4px solid #C9A227; border-radius: 4px; color: #92400e;">
        <strong>Action Required:</strong> Confirm booking and schedule appointment.
      </p>
    `;
  }

  return getEmailTemplate({
    title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Request`,
    content,
    footerText: 'This is an automated notification from your ReturnFilers admin panel.'
  });
};

// Customer Confirmation Template
const getCustomerConfirmationTemplate = ({ type, data }) => {
  let content = '';
  let title = '';

  if (type === 'contact') {
    title = 'Thank You for Contacting Us';
    content = `
      <p style="margin: 0 0 20px 0;">Dear <strong>${data.name}</strong>,</p>
      <p style="margin: 0 0 20px 0;">Thank you for reaching out to ReturnFilers. We have received your message and appreciate you taking the time to contact us.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-left: 4px solid #C9A227; border-radius: 6px; padding: 25px; margin: 25px 0;">
        <tr>
          <td>
            <p style="color: #0B1530; font-weight: 600; margin: 0 0 12px 0;">Your Message:</p>
            <p style="color: #4a5568; margin: 0; line-height: 1.6;">${data.message}</p>
          </td>
        </tr>
      </table>
      <p style="margin: 0 0 20px 0;">Our team will review your inquiry and respond within 24 hours. If your matter is urgent, please feel free to call us directly at <strong>+91 84471 27264</strong>.</p>
      <p style="margin: 30px 0 0 0;">Best regards,<br><strong>Team ReturnFilers</strong></p>
    `;
  } else if (type === 'consultation') {
    title = 'Consultation Request Confirmed';
    content = `
      <p style="margin: 0 0 20px 0;">Dear <strong>${data.name}</strong>,</p>
      <p style="margin: 0 0 20px 0;">Thank you for requesting a consultation with ReturnFilers. We are pleased to assist you with <strong>${data.service}</strong>.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-left: 4px solid #C9A227; border-radius: 6px; padding: 25px; margin: 25px 0;">
        <tr>
          <td>
            <p style="margin: 0 0 8px 0;"><span style="color: #0B1530; font-weight: 600;">Service:</span> ${data.service}</p>
            ${data.message ? `<p style="margin: 15px 0 0 0; padding-top: 15px; border-top: 1px solid #e2e8f0;"><span style="color: #0B1530; font-weight: 600;">Your Note:</span><br><span style="color: #4a5568; margin-top: 8px; display: block;">${data.message}</span></p>` : ''}
          </td>
        </tr>
      </table>
      <p style="margin: 0 0 20px 0;">Our expert team will contact you shortly to schedule your consultation at a convenient time.</p>
      <p style="margin: 30px 0 0 0;">Best regards,<br><strong>Team ReturnFilers</strong></p>
    `;
  } else if (type === 'quote') {
    title = 'Quote Request Received';
    content = `
      <p style="margin: 0 0 20px 0;">Dear <strong>${data.name}</strong>,</p>
      <p style="margin: 0 0 20px 0;">Thank you for requesting a quote for <strong>${data.service}</strong>. We appreciate your interest in our services.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-left: 4px solid #C9A227; border-radius: 6px; padding: 25px; margin: 25px 0;">
        <tr>
          <td>
            <p style="margin: 0 0 8px 0;"><span style="color: #0B1530; font-weight: 600;">Service:</span> ${data.service}</p>
            ${data.message ? `<p style="margin: 15px 0 0 0; padding-top: 15px; border-top: 1px solid #e2e8f0;"><span style="color: #0B1530; font-weight: 600;">Requirements:</span><br><span style="color: #4a5568; margin-top: 8px; display: block;">${data.message}</span></p>` : ''}
          </td>
        </tr>
      </table>
      <p style="margin: 0 0 20px 0;">Our team is preparing a detailed quote based on your requirements. You can expect to receive it within 24-48 hours.</p>
      <p style="margin: 30px 0 0 0;">Best regards,<br><strong>Team ReturnFilers</strong></p>
    `;
  } else if (type === 'booking') {
    title = 'Service Booking Confirmed';
    content = `
      <p style="margin: 0 0 20px 0;">Dear <strong>${data.name}</strong>,</p>
      <p style="margin: 0 0 20px 0;">Your booking for <strong>${data.service}</strong> has been confirmed successfully.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-left: 4px solid #C9A227; border-radius: 6px; padding: 25px; margin: 25px 0;">
        <tr>
          <td>
            <p style="margin: 0 0 8px 0;"><span style="color: #0B1530; font-weight: 600;">Service:</span> ${data.service}</p>
            ${data.preferredDate ? `<p style="margin: 8px 0;"><span style="color: #0B1530; font-weight: 600;">Preferred Date:</span> ${data.preferredDate}</p>` : ''}
            ${data.preferredTime ? `<p style="margin: 8px 0;"><span style="color: #0B1530; font-weight: 600;">Preferred Time:</span> ${data.preferredTime}</p>` : ''}
          </td>
        </tr>
      </table>
      <p style="margin: 0 0 20px 0;">We will contact you shortly to confirm the final details and schedule. Please keep your documents ready for a smooth process.</p>
      <p style="margin: 30px 0 0 0;">Best regards,<br><strong>Team ReturnFilers</strong></p>
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
