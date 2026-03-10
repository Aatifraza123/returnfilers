/**
 * Simple & Consistent Email Templates for AI Automation
 * All templates follow the same clean design
 */

const getEmailTemplate = (type, data) => {
  const templates = {
    // 1. Lead Follow-up Email (Priority-based)
    leadFollowup: () => {
      const priorityEmojis = { urgent: '🔴', high: '🟠', medium: '🟡', low: '🟢' };
      const emoji = priorityEmojis[data.priority] || '📧';
      
      return {
        subject: `${emoji} Following up on your inquiry - ReturnFilers`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0B1530; color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #ffffff; padding: 30px 20px; border: 1px solid #e0e0e0; }
    .box { background: #f9f9f9; padding: 20px; border-left: 4px solid #D4AF37; margin: 20px 0; }
    .button { display: inline-block; padding: 12px 30px; background: #D4AF37; color: #0B1530; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 5px; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px;">👋 Following Up</h1>
      <p style="margin: 10px 0 0 0;">We're here to help!</p>
    </div>
    
    <div class="content">
      <p>Dear ${data.name},</p>
      
      <p>We wanted to follow up on your recent inquiry with <strong>ReturnFilers</strong>.</p>
      
      ${data.service ? `
      <div class="box">
        <h3 style="margin-top: 0; color: #0B1530;">Your Interest</h3>
        <p><strong>Service:</strong> ${data.service}</p>
        <p><strong>Inquiry Date:</strong> ${new Date(data.createdAt).toLocaleDateString('en-IN')}</p>
      </div>
      ` : ''}
      
      <p><strong>How We Can Help:</strong></p>
      <ul>
        <li>Free consultation to understand your needs</li>
        <li>Customized solutions for your requirements</li>
        <li>Expert guidance from our team</li>
        <li>Transparent pricing with no hidden costs</li>
      </ul>
      
      <p style="text-align: center;">
        <a href="https://returnfilers.in/contact" class="button">Contact Us</a>
        <a href="https://returnfilers.in/services" class="button" style="background: #0B1530; color: white;">View Services</a>
      </p>
      
      <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
        <strong>Have questions?</strong><br/>
        Call us: +91 84471 27264 | Email: info@returnfilers.in
      </p>
    </div>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} ReturnFilers. All rights reserved.</p>
      <p>Professional Tax & Business Consulting</p>
    </div>
  </div>
</body>
</html>`
      };
    },

    // 2. Contact Form Auto-Response
    contactAutoResponse: () => {
      return {
        subject: `✅ We received your message - ReturnFilers`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0B1530; color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #ffffff; padding: 30px 20px; border: 1px solid #e0e0e0; }
    .box { background: #f9f9f9; padding: 20px; border-left: 4px solid #D4AF37; margin: 20px 0; }
    .button { display: inline-block; padding: 12px 30px; background: #D4AF37; color: #0B1530; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 5px; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px;">✅ Message Received</h1>
      <p style="margin: 10px 0 0 0;">Thank you for contacting us!</p>
    </div>
    
    <div class="content">
      <p>Dear ${data.name},</p>
      
      <p>Thank you for reaching out to <strong>ReturnFilers</strong>. We have received your message and our team will get back to you within 24 hours.</p>
      
      <div class="box">
        <h3 style="margin-top: 0; color: #0B1530;">Your Message</h3>
        <p style="color: #666; font-style: italic;">"${data.message}"</p>
      </div>
      
      <p><strong>What Happens Next?</strong></p>
      <ul>
        <li>Our team will review your inquiry</li>
        <li>We'll contact you within 24 hours</li>
        <li>You'll receive personalized assistance</li>
      </ul>
      
      <p><strong>Need Immediate Help?</strong></p>
      <p>Call us directly: <strong>+91 84471 27264</strong></p>
      
      <p style="text-align: center;">
        <a href="https://returnfilers.in/services" class="button">View Services</a>
        <a href="https://returnfilers.in/booking" class="button" style="background: #0B1530; color: white;">Book Now</a>
      </p>
    </div>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} ReturnFilers. All rights reserved.</p>
      <p>Professional Tax & Business Consulting</p>
    </div>
  </div>
</body>
</html>`
      };
    }
  };

  return templates[type] ? templates[type]() : null;
};

module.exports = { getEmailTemplate };
