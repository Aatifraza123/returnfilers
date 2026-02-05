const Contact = require('../models/Contact');
const mongoose = require('mongoose');
const { sendEmail, sendBulkEmails } = require('../utils/emailService');
const nodemailer = require('nodemailer');
const { createContactNotification } = require('../utils/notificationHelper');
const he = require('he'); // HTML entity decoder

// @desc    Send bulk email
// @route   POST /api/contacts/bulk-email
// @access  Private/Admin
const sendBulkEmail = async (req, res) => {
  try {
    const { recipients, subject, message } = req.body;

    console.log('BULK EMAIL REQUEST');
    console.log('Recipients count:', recipients?.length);
    console.log('Subject:', subject);
    console.log('Message type:', typeof message);
    console.log('Message length:', message?.length);
    console.log('Message first 300 chars:', message?.substring(0, 300));
    console.log('Has < character:', message?.includes('<'));
    console.log('Has &lt; encoded:', message?.includes('&lt;'));

    // Validation
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No recipients provided'
      });
    }

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required'
      });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        success: false,
        message: 'Email service not configured'
      });
    }

    // Send response immediately (non-blocking)
    res.status(200).json({
      success: true,
      message: `Bulk email queued for ${recipients.length} recipients. Emails are being sent in the background.`,
      queuedCount: recipients.length
    });

    // Send emails in background (non-blocking)
    setImmediate(() => {
      sendBulkEmailsInBackground(recipients, subject, message)
        .then(() => {
          console.log(`Bulk email sent to ${recipients.length} recipients`);
        })
        .catch(err => {
          console.error('Background bulk email error:', err);
        });
    });
  } catch (error) {
    console.error('Bulk email error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to queue bulk email'
    });
  }
};

// Helper function to send bulk emails in background using simple template
const sendBulkEmailsInBackground = async (recipients, subject, message) => {
  console.log('Starting background bulk email sending...');
  console.log('📧 Original recipients count:', recipients.length);
  
  // Remove duplicates based on email address
  const uniqueRecipients = [];
  const seenEmails = new Set();
  
  for (const recipient of recipients) {
    const email = recipient.email.toLowerCase().trim();
    if (!seenEmails.has(email)) {
      seenEmails.add(email);
      uniqueRecipients.push(recipient);
    } else {
      console.log('⚠️ Skipping duplicate email:', email);
    }
  }
  
  console.log('📧 Unique recipients count:', uniqueRecipients.length);
  console.log('📧 Duplicates removed:', recipients.length - uniqueRecipients.length);
  console.log('📧 Message type:', typeof message);
  console.log('📧 Message preview (first 200 chars):', message.substring(0, 200));
  
  // Decode HTML entities (ReactQuill sometimes encodes them)
  const decodedMessage = he.decode(message);
  console.log('📧 Decoded message preview:', decodedMessage.substring(0, 200));
  
  const { getBulkEmailTemplate } = require('../utils/emailTemplates');
  
  let sentCount = 0;
  let failedCount = 0;

  // Process emails one by one with delay
  for (const recipient of uniqueRecipients) {
    try {
      // Create unsubscribe link
      const unsubscribeUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/api/newsletter/unsubscribe/${encodeURIComponent(recipient.email)}`;
      
      // Use simple bulk email template
      const html = getBulkEmailTemplate({
        subject: subject,
        content: decodedMessage,
        recipientName: recipient.name || 'Valued Client',
        unsubscribeUrl: unsubscribeUrl
      });

      await sendEmail({
        to: recipient.email,
        subject: subject,
        html: html
      });
      
      sentCount++;
      console.log(`✅ Sent to ${recipient.email} (${sentCount}/${uniqueRecipients.length})`);
      
      // Small delay between emails
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      failedCount++;
      console.error(`❌ Failed for ${recipient.email}:`, error.message);
    }
  }

  console.log(`Bulk email completed: ${sentCount} sent, ${failedCount} failed, ${recipients.length - uniqueRecipients.length} duplicates skipped`);
};

// @desc    Submit contact message
// @route   POST /api/contacts
// @access  Public
const createContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    console.log('NEW CONTACT MESSAGE');
    console.log('Data:', { name, email, phone });

    // Validation
    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, phone, and message'
      });
    }

    // Clean phone number
    const cleanPhone = phone.replace(/\D/g, '');

    // Create contact
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      message: message.trim()
    });

    console.log('Contact saved:', contact._id);

    // Send response immediately (BEFORE any email operations)
    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
      data: {
        id: contact._id,
        name: contact.name
      }
    });

    console.log('✅ Response sent, now starting email process...');

    // Send emails in next event loop tick (completely non-blocking)
    setImmediate(async () => {
      try {
        console.log('🔄 Inside setImmediate - Starting email sending process for contact:', contact._id);
        await sendContactEmails(contact);
        console.log('✅ Contact emails sent successfully');
        
        await createContactNotification(contact);
        console.log('✅ Contact notification created');

        // Capture lead for scoring and follow-up
        const { captureLeadFromForm } = require('../utils/leadScoringService');
        await captureLeadFromForm({
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          source: 'contact_form',
          message: contact.message
        });
        console.log('✅ Lead captured from contact form');
      } catch (err) {
        console.error('❌ Email sending failed (non-blocking):', err.message);
        console.error('Error stack:', err.stack);
      }
    });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send message'
    });
  }
};

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private/Admin
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: contacts.length,
      contacts: contacts
    });
  } catch (error) {
    console.error('❌ Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single contact
// @route   GET /api/contacts/:id
// @access  Private/Admin
const getContactById = async (req, res) => {
  try {
    console.log('Getting contact by ID:', req.params.id);
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid ObjectId format:', req.params.id);
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID format'
      });
    }

    const contact = await Contact.findById(req.params.id);
    console.log('Contact found:', contact ? 'Yes' : 'No');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Get contact by ID error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get contact'
    });
  }
};

// @desc    Update contact status
// @route   PATCH /api/contacts/:id
// @access  Private/Admin
const updateContact = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID format'
      });
    }

    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: contact
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update contact'
    });
  }
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
const deleteContact = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID format'
      });
    }

    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete contact'
    });
  }
};

// Helper function to send emails using simple templates
const sendContactEmails = async (contact) => {
  console.log('sendContactEmails called for:', contact._id);
  
  const { sendEmail } = require('../utils/emailService');
  const { getAdminNotificationTemplate, getCustomerConfirmationTemplate } = require('../utils/emailTemplates');
  const { processContactQuery } = require('../utils/aiAutoResponder');

  // Process query with AI
  console.log('🤖 Processing query with AI auto-responder...');
  const aiResult = await processContactQuery({
    name: contact.name,
    email: contact.email,
    message: contact.message
  });
  
  console.log(`📊 Query Category: ${aiResult.category}, Priority: ${aiResult.priority}`);

  // Use old working templates
  const adminHtml = getAdminNotificationTemplate({
    type: 'contact',
    data: {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      message: contact.message,
      aiCategory: aiResult.category,
      aiPriority: aiResult.priority
    }
  });

  // Use AI-generated response for customer email
  const customerHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0B1530; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .footer { background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666; }
        .ai-badge { background: #D4AF37; color: #0B1530; padding: 5px 10px; border-radius: 5px; font-size: 11px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>ReturnFilers</h2>
          <p>Professional CA Services</p>
        </div>
        <div class="content">
          <p><span class="ai-badge">🤖 AI-Powered Response</span></p>
          <div style="white-space: pre-line; margin-top: 20px;">
${aiResult.response}
          </div>
        </div>
        <div class="footer">
          <p>This is an automated response. A team member will follow up if needed.</p>
          <p>© ${new Date().getFullYear()} ReturnFilers. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // Send admin notification to info@returnfilers.in only
    console.log('Sending admin notification email to info@returnfilers.in...');
    await sendEmail({
      to: 'info@returnfilers.in',
      subject: `[${aiResult.priority.toUpperCase()}] ${aiResult.category} - New Contact from ${contact.name}`,
      html: adminHtml
    });
    console.log('✅ Admin email sent to info@returnfilers.in');

    // Send AI-generated customer response
    if (aiResult.shouldAutoSend) {
      console.log('Sending AI-generated customer response...');
      await sendEmail({
        to: contact.email,
        subject: 'Thank you for contacting ReturnFilers - We\'re here to help!',
        html: customerHtml
      });
      console.log('✅ AI-powered customer email sent');
    } else {
      console.log('⚠️ Auto-send disabled for this query category');
    }

  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
  }
};

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
  sendBulkEmail
};




