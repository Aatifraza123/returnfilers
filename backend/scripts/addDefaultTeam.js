require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('../models/settingsModel');

const defaultTeam = [
  {
    name: 'Rajan Kumar',
    position: 'Founder & Managing Partner',
    qualification: 'Tax Consultant',
    about: 'Expert in taxation, GST compliance, and business advisory with a passion for helping businesses grow.',
  },
  {
    name: 'Priya Sharma',
    position: 'Senior Tax Consultant',
    qualification: 'Tax Specialist',
    about: 'Specializes in income tax planning, GST filing, and helping individuals maximize their tax savings.',
  },
  {
    name: 'Amit Verma',
    position: 'Audit & Compliance Head',
    qualification: 'Audit Expert',
    about: 'Focuses on statutory audits, internal controls, and ensuring complete regulatory compliance.',
  },
];

const addDefaultTeam = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    let settings = await Settings.findOne();
    
    if (!settings) {
      console.log('No settings found, creating new settings...');
      settings = new Settings({});
    }

    // Initialize about object if it doesn't exist
    if (!settings.about) {
      settings.about = {};
    }

    // Add default team members
    settings.about.team = defaultTeam;

    await settings.save();
    console.log('✅ Default team members added successfully!');
    console.log('Team members:', settings.about.team);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addDefaultTeam();
