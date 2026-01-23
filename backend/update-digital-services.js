const mongoose = require('mongoose');
const DigitalService = require('./models/DigitalService');
require('dotenv').config();

const updateDigitalServices = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔗 Connected to MongoDB');

    // Current website pricing data
    const servicesData = [
      {
        slug: 'basic-website',
        title: 'Basic Website',
        price: '9,999',
        timeline: '7-10 working days',
        description: 'Perfect starter website for small businesses and personal brands. Get online quickly with a professional, mobile-friendly website.',
        features: [
          '5 Pages (Home, About, Services, Contact, etc.)',
          'Mobile Responsive Design',
          'Contact Form',
          'Social Media Integration',
          'Basic SEO Setup',
          'Free SSL Certificate',
          '1 Month Free Support'
        ],
        active: true
      },
      {
        slug: 'business-website',
        title: 'Business Website',
        price: '24,999',
        timeline: '10-15 working days',
        description: 'Professional business website with advanced features and custom design to establish your brand online.',
        features: [
          '10 Pages',
          'Custom Design',
          'Advanced Contact Forms',
          'Blog Section',
          'Image Gallery',
          'Google Maps Integration',
          'Advanced SEO',
          'Analytics Setup',
          'Social Media Integration',
          'Newsletter Signup',
          '3 Months Free Support'
        ],
        active: true
      },
      {
        slug: 'ecommerce-website',
        title: 'E-commerce Website',
        price: '29,999',
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
          'Order Tracking',
          'Email Notifications',
          'Mobile Responsive',
          'SSL Certificate',
          'SEO Optimized',
          '6 Months Free Support'
        ],
        active: true
      }
    ];

    // Update each service
    for (const serviceData of servicesData) {
      const result = await DigitalService.findOneAndUpdate(
        { slug: serviceData.slug },
        serviceData,
        { 
          upsert: true, // Create if doesn't exist
          new: true,
          runValidators: true
        }
      );
      console.log(`✅ Updated ${serviceData.title}: ₹${serviceData.price} (${serviceData.timeline})`);
    }

    console.log('\n🎉 All digital services updated successfully!');
    console.log('\n📊 Current Pricing:');
    console.log('- Basic Website: ₹9,999 (7-10 working days)');
    console.log('- Business Website: ₹24,999 (10-15 working days)');
    console.log('- E-commerce Website: ₹29,999 (15-20 working days)');

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error updating digital services:', error);
    process.exit(1);
  }
};

updateDigitalServices();