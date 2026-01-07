require('dotenv').config();
const mongoose = require('mongoose');
const DigitalService = require('./models/DigitalService');
const connectDB = require('./config/db');

const digitalServices = [
  {
    title: 'Web Development',
    slug: 'web-development',
    icon: 'FaCode',
    price: '14999',
    timeline: '7-15 Days',
    description: 'Professional website development to establish your digital presence and grow your business online.',
    features: [
      'Business & Corporate Websites',
      'E-commerce Development',
      'Custom Web Applications',
      'Mobile Responsive Design',
      'SEO Optimized',
      'Admin Panel Integration',
      'Payment Gateway Setup',
      'Free 3 Months Support'
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
