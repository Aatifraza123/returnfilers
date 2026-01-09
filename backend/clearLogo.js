require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/settingsModel');

const clearLogo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected\n');
    
    const settings = await Settings.findOne();
    
    console.log('📋 Before:');
    console.log('Logo:', settings.logo || '(empty)');
    console.log('Logo Text:', settings.logoText);
    
    // Clear logo to show badge
    settings.logo = '';
    settings.logoText = 'RF';
    await settings.save();
    
    console.log('\n✅ After:');
    console.log('Logo:', settings.logo || '(empty)');
    console.log('Logo Text:', settings.logoText);
    console.log('\n📝 Now RF badge should show in header/footer');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

clearLogo();
