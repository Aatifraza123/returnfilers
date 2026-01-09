require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/settingsModel');

const testColors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected\n');
    
    const settings = await Settings.findOne();
    
    console.log('📋 Current Social Media Colors:');
    console.log('Icon Color:', settings.socialMediaColors?.iconColor || 'NOT SET');
    console.log('Hover Color:', settings.socialMediaColors?.iconHoverColor || 'NOT SET');
    
    // Test with bright colors to see if it works
    console.log('\n🎨 Setting test colors (Blue & Yellow)...');
    settings.socialMediaColors = {
      iconColor: '#0000FF', // Blue
      iconHoverColor: '#FFFF00' // Yellow
    };
    
    await settings.save();
    
    console.log('\n✅ Updated Colors:');
    console.log('Icon Color:', settings.socialMediaColors.iconColor);
    console.log('Hover Color:', settings.socialMediaColors.iconHoverColor);
    
    console.log('\n🔄 Refresh browser and check footer social icons!');
    console.log('📍 Home page: http://localhost:5174/');
    console.log('📍 Test page: http://localhost:5174/test-settings');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testColors();
