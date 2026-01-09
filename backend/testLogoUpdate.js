require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/settingsModel');

const testLogoUpdate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected\n');
    
    // Get current settings
    let settings = await Settings.findOne();
    
    console.log('📋 Current Settings:');
    console.log('Logo:', settings.logo || '(empty)');
    console.log('Logo Text:', settings.logoText);
    
    // Update logo
    const testLogoUrl = 'https://via.placeholder.com/150/C9A227/FFFFFF?text=RF';
    settings.logo = testLogoUrl;
    settings.logoText = 'RF';
    
    await settings.save();
    
    console.log('\n✅ Updated Settings:');
    console.log('Logo:', settings.logo);
    console.log('Logo Text:', settings.logoText);
    
    // Verify
    const verified = await Settings.findOne();
    console.log('\n🔍 Verified from DB:');
    console.log('Logo:', verified.logo);
    console.log('Logo Text:', verified.logoText);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testLogoUpdate();
