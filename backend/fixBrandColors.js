require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/settingsModel');

const fixColors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected\n');
    
    const settings = await Settings.findOne();
    
    console.log('📋 Current Brand Colors:');
    console.log('Primary:', settings.brandColors.primary);
    console.log('Secondary:', settings.brandColors.secondary);
    console.log('Accent:', settings.brandColors.accent);
    
    // Fix to proper ReturnFilers colors
    settings.brandColors = {
      primary: '#0B1530',   // Dark Blue
      secondary: '#C9A227', // Gold
      accent: '#1a2b5c'     // Medium Blue
    };
    
    await settings.save();
    
    console.log('\n✅ Fixed Brand Colors:');
    console.log('Primary:', settings.brandColors.primary, '(Dark Blue)');
    console.log('Secondary:', settings.brandColors.secondary, '(Gold)');
    console.log('Accent:', settings.brandColors.accent, '(Medium Blue)');
    
    console.log('\n🔄 Hard refresh browser (Ctrl + Shift + R) to see proper colors!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixColors();
