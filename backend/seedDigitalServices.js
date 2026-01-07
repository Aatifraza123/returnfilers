require('dotenv').config();
const mongoose = require('mongoose');
const DigitalService = require('./models/DigitalService');
const connectDB = require('./config/db');

const digitalServices = [
  {
    title: 'Web Development',
    slug: 'web-development',
    icon: 'FaCode',
    price: '9999',
    timeline: '5-20 Days',
    description: 'Professional website development to establish your digital presence and grow your business online.',
    features: [
      'Mobile Responsive Design',
      'SEO Optimized',
      'Fast Loading Speed',
      'Professional Design',
      'Free Support'
    ],
    packages: [
      {
        name: 'Basic Website',
        price: '9999',
        timeline: '5-7 Days',
        features: [
          'Up to 5 Pages',
          'Mobile Responsive',
          'Contact Form',
          'Basic SEO',
          'Social Media Links',
          '1 Month Free Support'
        ]
      },
      {
        name: 'Business Website',
        price: '14999',
        timeline: '7-10 Days',
        features: [
          'Up to 10 Pages',
          'Mobile Responsive',
          'Contact & Inquiry Forms',
          'Advanced SEO',
          'Blog Section',
          'Google Maps Integration',
          'WhatsApp Integration',
          '3 Months Free Support'
        ]
      },
      {
        name: 'E-commerce Website',
        price: '24999',
        timeline: '15-20 Days',
        features: [
          'Unlimited Products',
          'Shopping Cart',
          'Payment Gateway Integration',
          'Order Management',
          'Customer Accounts',
          'Product Search & Filter',
          'Admin Dashboard',
          'Mobile Responsive',
          '6 Months Free Support'
        ]
      },
      {
        name: 'Custom Web Application',
        price: '39999',
        timeline: '20-30 Days',
        features: [
          'Custom Features',
          'Database Integration',
          'User Authentication',
          'Admin Panel',
          'API Integration',
          'Advanced Functionality',
          'Mobile Responsive',
          '1 Year Free Support'
        ]
      }
    ],
    active: true
  },
  {
    title: 'Data Analysis',
    slug: 'data-analysis',
    icon: 'FaChartBar',
    price: '9999',
    timeline: '5-10 Days',
    description: 'Transform your business data into actionable insights with our professional data analysis services.',
    features: [
      'Business Data Analysis',
      'Financial Reports & Dashboards',
      'Sales & Revenue Analytics',
      'Customer Behavior Analysis',
      'Market Research Reports',
      'Excel & Power BI Dashboards',
      'Data Visualization',
      'Monthly Reports Setup'
    ],
    packages: [],
    active: true
  }
];

const seedDigitalServices = async () => {
  try {
    await connectDB();
    
    // Clear existing digital services
    await DigitalService.deleteMany({});
    console.log('Cleared existing digital services');
    
    // Insert new services
    await DigitalService.insertMany(digitalServices);
    console.log('Digital services seeded successfully!');
    
    console.log('\nSeeded Services:');
    digitalServices.forEach(service => {
      console.log(`- ${service.title}: ₹${service.price} (${service.timeline})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding digital services:', error.message);
    process.exit(1);
  }
};

seedDigitalServices();
