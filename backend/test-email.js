require('dotenv').config();
const { sendEmail } = require('./utils/emailService');
const { getEmailTemplate } = require('./utils/emailTemplates');

const testEmail = async () => {
  try {
    console.log('📧 Sending test email to razaaatif658@gmail.com...');
    
    const content = `
      <p style="margin:0 0 16px 0;color:#4b5563;">This is a test email to verify the responsive email template.</p>
      
      <table width="100%" cellpadding="12" cellspacing="0" border="0" style="background:#f9fafb;margin:20px 0;border-radius:8px;">
        <tr>
          <td>
            <h3 style="margin:0 0 12px 0;color:#111827;font-size:16px;">✅ Template Features:</h3>
            <ul style="margin:0;padding-left:20px;color:#4b5563;line-height:1.8;">
              <li>Fully responsive design</li>
              <li>Works on all email clients</li>
              <li>Mobile-optimized layout</li>
              <li>Full width and height coverage</li>
              <li>Professional styling</li>
            </ul>
          </td>
        </tr>
      </table>
      
      <p style="margin:16px 0;color:#4b5563;">The email template has been updated with:</p>
      <ul style="margin:0 0 16px 0;padding-left:20px;color:#4b5563;line-height:1.8;">
        <li><strong>min-height: 100vh</strong> - Full viewport height</li>
        <li><strong>width: 100%</strong> - Full width coverage</li>
        <li><strong>Responsive images</strong> - Auto-scaling on mobile</li>
        <li><strong>Proper padding</strong> - Consistent spacing</li>
        <li><strong>Mobile-first design</strong> - Optimized for all devices</li>
      </ul>
      
      <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px;margin:20px 0;border-radius:4px;">
        <p style="margin:0;color:#92400e;font-size:14px;line-height:1.6;">
          <strong>📱 Mobile Test:</strong> Please check this email on your mobile device to verify the responsive design is working correctly.
        </p>
      </div>
      
      <p style="margin:20px 0 0 0;color:#4b5563;">If you can see this email properly on both desktop and mobile, the template is working perfectly! 🎉</p>
    `;
    
    const html = getEmailTemplate({
      title: 'Test Email - Responsive Template Verification',
      content: content,
      footerText: 'This is a test email from ReturnFilers development team',
      ctaButton: {
        url: 'https://returnfilers.in',
        text: 'Visit ReturnFilers'
      }
    });
    
    await sendEmail({
      to: 'razaaatif658@gmail.com',
      subject: 'Test Email - Responsive Template ✅',
      html: html
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('📬 Check razaaatif658@gmail.com inbox');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error sending test email:', error);
    process.exit(1);
  }
};

testEmail();
