require('dotenv').config();
const mongoose = require('mongoose');
const DigitalService = require('./models/DigitalService');
const connectDB = require('./config/db');

const testDigitalServices = async () => {
  try {
    await connectDB();
    
    const services = await DigitalService.find();
    
    console.log('\n=== Digital Services in Database ===\n');
    
    services.forEach(service => {
      console.log(`📦 ${service.title}`);
      console.log(`   Slug: ${service.slug}`);
      console.log(`   Price: ₹${service.price}`);
      console.log(`   Timeline: ${service.timeline}`);
      console.log(`   Active: ${service.active}`);
      console.log(`   Features: ${service.features.length} items`);
      
      if (service.packages && service.packages.length > 0) {
        console.log(`   Packages: ${service.packages.length} types`);
        service.packages.forEach((pkg, idx) => {
          console.log(`      ${idx + 1}. ${pkg.name} - ₹${pkg.price} (${pkg.timeline})`);
          console.log(`         Features: ${pkg.features.length} items`);
        });
      } else {
        console.log(`   Packages: None`);
      }
      console.log('');
    });
    
    console.log(`Total Services: ${services.length}\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

testDigitalServices();
