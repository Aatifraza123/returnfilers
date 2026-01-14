const mongoose = require('mongoose');
const DigitalService = require('../models/DigitalService');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const digitalServices = [
  {
    title: 'Basic Website',
    slug: 'basic-website',
    icon: 'FaLaptopCode',
    price: '9,999',
    timeline: '7-10 working days',
    description: 'Perfect starter website for small businesses and personal brands. Get online quickly with a professional, mobile-friendly website.',
    features: [
      '5 Pages (Home, About, Services, Contact, etc.)',
      'Responsive Design',
      'Contact Form',
      'Basic SEO Setup',
      'Social Media Links',
      'Mobile Optimized',
      '1 Month Free Support',
      'Fast Loading Speed'
    ],
    packages: [],
    active: true
  },
  {
    title: 'Business Website',
    slug: 'business-website',
    icon: 'FaBriefcase',
    price: '14,999',
    timeline: '10-15 working days',
    description: 'Complete business website with advanced features, blog section, and content management system. Perfect for growing businesses.',
    features: [
      '10 Pages',
      'Custom Design',
      'Advanced Contact Forms',
      'Blog Section',
      'Image Gallery',
      'Google Maps Integration',
      'Advanced SEO',
      'Admin Panel for Content Management',
      'Email Integration',
      '3 Months Free Support',
      'Performance Optimization'
    ],
    packages: [],
    active: true
  },
  {
    title: 'E-commerce Website',
    slug: 'ecommerce-website',
    icon: 'FaShoppingCart',
    price: '24,999',
    timeline: '15-20 working days',
    description: 'Full-featured online store with payment gateway, inventory management, and order tracking. Start selling online today!',
    features: [
      'Unlimited Products',
      'Shopping Cart',
      'Payment Gateway Integration',
      'Order Management System',
      'Customer Accounts',
      'Product Search & Filters',
      'Inventory Management',
      'Email Notifications',
      'Invoice Generation',
      'Shipping Integration',
      'Admin Dashboard',
      '6 Months Free Support',
      'SSL Certificate Setup'
    ],
    packages: [],
    active: true
  }
];

const addDigitalServices = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing digital services
    await DigitalService.deleteMany({});
    console.log('🗑️  Cleared existing digital services');

    // Add new services
    const result = await DigitalService.insertMany(digitalServices);
    console.log(`✅ Added ${result.length} digital services successfully!\n`);
    
    result.forEach(service => {
      console.log(`   📦 ${service.title} - ₹${service.price} (${service.timeline})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

addDigitalServices();
