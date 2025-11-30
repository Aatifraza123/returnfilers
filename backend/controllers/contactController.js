const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// @desc    Send bulk email
// @route   POST /api/contacts/bulk-email
// @access  Private/Admin
const sendBulkEmail = async (req, res) => {
  try {
    const { recipients, subject, message } = req.body;

    console.log('📧 BULK EMAIL REQUEST');
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

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send emails to all recipients
    const emailPromises = recipients.map(recipient => {
      const mailOptions = {
        from: `"CA Associates" <${process.env.EMAIL_USER}>`,
        to: recipient.email,
        subject: subject,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="background: linear-gradient(135deg, #0B1530 0%, #1a2b5c 100%); padding: 30px; text-align: center;">
                <h1 style="color: #D4AF37; margin: 0;">CA Associates</h1>
              </div>
              <div style="padding: 30px;">
                <p style="color: #0B1530; margin-top: 0;">Dear ${recipient.name},</p>
                ${message}
              </div>
              <div style="background: #0B1530; padding: 20px; text-align: center;">
                <p style="color: #D4AF37; margin: 0; font-weight: bold;">CA Associates</p>
                <p style="color: #fff; margin: 5px 0 0 0; font-size: 12px;">Professional Tax & Financial Services</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);

    console.log(`✅ Bulk email sent to ${recipients.length} recipients`);

    res.status(200).json({
      success: true,
      message: `Email sent successfully to ${recipients.length} recipients`,
      sentCount: recipients.length
    });
  } catch (error) {
    console.error('❌ Bulk email error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send bulk email'
    });
  }
};

// @desc    Submit contact message
// @route   POST /api/contacts
// @access  Public
const createContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    console.log('📧 NEW CONTACT MESSAGE');
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

    console.log('✅ Contact saved:', contact._id);

    // Send response immediately
    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
      data: {
        id: contact._id,
        name: contact.name
      }
    });

    // Send emails asynchronously (don't block response)
    sendContactEmails(contact).catch(err => {
      console.error('❌ Email sending failed (non-blocking):', err.message);
    });
  } catch (error) {
    console.error('❌ Contact error:', error);
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
      data: contacts
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
    const contact = await Contact.findById(req.params.id);

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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update contact status
// @route   PATCH /api/contacts/:id
// @access  Private/Admin
const updateContact = async (req, res) => {
  try {
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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
const deleteContact = async (req, res) => {
  try {
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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to send emails
const sendContactEmails = async (contact) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️ Email credentials not configured');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      pool: false,
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000
    });

    // Admin notification email - Simple
    const adminEmail = {
      from: `"CA Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Message from ${contact.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #0B1530; padding-bottom: 10px;">New Contact Message</h2>
          
          <div style="margin: 20px 0;">
            <p><strong>Name:</strong> ${contact.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
            <p><strong>Phone:</strong> ${contact.phone}</p>
            <p><strong>Message:</strong><br>${contact.message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 10px; background: #f5f5f5; border-left: 3px solid #0B1530;">
            <small>Ref: ${contact._id}</small><br>
            <small>Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</small>
          </div>
        </div>
      `
    };

    // Customer confirmation email - Simple
    const customerEmail = {
      from: `"CA Associates" <${process.env.EMAIL_USER}>`,
      to: contact.email,
      subject: 'Thank you for contacting CA Associates',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #0B1530; padding-bottom: 10px;">Thank You!</h2>
          
          <p>Dear ${contact.name},</p>
          
          <p>Thank you for reaching out to CA Associates. We have received your message and will get back to you within 24 hours.</p>
          
          <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 3px solid #0B1530;">
            <p style="margin: 0;"><strong>Your Message:</strong></p>
            <p style="margin: 10px 0 0 0;">${contact.message}</p>
          </div>
          
          <p><strong>Contact Information:</strong></p>
          <p>Phone: +91 98765 43210<br>
          Email: ${process.env.EMAIL_USER}<br>
          Hours: Mon-Fri, 9am - 6pm</p>
          
          <p>Best regards,<br>CA Associates Team</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <small style="color: #666;">CA Associates - Professional Tax & Financial Services</small>
        </div>
      `
    };

    await Promise.all([
      transporter.sendMail(adminEmail),
      transporter.sendMail(customerEmail)
    ]);

    console.log('✅ Contact emails sent');
  } catch (error) {
    console.error('❌ Email error:', error.message);
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




