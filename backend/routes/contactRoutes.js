const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
  sendBulkEmail
} = require('../controllers/contactController');
const { sendEmail } = require('../utils/emailService');

// Public route - anyone can submit
router.post('/', createContact);

// Test email endpoint
router.get('/test-email', async (req, res) => {
  try {
    const testEmail = req.query.email || process.env.EMAIL_USER;
    console.log('🧪 Testing email to:', testEmail);
    
    const result = await sendEmail({
      to: testEmail,
      subject: 'Test Email from ReturnFilers',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
            <h1 style="color: #0B1530; margin: 0 0 20px;">✅ Email Test Successful!</h1>
            <p style="color: #666;">This is a test email from ReturnFilers.</p>
            <p style="color: #666;">Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #D4AF37; font-weight: bold;">ReturnFilers</p>
          </div>
        </div>
      `
    });
    
    res.json({
      success: true,
      message: 'Test email sent successfully!',
      result
    });
  } catch (error) {
    console.error('❌ Test email failed:', error);
    res.status(500).json({
      success: false,
      message: 'Test email failed',
      error: error.message
    });
  }
});

// Admin routes - protected
router.get('/', protect, getContacts);
router.get('/:id', protect, getContactById);
router.patch('/:id', protect, updateContact);
router.delete('/:id', protect, deleteContact);

// Bulk email route - admin only
router.post('/bulk-email', protect, sendBulkEmail);

module.exports = router;




