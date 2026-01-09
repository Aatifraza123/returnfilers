require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/settingsModel');

const checkSettings = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
    
    const settings = await Settings.findOne();
    
    if (settings) {
      console.log('\n✅ Settings found in database:');
      console.log('Company Name:', settings.companyName);
      console.log('Logo URL:', settings.logo);
      console.log('Logo Text:', settings.logoText);
      console.log('\nFull settings object:');
      console.log(JSON.stringify(settings, null, 2));
    } else {
      console.log('❌ No settings found in database');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkSettings();
