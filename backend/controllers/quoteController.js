const Quote = require('../models/quoteModel');

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
    setImmediate(() => {
      sendQuoteEmails(quote)
        .then(() => console.log('Quote emails sent successfully'))
        .catch(err => console.error('Quote email sending failed:', err.message));
    });
  } catch (error) {
    console.error('Quote creation error:', error);
    res.status(500).json({ message: error.message || 'Failed to create quote' });
  }
};

// Helper function to send quote emails using Resend
const sendQuoteEmails = async (quote) => {
  console.log('sendQuoteEmails called for:', quote._id);
  
  const { sendEmail } = require('../utils/emailService');
  const adminEmail = process.env.EMAIL_USER || 'razaaatif658@gmail.com';

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
                      <td style="color: #0B1530; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${quote.email}</td>
                    </tr>
                    <tr>
                      <td style="color: #666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong></td>
                      <td style="color: #0B1530; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${quote.phone}</td>
                    </tr>
                    ${quote.company ? `<tr><td style="color: #666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Company:</strong></td><td style="text-align: right;">${quote.company}</td></tr>` : ''}
                    <tr>
                      <td style="color: #666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Service:</strong></td>
                      <td style="color: #0B1530; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${quote.service}</td>
                    </tr>
                    ${quote.budget ? `<tr><td style="color: #666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Budget:</strong></td><td style="text-align: right;">${quote.budget}</td></tr>` : ''}
                    <tr>
                      <td style="color: #666; font-size: 14px; padding: 8px 0; vertical-align: top;"><strong>Message:</strong></td>
                      <td style="color: #333; font-size: 14px; padding: 8px 0; text-align: right;">${quote.message.replace(/\n/g, '<br>')}</td>
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
                  <p style="color: #D4AF37; margin: 0; font-size: 14px; font-weight: bold;">ReturnFilers</p><p style="color: #ffffff; margin: 5px 0 0 0; font-size: 12px;">Professional Tax & Financial Services</p><p style="margin: 10px 0 0 0;"><a href="https://returnfilers.in" style="color: #D4AF37; text-decoration: none; font-size: 12px;">www.returnfilers.in</a></p>
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
                  <p style="color: #333; font-size: 16px;">Dear ${quote.name},</p>
                  <p style="color: #666; font-size: 14px; line-height: 1.6;">Thank you for requesting a quote for <strong>${quote.service}</strong>. Our team will review your requirements and send you a detailed quote within 24 hours.</p>
                  <p style="color: #666; font-size: 14px;">For urgent queries, call us at <strong>+91 84471 27264</strong></p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #0B1530; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
                  <p style="color: #D4AF37; margin: 0; font-size: 14px; font-weight: bold;">ReturnFilers</p><p style="color: #ffffff; margin: 5px 0 0 0; font-size: 12px;">Professional Tax & Financial Services</p><p style="margin: 10px 0 0 0;"><a href="https://returnfilers.in" style="color: #D4AF37; text-decoration: none; font-size: 12px;">www.returnfilers.in</a></p>
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
    // Send admin notification
    await sendEmail({
      to: adminEmail,
      subject: `New Quote Request: ${quote.service} - ${quote.name}`,
      html: adminHtml
    });
    console.log('✅ Admin email sent');

    // Customer confirmation
    await sendEmail({
      to: quote.email,
      subject: `Quote Request Received - ${quote.service}`,
      html: customerHtml
    });
    console.log('✅ Customer email sent');

  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
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

