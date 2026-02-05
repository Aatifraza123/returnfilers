const Quote = require('../models/quoteModel');
const { createQuoteNotification } = require('../utils/notificationHelper');

// @desc    Create new quote request
// @route   POST /api/quotes
// @access  Private (User must be logged in)
const createQuote = async (req, res) => {
  try {
    console.log('Quote creation request received:', req.body);
    const { name, email, phone, company, service, budget, message } = req.body;
    const userId = req.user?.id; // Get user ID from auth middleware (optional)

    console.log('User ID:', userId || 'Not logged in');

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
      user: userId || undefined,
      name,
      email,
      phone,
      company: company || '',
      service,
      budget: budget || '',
      message
    });

    // Add quote to user's quotes array if user is logged in
    if (userId) {
      const User = require('../models/userModel');
      await User.findByIdAndUpdate(userId, {
        $push: { quotes: quote._id }
      });
      console.log('Quote linked to user:', userId);
    }

    console.log('Quote created successfully:', quote._id);

    // Send response immediately
    res.status(201).json(quote);

    // Send emails in background (non-blocking)
    setImmediate(async () => {
      try {
        await sendQuoteEmails(quote);
        console.log('Quote emails sent successfully');
        
        // Create notifications - pass quote with populated user field
        const quoteData = quote.toObject();
        quoteData.user = userId; // Ensure user ID is set
        await createQuoteNotification(quoteData);
        
        // Capture lead for scoring and follow-up
        const { captureLeadFromForm } = require('../utils/leadScoringService');
        await captureLeadFromForm({
          name: quote.name,
          email: quote.email,
          phone: quote.phone,
          source: 'quote_request',
          service: quote.service,
          budget: quote.budget,
          message: quote.message
        });
        console.log('✅ Lead captured from quote request');
      } catch (err) {
        console.error('Quote email/notification/lead capture failed:', err.message);
      }
    });
  } catch (error) {
    console.error('Quote creation error:', error);
    res.status(500).json({ message: error.message || 'Failed to create quote' });
  }
};

// Helper function to send quote emails using professional templates
const sendQuoteEmails = async (quote) => {
  console.log('sendQuoteEmails called for:', quote._id);
  
  const { sendEmail } = require('../utils/emailService');
  const { getAdminNotificationTemplate, getCustomerConfirmationTemplate } = require('../utils/emailTemplates');

  // Use old working templates
  const adminHtml = getAdminNotificationTemplate({
    type: 'quote',
    data: {
      name: quote.name,
      email: quote.email,
      phone: quote.phone,
      service: quote.service,
      message: quote.message
    }
  });

  const customerHtml = getCustomerConfirmationTemplate({
    type: 'quote',
    data: {
      name: quote.name,
      service: quote.service,
      message: quote.message
    }
  });

  try {
    // Send admin notification to info@returnfilers.in only
    console.log('Sending admin notification email to info@returnfilers.in...');
    await sendEmail({
      to: 'info@returnfilers.in',
      subject: `New Quote Request: ${quote.service} - ${quote.name}`,
      html: adminHtml
    });
    console.log('✅ Admin email sent to info@returnfilers.in');

    // Customer confirmation
    console.log('Sending customer confirmation email...');
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

// @desc    Get user's quotes
// @route   GET /api/quotes/my-quotes
// @access  Private (User)
const getUserQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      count: quotes.length, 
      quotes 
    });
  } catch (error) {
    console.error('Get user quotes error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createQuote,
  getQuotes,
  updateQuote,
  deleteQuote,
  getUserQuotes
};

