require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/settingsModel');

const enablePromoBanner = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const settings = await Settings.findOne();
    
    if (!settings) {
      console.log('❌ No settings found');
      process.exit(1);
    }

    // Enable promotional banner with sample text
    settings.promotional = {
      bannerEnabled: true,
      bannerText: '🎉 Special Offer: Get 20% off on all Tax Filing Services! Limited Time Only',
      bannerLink: '/quote',
      discountText: 'Limited Time Offer - 20% OFF'
    };

    await settings.save();

    console.log('✅ Promotional banner enabled successfully!');
    console.log('📢 Banner Text:', settings.promotional.bannerText);
    console.log('🔗 Banner Link:', settings.promotional.bannerLink);
    console.log('💰 Discount Text:', settings.promotional.discountText);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

enablePromoBanner();
