require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/settingsModel');

const setRFLogo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected\n');
    
    const settings = await Settings.findOne();
    
    // Set RF logo
    settings.logo = 'https://static.vecteezy.com/system/resources/previews/025/255/409/non_2x/creative-rf-logo-abstract-icon-unique-design-icon-vector.jpg';
    settings.logoText = 'RF';
    
    await settings.save();
    
    console.log('✅ RF Logo Updated:');
    console.log('Logo:', settings.logo);
    console.log('Logo Text:', settings.logoText);
    
    console.log('\n🔄 Refresh browser to see RF logo!');
    console.log('📍 Home page: http://localhost:5174/');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

setRFLogo();
