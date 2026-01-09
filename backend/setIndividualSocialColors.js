require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/settingsModel');

const setColors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected\n');
    
    const settings = await Settings.findOne();
    
    // Set individual colors for each platform
    settings.socialMediaColors = {
      facebook: { 
        color: '#1877F2', // Facebook Blue
        hoverColor: '#FFFFFF'
      },
      instagram: { 
        color: '#E4405F', // Instagram Pink
        hoverColor: '#FFFFFF'
      },
      linkedin: { 
        color: '#0A66C2', // LinkedIn Blue
        hoverColor: '#FFFFFF'
      },
      twitter: { 
        color: '#1DA1F2', // Twitter Blue
        hoverColor: '#FFFFFF'
      },
      youtube: { 
        color: '#FF0000', // YouTube Red
        hoverColor: '#FFFFFF'
      },
      whatsapp: { 
        color: '#25D366', // WhatsApp Green
        hoverColor: '#FFFFFF'
      }
    };
    
    await settings.save();
    
    console.log('✅ Individual Social Media Colors Set:');
    console.log('Facebook:', settings.socialMediaColors.facebook.color);
    console.log('Instagram:', settings.socialMediaColors.instagram.color);
    console.log('LinkedIn:', settings.socialMediaColors.linkedin.color);
    console.log('Twitter:', settings.socialMediaColors.twitter.color);
    console.log('YouTube:', settings.socialMediaColors.youtube.color);
    console.log('WhatsApp:', settings.socialMediaColors.whatsapp.color);
    
    console.log('\n🔄 Refresh browser to see individual colors!');
    console.log('📍 Home page: http://localhost:5174/');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

setColors();
