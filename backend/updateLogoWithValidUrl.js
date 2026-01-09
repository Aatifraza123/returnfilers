require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/settingsModel');

const updateLogo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected\n');
    
    // Use a reliable image URL
    const validLogoUrl = 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&h=150&fit=crop';
    
    const settings = await Settings.findOne();
    
    console.log('📋 Before Update:');
    console.log('Logo:', settings.logo || '(empty)');
    
    // Update with valid URL
    settings.logo = validLogoUrl;
    await settings.save();
    
    console.log('\n✅ After Update:');
    console.log('Logo:', settings.logo);
    console.log('\n🔗 Test this URL in browser:', validLogoUrl);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateLogo();
