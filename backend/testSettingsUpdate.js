require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/settingsModel');

const testUpdate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected\n');
    
    const settings = await Settings.findOne();
    
    console.log('📋 Current Settings:');
    console.log('Logo:', settings.logo || '(empty)');
    console.log('Social Media Icon Color:', settings.socialMediaColors?.iconColor);
    console.log('Social Media Hover Color:', settings.socialMediaColors?.iconHoverColor);
    
    // Test update
    settings.logo = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=150&h=150&fit=crop';
    settings.socialMediaColors = {
      iconColor: '#FF0000', // Red for testing
      iconHoverColor: '#00FF00' // Green for testing
    };
    
    await settings.save();
    
    console.log('\n✅ Updated Settings:');
    console.log('Logo:', settings.logo);
    console.log('Social Media Icon Color:', settings.socialMediaColors.iconColor);
    console.log('Social Media Hover Color:', settings.socialMediaColors.iconHoverColor);
    
    console.log('\n🔄 Refresh browser to see changes!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testUpdate();
