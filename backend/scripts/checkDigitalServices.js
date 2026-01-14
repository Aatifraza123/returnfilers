const mongoose = require('mongoose');
const DigitalService = require('../models/DigitalService');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const checkServices = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const services = await DigitalService.find();
    
    console.log(`📊 Total Digital Services: ${services.length}\n`);
    
    services.forEach(service => {
      console.log(`📦 ${service.title}`);
      console.log(`   ID: ${service._id}`);
      console.log(`   Slug: ${service.slug}`);
      console.log(`   Active: ${service.active}`);
      console.log(`   Packages: ${service.packages.length}`);
      service.packages.forEach(pkg => {
        console.log(`      - ${pkg.name} (₹${pkg.price})`);
      });
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkServices();
