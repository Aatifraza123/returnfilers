const Settings = require('../models/settingsModel');

// Get settings
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // Create default settings if none exist
    if (!settings) {
      settings = await Settings.create({
        companyName: 'ReturnFilers',
        email: 'info@returnfilers.in',
        phone: '+91 84471 27264',
        privacyPolicy: 'Privacy Policy content goes here...',
        termsConditions: 'Terms & Conditions content goes here...',
        refundPolicy: 'Refund Policy content goes here...'
      });
    }
    
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
};

// Update settings (Admin only)
const updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    updates.lastUpdated = new Date();
    
    console.log('📥 Received updates:', JSON.stringify(updates, null, 2));
    
    let settings = await Settings.findOne();
    
    if (!settings) {
      console.log('Creating new settings...');
      settings = await Settings.create(updates);
    } else {
      console.log('Updating existing settings...');
      
      // Use findOneAndUpdate with $set to properly handle nested objects
      settings = await Settings.findOneAndUpdate(
        {},
        { $set: updates },
        { new: true, runValidators: true }
      );
      
      console.log('✅ Settings saved successfully');
    }
    
    console.log('📤 Returning settings');
    res.json({ success: true, data: settings, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
