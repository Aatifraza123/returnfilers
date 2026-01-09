require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/settingsModel');

const testPromoBannerUpdate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    let settings = await Settings.findOne();
    
    if (!settings) {
      console.log('❌ No settings found');
      process.exit(1);
    }

    console.log('\n📊 BEFORE Update:');
    console.log('Banner Enabled:', settings.promotional?.bannerEnabled);
    console.log('Banner Text:', settings.promotional?.bannerText);

    // Update promotional settings
    settings.promotional = {
      bannerEnabled: true,
      bannerText: '🎉 Special Offer: Get 20% off on all Tax Filing Services! Limited Time Only',
      bannerLink: '/quote',
      discountText: 'Limited Time Offer - 20% OFF'
    };

    await settings.save();
    console.log('\n✅ Settings saved!');

    // Fetch again to verify
    settings = await Settings.findOne();
    console.log('\n📊 AFTER Update:');
    console.log('Banner Enabled:', settings.promotional?.bannerEnabled);
    console.log('Banner Text:', settings.promotional?.bannerText);
    console.log('Banner Link:', settings.promotional?.bannerLink);
    console.log('Discount Text:', settings.promotional?.discountText);

    if (settings.promotional?.bannerEnabled) {
      console.log('\n✅ SUCCESS: Banner is now enabled in database!');
    } else {
      console.log('\n❌ FAILED: Banner is still disabled!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testPromoBannerUpdate();
