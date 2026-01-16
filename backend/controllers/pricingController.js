const Pricing = require('../models/Pricing');

// Get all active pricing plans
exports.getAllPricing = async (req, res) => {
  try {
    const pricingPlans = await Pricing.find({ active: true }).sort({ category: 1, order: 1 });
    res.json({ success: true, data: pricingPlans });
  } catch (error) {
    console.error('Error fetching pricing:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pricing plans' });
  }
};

// Get pricing by category
exports.getPricingByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const pricingPlans = await Pricing.find({ category, active: true }).sort({ order: 1 });
    res.json({ success: true, data: pricingPlans });
  } catch (error) {
    console.error('Error fetching pricing by category:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pricing plans' });
  }
};

// Get single pricing plan
exports.getPricingById = async (req, res) => {
  try {
    const pricing = await Pricing.findById(req.params.id);
    if (!pricing) {
      return res.status(404).json({ success: false, message: 'Pricing plan not found' });
    }
    res.json({ success: true, data: pricing });
  } catch (error) {
    console.error('Error fetching pricing:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pricing plan' });
  }
};

// Create pricing plan (Admin only)
exports.createPricing = async (req, res) => {
  try {
    const pricing = new Pricing(req.body);
    await pricing.save();
    res.status(201).json({ success: true, message: 'Pricing plan created successfully', data: pricing });
  } catch (error) {
    console.error('Error creating pricing:', error);
    res.status(500).json({ success: false, message: 'Failed to create pricing plan' });
  }
};

// Update pricing plan (Admin only)
exports.updatePricing = async (req, res) => {
  try {
    const pricing = await Pricing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!pricing) {
      return res.status(404).json({ success: false, message: 'Pricing plan not found' });
    }
    res.json({ success: true, message: 'Pricing plan updated successfully', data: pricing });
  } catch (error) {
    console.error('Error updating pricing:', error);
    res.status(500).json({ success: false, message: 'Failed to update pricing plan' });
  }
};

// Delete pricing plan (Admin only)
exports.deletePricing = async (req, res) => {
  try {
    const pricing = await Pricing.findByIdAndDelete(req.params.id);
    if (!pricing) {
      return res.status(404).json({ success: false, message: 'Pricing plan not found' });
    }
    res.json({ success: true, message: 'Pricing plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting pricing:', error);
    res.status(500).json({ success: false, message: 'Failed to delete pricing plan' });
  }
};

// Get all pricing (including inactive) - Admin only
exports.getAllPricingAdmin = async (req, res) => {
  try {
    const pricingPlans = await Pricing.find().sort({ category: 1, order: 1 });
    res.json({ success: true, data: pricingPlans });
  } catch (error) {
    console.error('Error fetching all pricing:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pricing plans' });
  }
};
