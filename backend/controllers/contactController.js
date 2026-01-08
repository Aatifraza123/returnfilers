const Contact = require('../models/Contact');
const mongoose = require('mongoose');
const { sendEmail, sendBulkEmails } = require('../utils/emailService');
const nodemailer = require('nodemailer');

// @desc    Send bulk email
// @route   POST /api/contacts/bulk-email
// @access  Private/Admin
const sendBulkEmail = async (req, res) => {
  try {
    const { recipients, subject, message } = req.body;

    console.log('BULK EMAIL REQUEST');
    console.log('Recipients count:', recipients?.length);

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

// Helper function to send bulk emails in background using emailService
const sendBulkEmailsInBackground = async (recipients, subject, message) => {
  console.log('Starting background bulk email sending...');
  
  let sentCount = 0;
  let failedCount = 0;

  // Process emails one by one with delay
  for (const recipient of recipients) {
    try {
      const html = `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px;">
                  <tr>
                    <td style="background-color: #0B1530; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                      <h1 style="color: #D4AF37; margin: 0; font-size: 24px;">ReturnFilers</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px;">
                      <p style="color: #0B1530; margin-top: 0; font-size: 16px;">Dear ${recipient.name || 'Valued Client'},</p>
                      <div style="color: #333; font-size: 15px; line-height: 1.6;">${message}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #0B1530; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
                      <p style="color: #D4AF37; margin: 0; font-weight: bold;">ReturnFilers</p>
                      <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 12px;">Professional Tax & Financial Services</p><p style="margin: 10px 0 0 0;"><a href="https://returnfilers.in" style="color: #D4AF37; text-decoration: none; font-size: 12px;">www.returnfilers.in</a></p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

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

// Helper function to send emails using Resend (primary) or Gmail (fallback)
const sendContactEmails = async (contact) => {
  console.log('sendContactEmails called for:', contact._id);
  
  const { sendEmail } = require('../utils/emailService');

  const adminEmailAddress = process.env.ADMIN_EMAIL || 'razaahmadwork@gmail.com';

  // Admin notification email HTML
  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                <td style="background-color: #0B1530; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="color: #D4AF37; margin: 0; font-size: 24px; font-weight: bold;">New Contact Message</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px;">
                  <table width="100%" cellpadding="8" cellspacing="0">
                    <tr>
                      <td style="color: #666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td>
                      <td style="color: #0B1530; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${contact.name}</td>
                    </tr>
                    <tr>
                      <td style="color: #666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td>
                      <td style="color: #0B1530; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;"><a href="mailto:${contact.email}" style="color: #0B1530;">${contact.email}</a></td>
                    </tr>
                    <tr>
                      <td style="color: #666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong></td>
                      <td style="color: #0B1530; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${contact.phone}</td>
                    </tr>
                    <tr>
                      <td style="color: #666; font-size: 14px; padding: 8px 0; vertical-align: top;"><strong>Message:</strong></td>
                      <td style="color: #333; font-size: 14px; padding: 8px 0; text-align: right; line-height: 1.5;">${contact.message.replace(/\n/g, '<br>')}</td>
                    </tr>
                  </table>
                  <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-left: 3px solid #0B1530; border-radius: 4px;">
                    <p style="margin: 0; color: #666; font-size: 12px;"><strong>Reference ID:</strong> ${contact._id}</p>
                    <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;"><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background-color: #0B1530; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
                  <p style="color: #D4AF37; margin: 0; font-size: 14px; font-weight: bold;">ReturnFilers</p>
                  <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 12px;">Professional Tax & Financial Services</p><p style="margin: 10px 0 0 0;"><a href="https://returnfilers.in" style="color: #D4AF37; text-decoration: none; font-size: 12px;">www.returnfilers.in</a></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Customer confirmation email HTML
  const customerHtml = `
    <!DOCTYPE html>
    <html>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                <td style="background-color: #0B1530; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="color: #D4AF37; margin: 0; font-size: 24px; font-weight: bold;">Thank You!</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px;">
                  <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear ${contact.name},</p>
                  <p style="color: #666; font-size: 14px; line-height: 1.6;">Thank you for reaching out to ReturnFilers. We have received your message and our team will get back to you within 24 hours.</p>
                  <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
                    <p style="margin: 0; color: #666; font-size: 14px;"><strong>Your Message:</strong></p>
                    <p style="margin: 10px 0 0 0; color: #333; font-size: 14px; line-height: 1.5;">${contact.message}</p>
                  </div>
                  <p style="color: #666; font-size: 14px; line-height: 1.6;">For urgent queries, call us at <strong>+91 84471 27264</strong></p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #0B1530; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
                  <p style="color: #D4AF37; margin: 0; font-size: 14px; font-weight: bold;">ReturnFilers</p>
                  <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 12px;">Professional Tax & Financial Services</p><p style="margin: 10px 0 0 0;"><a href="https://returnfilers.in" style="color: #D4AF37; text-decoration: none; font-size: 12px;">www.returnfilers.in</a></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    // Send admin notification to primary email
    console.log('Sending admin notification email to razaahmadwork@gmail.com...');
    await sendEmail({
      to: adminEmailAddress,
      subject: `New Contact Message from ${contact.name}`,
      html: adminHtml
    });
    console.log('✅ Admin email sent to razaahmadwork@gmail.com');

    // Send admin notification to info@returnfilers.in as well
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




