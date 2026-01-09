require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/settingsModel');

const resetColors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected\n');
    
    const settings = await Settings.findOne();
    
    // Reset to normal gold and white colors
    settings.logo = ''; // Clear logo to show RF badge
    settings.socialMediaColors = {
      iconColor: '#C9A227', // Gold
      iconHoverColor: '#FFFFFF' // White
    };
    
    await settings.save();
    
    console.log('✅ Colors reset to normal:');
    console.log('Logo:', settings.logo || '(empty - RF badge will show)');
    console.log('Social Media Icon Color:', settings.socialMediaColors.iconColor, '(Gold)');
    console.log('Social Media Hover Color:', settings.socialMediaColors.iconHoverColor, '(White)');
    
    console.log('\n🔄 Refresh browser to see normal colors!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetColors();
