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
    res.status(201).json(quote);
  } catch (error) {
    console.error('Quote creation error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to create quote',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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

