const Quote = require('../models/quoteModel');
const nodemailer = require('nodemailer');

// @desc    Create new quote request
// @route   POST /api/quotes
const createQuote = async (req, res) => {
  try {
    console.log('Quote creation request received:', req.body);
    const { name, email, phone, company, service, budget, message } = req.body;

    // Validation
    if (!name || !email || !phone || !service || !message) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({ 
        message: 'Please fill in all required fields',
        missing: {
          name: !name,
          email: !email,
          phone: !phone,
          service: !service,
          message: !message
        }
      });
    }

    // Save to Database
    const quote = await Quote.create({
      name,
      email,
      phone,
      company: company || '',
      service,
      budget: budget || '',
      message
    });

    console.log('Quote created successfully:', quote._id);

    // Send response immediately
    res.status(201).json(quote);

    // Send emails in background (non-blocking)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      setImmediate(() => {
        sendQuoteEmails(quote)
          .then(() => {
            console.log('Quote emails sent successfully');
          })
          .catch(err => {
            console.error('Quote email sending failed (non-blocking):', err);
          });
      });
    }
  } catch (error) {
    console.error('Quote creation error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to create quote',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Helper function to send quote emails
const sendQuoteEmails = async (quote) => {
  console.log('sendQuoteEmails called for:', quote._id);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email credentials not configured');
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
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000
    });

    // Try to verify transporter (don't block if it fails)
    try {
      console.log('Verifying email transporter...');
      await transporter.verify();
      console.log('Email transporter verified successfully');
    } catch (verifyError) {
      console.warn('Email transporter verification failed, but continuing:', verifyError.message);
    }

    const adminEmail = process.env.EMAIL_USER || 'razaaatif658@gmail.com';

    // Admin notification email
    const adminEmailContent = {
      from: `"Tax Filer" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Quote Request: ${quote.service} - ${quote.name}`,
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
                      <h1 style="color: #D4AF37; margin: 0; font-size: 24px; font-weight: bold;">New Quote Request</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px;">
                      <table width="100%" cellpadding="8" cellspacing="0">
                        <tr>
                          <td style="color: #666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td>
                          <td style="color: #0B1530; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${quote.name}</td>
                        </tr>
                        <tr>
                          <td style="color: #666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td>
                          <td style="color: #0B1530; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;"><a href="mailto:${quote.email}" style="color: #0B1530;">${quote.email}</a></td>
                        </tr>
                        <tr>
                          <td style="color: #666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong></td>
                          <td style="color: #0B1530; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${quote.phone}</td>
                        </tr>
                        ${quote.company ? `
                        <tr>
                          <td style="color: #666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Company:</strong></td>
                          <td style="color: #0B1530; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${quote.company}</td>
                        </tr>
                        ` : ''}
                        <tr>
                          <td style="color: #666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Service:</strong></td>
                          <td style="color: #0B1530; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${quote.service}</td>
                        </tr>
                        ${quote.budget ? `
                        <tr>
                          <td style="color: #666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Budget:</strong></td>
                          <td style="color: #0B1530; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${quote.budget}</td>
                        </tr>
                        ` : ''}
                        <tr>
                          <td style="color: #666; font-size: 14px; padding: 8px 0; vertical-align: top;"><strong>Message:</strong></td>
                          <td style="color: #333; font-size: 14px; padding: 8px 0; text-align: right; line-height: 1.5;">${quote.message.replace(/\n/g, '<br>')}</td>
                        </tr>
                      </table>
                      <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-left: 3px solid #0B1530; border-radius: 4px;">
                        <p style="margin: 0; color: #666; font-size: 12px;"><strong>Reference ID:</strong> ${quote._id}</p>
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

    // Customer auto-reply email
    const customerEmail = {
      from: `"Tax Filer" <${process.env.EMAIL_USER}>`,
      to: quote.email,
      subject: `Quote Request Received - ${quote.service}`,
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
                      <p style="color: #0B1530; margin-top: 0; font-size: 16px;">Dear ${quote.name},</p>
                      <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">Thank you for requesting a quote from <strong>Tax Filer</strong>. We have received your quote request for <strong>${quote.service}</strong>.</p>
                      <div style="margin: 20px 0; padding: 20px; background-color: #f8f9fa; border-left: 4px solid #D4AF37; border-radius: 4px;">
                        <p style="margin: 0; color: #0B1530; font-size: 14px; font-weight: bold;">Your Quote Request:</p>
                        <p style="margin: 5px 0; color: #333; font-size: 14px;"><strong>Service:</strong> ${quote.service}</p>
                        ${quote.budget ? `<p style="margin: 5px 0; color: #333; font-size: 14px;"><strong>Budget:</strong> ${quote.budget}</p>` : ''}
                        <p style="margin: 10px 0 0 0; color: #0B1530; font-size: 14px; font-weight: bold;">Your Message:</p>
                        <p style="margin: 5px 0 0 0; color: #333; font-size: 14px; line-height: 1.5;">${quote.message.replace(/\n/g, '<br>')}</p>
                      </div>
                      <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 20px 0;">Our team will review your requirements and send you a detailed quote within 24 hours.</p>
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

    // Send admin email - independent try/catch
    let adminSent = false;
    try {
      console.log('=== SENDING ADMIN EMAIL ===');
      console.log('From:', adminEmailContent.from);
      console.log('To:', adminEmail);
      console.log('Subject:', adminEmailContent.subject);
      
      const adminResult = await Promise.race([
        transporter.sendMail(adminEmailContent),
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
      console.log('To:', quote.email);
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
      console.log('✅ Both quote emails sent successfully!');
    }
  } catch (error) {
    console.error('❌ Quote email sending error:', error);
    throw error;
  }
};

// @desc    Get all quotes (Admin)
// @route   GET /api/quotes
const getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({}).sort({ createdAt: -1 });
    res.json({ quotes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update quote status (Admin)
// @route   PATCH /api/quotes/:id
const updateQuote = async (req, res) => {
  try {
    const { status } = req.body;
    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }

    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete quote (Admin)
// @route   DELETE /api/quotes/:id
const deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id);

    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }

    res.json({ message: 'Quote deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createQuote,
  getQuotes,
  updateQuote,
  deleteQuote
};

