const DigitalService = require('../models/DigitalService');
const axios = require('axios');

// Helper function to invalidate AI chatbot cache
const invalidateAIChatbotCache = async () => {
  try {
    await axios.post('http://localhost:5000/api/chat/invalidate-cache');
    console.log('🤖 AI Chatbot cache invalidated after digital service update');
  } catch (error) {
    console.log('⚠️ Failed to invalidate AI chatbot cache:', error.message);
  }
};

// Get all digital services
exports.getDigitalServices = async (req, res) => {
  try {
    const services = await DigitalService.find().sort({ createdAt: -1 });
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single digital service
exports.getDigitalServiceById = async (req, res) => {
  try {
    const service = await DigitalService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create digital service
exports.createDigitalService = async (req, res) => {
  try {
    const { title, slug, icon, price, timeline, description, features, packages, active } = req.body;
    
    const service = await DigitalService.create({
      title,
      slug,
      icon,
      price,
      timeline,
      description,
      features,
      packages: packages || [],
      active
    });
    
    // Invalidate AI chatbot cache
    await invalidateAIChatbotCache();
    
    res.status(201).json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update digital service
exports.updateDigitalService = async (req, res) => {
  try {
    const service = await DigitalService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    
    // Invalidate AI chatbot cache
    await invalidateAIChatbotCache();
    
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete digital service
exports.deleteDigitalService = async (req, res) => {
  try {
    const service = await DigitalService.findByIdAndDelete(req.params.id);
    
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    
    // Invalidate AI chatbot cache
    await invalidateAIChatbotCache();
    
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
