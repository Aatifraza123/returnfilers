const Portfolio = require('../models/portfolioModel');

// @desc    Get all portfolio items
// @route   GET /api/portfolio
const getPortfolios = async (req, res) => {
  try {
    const portfolio = await Portfolio.find({}).sort({ date: -1 });
    res.json({ portfolio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single portfolio item
// @route   GET /api/portfolio/:id
const getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (portfolio) {
      res.json(portfolio);
    } else {
      res.status(404).json({ message: 'Portfolio item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Invalid Portfolio ID' });
  }
};

// @desc    Create new portfolio item
// @route   POST /api/portfolio
const createPortfolio = async (req, res) => {
  try {
    const { title, client, description, outcome, images } = req.body;
    
    if (!title || !client || !description) {
      return res.status(400).json({ message: 'Title, client, and description are required' });
    }

    const portfolio = await Portfolio.create({
      title,
      client,
      description,
      outcome,
      images: images || []
    });

    res.status(201).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update portfolio item
// @route   PUT /api/portfolio/:id
const updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (portfolio) {
      portfolio.title = req.body.title || portfolio.title;
      portfolio.client = req.body.client || portfolio.client;
      portfolio.description = req.body.description || portfolio.description;
      portfolio.outcome = req.body.outcome !== undefined ? req.body.outcome : portfolio.outcome;
      portfolio.images = req.body.images || portfolio.images;
      
      const updatedPortfolio = await portfolio.save();
      res.json(updatedPortfolio);
    } else {
      res.status(404).json({ message: 'Portfolio item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete portfolio item
// @route   DELETE /api/portfolio/:id
const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (portfolio) {
      await portfolio.deleteOne();
      res.json({ message: 'Portfolio item removed' });
    } else {
      res.status(404).json({ message: 'Portfolio item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio
};










