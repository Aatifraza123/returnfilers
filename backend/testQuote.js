require('dotenv').config();
const mongoose = require('mongoose');
const Quote = require('./models/quoteModel');
const connectDB = require('./config/db');

const testQuote = async () => {
  try {
    await connectDB();
    
    // Create test quote with web development service
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '9876543210',
      company: 'Test Company',
      service: 'web-ecommerce',
      budget: '10k-50k',
      message: 'Need an e-commerce website for my business'
    };
    
    const quote = await Quote.create(testData);
    
    console.log('\n✅ Test Quote Created:');
    console.log('ID:', quote._id);
    console.log('Name:', quote.name);
    console.log('Service:', quote.service);
    console.log('Budget:', quote.budget);
    console.log('Status:', quote.status);
    console.log('Created:', quote.createdAt);
    
    // Fetch all quotes
    const all = await Quote.find().sort({ createdAt: -1 }).limit(5);
    
    console.log('\n📋 Recent Quotes:');
    all.forEach((q, idx) => {
      console.log(`${idx + 1}. ${q.name} - ${q.service} (${q.status})`);
    });
    
    console.log(`\nTotal: ${all.length} quotes\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

testQuote();
