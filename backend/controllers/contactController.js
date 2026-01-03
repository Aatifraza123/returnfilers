const Contact = require('../models/Contact');
const { sendEmail } = require('../utils/emailService');

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

// Helper function to send bulk emails in background
const sendBulkEmailsInBackground = async (recipients, subject, message) => {
  console.log('Starting background bulk email sending...');
  
  // Create transporter with explicit SMTP settings (works better on Render)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    pool: true,
    maxConnections: 3,
    maxMessages: 50,
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000,
    socketTimeout: 60000,
    tls: {
      rejectUnauthorized: false // Allow self-signed certificates
    }
  });

  // Process emails in batches to avoid overwhelming the server
  const batchSize = 10; // Send 10 emails at a time
  let sentCount = 0;
  let failedCount = 0;

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}: ${batch.length} emails (${i + 1}-${Math.min(i + batchSize, recipients.length)} of ${recipients.length})`);

    // Send batch in parallel
    const batchPromises = batch.map(async (recipient) => {
      try {
        const mailOptions = {
          from: `"Tax Filer" <${process.env.EMAIL_USER}>`,
          to: recipient.email,
          subject: subject,
          html: `
            <!DOCTYPE html>
            <html>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                      <tr>
                        <td style="background-color: #0B1530; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                          <h1 style="color: #D4AF37; margin: 0; font-size: 24px; font-weight: bold;">Tax Filer</h1>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 30px;">
                          <p style="color: #0B1530; margin-top: 0; font-size: 16px;">Dear ${recipient.name || 'Valued Client'},</p>
                          <div style="color: #333; font-size: 15px; line-height: 1.6;">
                            ${message}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="background-color: #0B1530; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
                          <p style="color: #D4AF37; margin: 0; font-size: 14px; font-weight: bold;">Tax Filer</p>
                          <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 12px;">Professional Tax & Financial Services</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `
        };

        await transporter.sendMail(mailOptions);
        sentCount++;
        return { success: true, email: recipient.email };
      } catch (error) {
        failedCount++;
        console.error(`Failed to send email to ${recipient.email}:`, error.message);
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
  console.log('sendContactEmails called for:', contact._id);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email credentials not configured');
    console.log('EMAIL_USER exists:', !!process.env.EMAIL_USER);
    console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
    return;
  }

  try {
    console.log('Creating email transporter...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'EXISTS' : 'MISSING');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'EXISTS' : 'MISSING');
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
      tls: {
        rejectUnauthorized: false
      }
    });

    // Try to verify transporter (don't block if it fails)
    try {
      console.log('Verifying email transporter...');
      await transporter.verify();
      console.log('Email transporter verified successfully');
    } catch (verifyError) {
      console.warn('Email transporter verification failed, but continuing:', verifyError.message);
    }

    // Admin notification email
    const adminEmailAddress = process.env.EMAIL_USER || 'razaaatif658@gmail.com';
    const adminEmail = {
      from: `"Tax Filer" <${process.env.EMAIL_USER}>`,
      to: adminEmailAddress,
      subject: `New Contact Message from ${contact.name}`,
      html: `
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
                      <p style="color: #D4AF37; margin: 0; font-size: 14px; font-weight: bold;">Tax Filer</p>
                      <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 12px;">Professional Tax & Financial Services</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    // Customer confirmation email (Auto-reply)
    const customerEmail = {
      from: `"Tax Filer" <${process.env.EMAIL_USER}>`,
      to: contact.email,
      subject: 'Thank you for contacting Tax Filer',
      html: `
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
                      <p style="color: #0B1530; margin-top: 0; font-size: 16px;">Dear ${contact.name},</p>
                      <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">Thank you for reaching out to <strong>Tax Filer</strong>. We have received your message and will get back to you within 24 hours.</p>
                      <div style="margin: 20px 0; padding: 20px; background-color: #f8f9fa; border-left: 4px solid #D4AF37; border-radius: 4px;">
                        <p style="margin: 0; color: #0B1530; font-size: 14px; font-weight: bold;">Your Message:</p>
                        <p style="margin: 10px 0 0 0; color: #333; font-size: 14px; line-height: 1.5;">${contact.message.replace(/\n/g, '<br>')}</p>
                      </div>
                      <div style="margin: 20px 0; padding: 15px; background-color: #e7f3ff; border: 1px solid #b3d9ff; border-radius: 4px;">
                        <p style="margin: 0; color: #004085; font-size: 14px;"><strong>Contact Information:</strong></p>
                        <p style="margin: 5px 0 0 0; color: #004085; font-size: 14px;">Email: ${process.env.EMAIL_USER}<br>Hours: Mon-Fri, 9am - 6pm IST</p>
                      </div>
                      <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 20px 0 0 0;">Best regards,<br><strong>Tax Filer Team</strong></p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #0B1530; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
                      <p style="color: #D4AF37; margin: 0; font-size: 14px; font-weight: bold;">Tax Filer</p>
                      <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 12px;">Professional Tax & Financial Services</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    // Send admin email - independent try/catch so customer email still sends if admin fails
    let adminSent = false;
    try {
      console.log('=== SENDING ADMIN EMAIL ===');
      console.log('From:', adminEmail.from);
      console.log('To:', adminEmailAddress);
      console.log('Subject:', adminEmail.subject);
      
      const adminResult = await Promise.race([
        transporter.sendMail(adminEmail),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email send timeout after 20 seconds')), 20000)
        )
      ]);
      
      adminSent = true;
      console.log('✅ Admin email sent successfully!');
      console.log('Message ID:', adminResult.messageId);
      console.log('Response:', adminResult.response);
    } catch (adminError) {
      console.error('❌ ADMIN EMAIL FAILED ===');
      console.error('Error message:', adminError.message);
      console.error('Error code:', adminError.code);
      console.error('Full error:', JSON.stringify(adminError, null, 2));
      if (adminError.response) {
        console.error('SMTP Response:', adminError.response);
      }
      if (adminError.responseCode) {
        console.error('Response Code:', adminError.responseCode);
      }
    }

    // Send customer auto-reply email - independent try/catch
    let customerSent = false;
    try {
      console.log('=== SENDING CUSTOMER EMAIL ===');
      console.log('From:', customerEmail.from);
      console.log('To:', contact.email);
      console.log('Subject:', customerEmail.subject);
      
      const customerResult = await Promise.race([
        transporter.sendMail(customerEmail),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email send timeout after 20 seconds')), 20000)
        )
      ]);
      
      customerSent = true;
      console.log('✅ Customer email sent successfully!');
      console.log('Message ID:', customerResult.messageId);
      console.log('Response:', customerResult.response);
    } catch (customerError) {
      console.error('❌ CUSTOMER EMAIL FAILED ===');
      console.error('Error message:', customerError.message);
      console.error('Error code:', customerError.code);
      console.error('Full error:', JSON.stringify(customerError, null, 2));
      if (customerError.response) {
        console.error('SMTP Response:', customerError.response);
      }
      if (customerError.responseCode) {
        console.error('Response Code:', customerError.responseCode);
      }
    }

    // Summary
    console.log('=== EMAIL SENDING SUMMARY ===');
    console.log('Admin email sent:', adminSent);
    console.log('Customer email sent:', customerSent);
    
    if (!adminSent && !customerSent) {
      throw new Error('Both emails failed to send');
    } else if (!adminSent) {
      console.warn('Warning: Admin email failed but customer email sent');
    } else if (!customerSent) {
      console.warn('Warning: Customer email failed but admin email sent');
    } else {
      console.log('✅ Both contact emails sent successfully!');
    }
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




