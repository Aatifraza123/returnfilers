require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/settingsModel');

const updateTransparentLogo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
    
    const settings = await Settings.findOne();
    if (!settings) {
      console.log('❌ Settings not found');
      return;
    }
    
    // Update logo to use local transparent logo
    // Option 1: Use local file (after you copy the image to frontend/public/)
    settings.logo = '/logo-transparent.png';
    
    // Option 2: Use hosted URL (if you upload to image hosting service)
    // settings.logo = 'YOUR_HOSTED_IMAGE_URL_HERE';
    
    settings.logoText = 'RF';
    
    await settings.save();
    console.log('✅ Logo updated successfully!');
    console.log('📸 New Logo URL:', settings.logo);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updateTransparentLogo();
