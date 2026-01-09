require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/settingsModel');

const setLogoAndColors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected\n');
    
    const settings = await Settings.findOne();
    
    // Set logo and normal colors
    settings.logo = 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&h=150&fit=crop';
    settings.logoText = 'RF';
    settings.socialMediaColors = {
      iconColor: '#C9A227', // Gold
      iconHoverColor: '#FFFFFF' // White
    };
    
    await settings.save();
    
    console.log('✅ Settings Updated:');
    console.log('Logo:', settings.logo);
    console.log('Logo Text:', settings.logoText);
    console.log('Social Media Icon Color:', settings.socialMediaColors.iconColor, '(Gold)');
    console.log('Social Media Hover Color:', settings.socialMediaColors.iconHoverColor, '(White)');
    
    console.log('\n🔄 Refresh browser to see changes!');
    console.log('📍 Test page: http://localhost:5174/test-settings');
    console.log('📍 Home page: http://localhost:5174/');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

setLogoAndColors();
