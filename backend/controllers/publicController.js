const Service = require('../models/serviceModel');
const Blog = require('../models/blogModel');
const Portfolio = require('../models/portfolioModel');

const getPublicServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPublicBlogs = async (req, res) => {
  try {
    // Check if isPublished field exists in schema, if not, get all blogs
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPublicPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.find().sort({ date: -1 });
    res.json({ success: true, portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Ensure all functions are exported in one object
module.exports = {
  getPublicServices,
  getPublicBlogs,
  getPublicPortfolio
};

