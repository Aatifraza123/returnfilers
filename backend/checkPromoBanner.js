require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/settingsModel');

const checkPromoBanner = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const settings = await Settings.findOne();
    
    if (!settings) {
      console.log('❌ No settings found');
      process.exit(1);
    }

    console.log('\n📊 Current Promotional Settings:');
    console.log('================================');
    console.log('Banner Enabled:', settings.promotional?.bannerEnabled);
    console.log('Banner Text:', settings.promotional?.bannerText);
    console.log('Banner Link:', settings.promotional?.bannerLink);
    console.log('Discount Text:', settings.promotional?.discountText);
    console.log('================================\n');

    if (!settings.promotional?.bannerEnabled) {
      console.log('⚠️  Banner is DISABLED in database!');
    } else {
      console.log('✅ Banner is ENABLED in database!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkPromoBanner();
