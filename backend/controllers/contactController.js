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
          console.log(`✅ Bulk email sent to ${recipients.length} recipients`);
        })
        .catch(err => {
          console.error('❌ Background bulk email error:', err);
        });
    });
  } catch (error) {
    console.error('❌ Bulk email error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to queue bulk email'
    });
  }
};

// Helper function to send bulk emails in background
const sendBulkEmailsInBackground = async (recipients, subject, message) => {
  console.log('📧 Starting background bulk email sending...');
  
  // Create transporter with connection pooling
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    pool: true, // Enable connection pooling
    maxConnections: 5, // Send 5 emails concurrently
    maxMessages: 100, // Max messages per connection
    rateDelta: 1000, // Time window for rate limiting (1 second)
    rateLimit: 5 // Max 5 emails per second (Gmail limit is ~100/day, ~10/min for free)
  });

  // Process emails in batches to avoid overwhelming the server
  const batchSize = 10; // Send 10 emails at a time
  let sentCount = 0;
  let failedCount = 0;

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    
    console.log(`📧 Processing batch ${Math.floor(i / batchSize) + 1}: ${batch.length} emails (${i + 1}-${Math.min(i + batchSize, recipients.length)} of ${recipients.length})`);

    // Send batch in parallel
    const batchPromises = batch.map(async (recipient) => {
      try {
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
                  <p style="color: #0B1530; margin-top: 0;">Dear ${recipient.name || 'Valued Client'},</p>
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

        await transporter.sendMail(mailOptions);
        sentCount++;
        return { success: true, email: recipient.email };
      } catch (error) {
        failedCount++;
        console.error(`❌ Failed to send email to ${recipient.email}:`, error.message);
        return { success: false, email: recipient.email, error: error.message };
      }
    });

    // Wait for batch to complete
    await Promise.all(batchPromises);

    // Small delay between batches to avoid rate limiting
    if (i + batchSize < recipients.length) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between batches
    }
  }

  console.log(`✅ Bulk email completed: ${sentCount} sent, ${failedCount} failed`);
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
      console.log('📧 Starting email sending process for contact:', contact._id);
      sendContactEmails(contact)
        .then(() => {
          console.log('✅ Contact emails sent successfully');
        })
        .catch(err => {
          console.error('❌ Email sending failed (non-blocking):', err);
        });
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

// Helper function to send emails (completely async, non-blocking)
const sendContactEmails = async (contact) => {
  console.log('📧 sendContactEmails called for:', contact._id);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('⚠️ Email credentials not configured');
    console.log('EMAIL_USER exists:', !!process.env.EMAIL_USER);
    console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
    return;
  }

  try {
    console.log('📧 Creating email transporter...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      pool: false,
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 10000
    });

    // Verify transporter
    console.log('📧 Verifying email transporter...');
    await transporter.verify();
    console.log('✅ Email transporter verified successfully');

    // Admin notification email
    const adminEmail = {
      from: `"CA Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Message from ${contact.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0B1530; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">New Contact Message</h2>
          <div style="margin: 20px 0;">
            <p><strong>Name:</strong> ${contact.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
            <p><strong>Phone:</strong> ${contact.phone}</p>
            <p><strong>Message:</strong><br>${contact.message.replace(/\n/g, '<br>')}</p>
          </div>
          <div style="margin-top: 20px; padding: 10px; background: #f5f5f5; border-left: 3px solid #0B1530;">
            <small>Ref: ${contact._id}</small><br>
            <small>Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</small>
          </div>
        </div>
      `
    };

    // Customer confirmation email (Auto-reply)
    const customerEmail = {
      from: `"CA Associates" <${process.env.EMAIL_USER}>`,
      to: contact.email,
      subject: 'Thank you for contacting CA Associates',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0B1530; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Thank You!</h2>
          <p>Dear ${contact.name},</p>
          <p>Thank you for reaching out to <strong>CA Associates</strong>. We have received your message and will get back to you within 24 hours.</p>
          <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 3px solid #0B1530;">
            <p style="margin: 0;"><strong>Your Message:</strong></p>
            <p style="margin: 10px 0 0 0;">${contact.message.replace(/\n/g, '<br>')}</p>
          </div>
          <p><strong>Contact Information:</strong></p>
          <p>Email: ${process.env.EMAIL_USER}<br>
          Hours: Mon-Fri, 9am - 6pm IST</p>
          <p>Best regards,<br><strong>CA Associates Team</strong></p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <small style="color: #666;">CA Associates - Professional Tax & Financial Services</small>
        </div>
      `
    };

    // Send admin email
    console.log('📧 Sending admin notification email to:', process.env.EMAIL_USER);
    const adminResult = await transporter.sendMail(adminEmail);
    console.log('✅ Admin email sent successfully:', adminResult.messageId);

    // Send customer auto-reply email
    console.log('📧 Sending customer auto-reply email to:', contact.email);
    const customerResult = await transporter.sendMail(customerEmail);
    console.log('✅ Customer auto-reply email sent successfully:', customerResult.messageId);

    console.log('✅ Both contact emails sent successfully');
  } catch (error) {
    console.error('❌ Email sending error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    throw error; // Re-throw to be caught by caller
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




