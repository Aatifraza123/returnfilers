const Consultation = require('../models/Consultation');
const nodemailer = require('nodemailer');

// @desc    Submit consultation request
// @route   POST /api/consultations
// @access  Public
const createConsultation = async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    console.log('NEW CONSULTATION REQUEST');
    console.log('Data:', { name, email, phone, service });

    // Validation
    if (!name || !email || !phone || !service) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, phone, and service'
      });
    }

    // Clean phone number
    const cleanPhone = phone.replace(/\D/g, '');

    // Create consultation
    const consultation = await Consultation.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      service: service.trim(),
      message: message ? message.trim() : ''
    });

    console.log('Consultation saved:', consultation._id);

    // Send response immediately (BEFORE any email operations)
    res.status(201).json({
      success: true,
      message: 'Consultation request submitted successfully! We will contact you within 24 hours.',
      data: {
        id: consultation._id,
        name: consultation.name,
        service: consultation.service
      }
    });

    // Send emails in next event loop tick (completely non-blocking)
    setImmediate(() => {
      console.log('Starting email sending process for consultation:', consultation._id);
      sendConsultationEmails(consultation)
        .then(() => {
          console.log('Consultation emails sent successfully');
        })
        .catch(err => {
          console.error('Email sending failed (non-blocking):', err);
        });
    });
  } catch (error) {
    console.error('Consultation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit consultation request'
    });
  }
};

// @desc    Get all consultations
// @route   GET /api/consultations
// @access  Private/Admin
const getConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find()
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: consultations.length,
      data: consultations
    });
  } catch (error) {
    console.error('Get consultations error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single consultation
// @route   GET /api/consultations/:id
// @access  Private/Admin
const getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    res.json({
      success: true,
      data: consultation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update consultation status
// @route   PATCH /api/consultations/:id
// @access  Private/Admin
const updateConsultation = async (req, res) => {
  try {
    const { status } = req.body;

    const consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    res.json({
      success: true,
      message: 'Consultation updated successfully',
      data: consultation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete consultation
// @route   DELETE /api/consultations/:id
// @access  Private/Admin
const deleteConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findByIdAndDelete(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    res.json({
      success: true,
      message: 'Consultation deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to send emails
const sendConsultationEmails = async (consultation) => {
  console.log('sendConsultationEmails called for:', consultation._id);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email credentials not configured');
    console.log('EMAIL_USER exists:', !!process.env.EMAIL_USER);
    console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
    return;
  }

  try {
    console.log('Creating email transporter...');
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
    console.log('Verifying email transporter...');
    await transporter.verify();
    console.log('Email transporter verified successfully');

    // Admin notification email
    const adminEmail = {
      from: `"CA Associates" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Consultation: ${consultation.service} - ${consultation.name}`,
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
                      <h1 style="color: #D4AF37; margin: 0; font-size: 24px; font-weight: bold;">New Consultation Request</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px;">
                      <div style="margin: 20px 0;">
                        <table width="100%" cellpadding="8" cellspacing="0">
                          <tr>
                            <td style="color: #666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td>
                            <td style="color: #0B1530; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${consultation.name}</td>
                          </tr>
                          <tr>
                            <td style="color: #666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td>
                            <td style="color: #0B1530; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;"><a href="mailto:${consultation.email}" style="color: #0B1530;">${consultation.email}</a></td>
                          </tr>
                          <tr>
                            <td style="color: #666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong></td>
                            <td style="color: #0B1530; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${consultation.phone}</td>
                          </tr>
                          <tr>
                            <td style="color: #666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Service:</strong></td>
                            <td style="color: #0B1530; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${consultation.service}</td>
                          </tr>
                          ${consultation.message ? `
                          <tr>
                            <td style="color: #666; font-size: 14px; padding: 8px 0; vertical-align: top;"><strong>Message:</strong></td>
                            <td style="color: #333; font-size: 14px; padding: 8px 0; text-align: right; line-height: 1.5;">${consultation.message.replace(/\n/g, '<br>')}</td>
                          </tr>
                          ` : ''}
                        </table>
                      </div>
                      <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-left: 3px solid #0B1530; border-radius: 4px;">
                        <p style="margin: 0; color: #666; font-size: 12px;"><strong>Reference ID:</strong> ${consultation._id}</p>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;"><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #0B1530; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
                      <p style="color: #D4AF37; margin: 0; font-size: 14px; font-weight: bold;">CA Associates</p>
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
      from: `"CA Associates" <${process.env.EMAIL_USER}>`,
      to: consultation.email,
      subject: `Consultation Request Received - ${consultation.service}`,
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
                      <p style="color: #0B1530; margin-top: 0; font-size: 16px;">Dear ${consultation.name},</p>
                      <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">Thank you for choosing <strong>CA Associates</strong>. We have received your consultation request for <strong>${consultation.service}</strong>.</p>
                      <div style="margin: 20px 0; padding: 20px; background-color: #f8f9fa; border-left: 4px solid #D4AF37; border-radius: 4px;">
                        <p style="margin: 0 0 10px 0; color: #0B1530; font-size: 14px; font-weight: bold;">Your Service Request:</p>
                        <p style="margin: 0; color: #333; font-size: 14px;">${consultation.service}</p>
                        ${consultation.message ? `
                        <p style="margin: 10px 0 0 0; color: #0B1530; font-size: 14px; font-weight: bold;">Your Message:</p>
                        <p style="margin: 5px 0 0 0; color: #333; font-size: 14px; line-height: 1.5;">${consultation.message.replace(/\n/g, '<br>')}</p>
                        ` : ''}
                      </div>
                      <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 20px 0;">Our team will contact you at <strong>${consultation.phone}</strong> within 24 hours to discuss your requirements.</p>
                      <div style="margin: 20px 0; padding: 15px; background-color: #e7f3ff; border: 1px solid #b3d9ff; border-radius: 4px;">
                        <p style="margin: 0; color: #004085; font-size: 14px;"><strong>Contact Information:</strong></p>
                        <p style="margin: 5px 0 0 0; color: #004085; font-size: 14px;">Email: ${process.env.EMAIL_USER}<br>Hours: Mon-Fri, 9am - 6pm IST</p>
                      </div>
                      <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 20px 0 0 0;">Best regards,<br><strong>CA Associates Team</strong></p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #0B1530; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
                      <p style="color: #D4AF37; margin: 0; font-size: 14px; font-weight: bold;">CA Associates</p>
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
      console.log('To:', process.env.EMAIL_USER);
      console.log('Subject:', adminEmail.subject);
      const adminResult = await transporter.sendMail(adminEmail);
      adminSent = true;
      console.log('Admin email sent successfully!');
      console.log('Message ID:', adminResult.messageId);
      console.log('Response:', adminResult.response);
    } catch (adminError) {
      console.error('=== ADMIN EMAIL FAILED ===');
      console.error('Error:', adminError.message);
      console.error('Code:', adminError.code);
      console.error('Command:', adminError.command);
      if (adminError.response) {
        console.error('Response:', adminError.response);
      }
      // Continue to send customer email even if admin email fails
    }

    // Send customer auto-reply email - independent try/catch
    let customerSent = false;
    try {
      console.log('=== SENDING CUSTOMER EMAIL ===');
      console.log('To:', consultation.email);
      console.log('Subject:', customerEmail.subject);
      const customerResult = await transporter.sendMail(customerEmail);
      customerSent = true;
      console.log('Customer email sent successfully!');
      console.log('Message ID:', customerResult.messageId);
      console.log('Response:', customerResult.response);
    } catch (customerError) {
      console.error('=== CUSTOMER EMAIL FAILED ===');
      console.error('Error:', customerError.message);
      console.error('Code:', customerError.code);
      console.error('Command:', customerError.command);
      if (customerError.response) {
        console.error('Response:', customerError.response);
      }
      // Don't throw - we already logged the error
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
      console.log('Both consultation emails sent successfully!');
    }
  } catch (error) {
    console.error('=== CRITICAL EMAIL ERROR ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    throw error; // Re-throw to be caught by caller
  }
};

module.exports = {
  createConsultation,
  getConsultations,
  getConsultationById,
  updateConsultation,
  deleteConsultation
};







