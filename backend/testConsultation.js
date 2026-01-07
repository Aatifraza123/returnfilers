require('dotenv').config();
const mongoose = require('mongoose');
const Consultation = require('./models/Consultation');
const connectDB = require('./config/db');

const testConsultation = async () => {
  try {
    await connectDB();
    
    // Create test consultation with web development service
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '9876543210',
      service: 'Web Development - Business Website',
      message: 'Test consultation for web development'
    };
    
    const consultation = await Consultation.create(testData);
    
    console.log('\n✅ Test Consultation Created:');
    console.log('ID:', consultation._id);
    console.log('Name:', consultation.name);
    console.log('Service:', consultation.service);
    console.log('Status:', consultation.status);
    console.log('Created:', consultation.createdAt);
    
    // Fetch all consultations
    const all = await Consultation.find().sort({ createdAt: -1 }).limit(5);
    
    console.log('\n📋 Recent Consultations:');
    all.forEach((c, idx) => {
      console.log(`${idx + 1}. ${c.name} - ${c.service} (${c.status})`);
    });
    
    console.log(`\nTotal: ${all.length} consultations\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

testConsultation();
