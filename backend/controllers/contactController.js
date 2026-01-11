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

// Helper function to send bulk emails in background using professional template
const sendBulkEmailsInBackground = async (recipients, subject, message) => {
  console.log('Starting background bulk email sending...');
  console.log('📧 Message type:', typeof message);
  console.log('📧 Message preview (first 200 chars):', message.substring(0, 200));
  
  // Decode HTML entities (ReactQuill sometimes encodes them)
  const decodedMessage = he.decode(message);
  console.log('📧 Decoded message preview:', decodedMessage.substring(0, 200));
  
  const { getEmailTemplate } = require('../utils/emailTemplates');
  
  let sentCount = 0;
  let failedCount = 0;

  // Process emails one by one with delay
  for (const recipient of recipients) {
    try {
      // Create unsubscribe link
      const unsubscribeUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/api/newsletter/unsubscribe/${encodeURIComponent(recipient.email)}`;
      
      // Use professional email template
      const html = getEmailTemplate({
        title: subject,
        content: `
          <p>Dear <strong>${recipient.name || 'Valued Client'}</strong>,</p>
          <div style="margin: 20px 0;">
            ${decodedMessage}
          </div>
          <p style="margin-top: 25px;">Best regards,<br><strong>Team ReturnFilers</strong></p>
        `,
        footerText: 'Thank you for being a valued member of the ReturnFilers community.',
        unsubscribeUrl: unsubscribeUrl
      });

      await sendEmail({
        to: recipient.email,
        subject: subject,
        html: html
      });
      
      sentCount++;
      console.log(`✅ Sent to ${recipient.email} (${sentCount}/${recipients.length})`);
      
      // Small delay between emails
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      failedCount++;
      console.error(`❌ Failed for ${recipient.email}:`, error.message);
    }
  }

  console.log(`Bulk email completed: ${sentCount} sent, ${failedCount} failed`);
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

    // Send emails in next event loop tick (completely non-blocking)
    setImmediate(() => {
      console.log('Starting email sending process for contact:', contact._id);
      sendContactEmails(contact)
        .then(() => {
          console.log('Contact emails sent successfully');
        })
        .catch(err => {
          console.error('Email sending failed (non-blocking):', err);
        });
      createContactNotification(contact)
        .catch(err => console.error('Contact notification failed:', err));
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

// Helper function to send emails using professional templates
const sendContactEmails = async (contact) => {
  console.log('sendContactEmails called for:', contact._id);
  
  const { sendEmail } = require('../utils/emailService');
  const { getAdminNotificationTemplate, getCustomerConfirmationTemplate } = require('../utils/emailTemplates');

  // Use new professional templates
  const adminHtml = getAdminNotificationTemplate({
    type: 'contact',
    data: {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      message: contact.message
    }
  });

  const customerHtml = getCustomerConfirmationTemplate({
    type: 'contact',
    data: {
      name: contact.name,
      message: contact.message
    }
  });

  try {
    // Send admin notification to info@returnfilers.in only
    console.log('Sending admin notification email to info@returnfilers.in...');
    await sendEmail({
      to: 'info@returnfilers.in',
      subject: `New Contact Message from ${contact.name}`,
      html: adminHtml
    });
    console.log('✅ Admin email sent to info@returnfilers.in');

    // Customer confirmation
    console.log('Sending customer confirmation email...');
    await sendEmail({
      to: contact.email,
      subject: 'Thank you for contacting ReturnFilers',
      html: customerHtml
    });
    console.log('✅ Customer email sent');

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




