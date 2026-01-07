require('dotenv').config();
const mongoose = require('mongoose');
const Testimonial = require('./models/testimonialModel');
const connectDB = require('./config/db');

const checkTestimonials = async () => {
  try {
    await connectDB();
    
    const testimonials = await Testimonial.find();
    
    console.log('\n=== ALL TESTIMONIALS ===\n');
    testimonials.forEach(t => {
      console.log(`Name: ${t.name}`);
      console.log(`Service: "${t.service || 'NOT SET'}"`);
      console.log(`Active: ${t.isActive}`);
      console.log('---');
    });
    
    console.log(`\nTotal: ${testimonials.length} testimonials`);
    
    const webTestimonials = testimonials.filter(t => 
      t.isActive && t.service && (
        t.service.toLowerCase().includes('web') || 
        t.service.toLowerCase().includes('website') ||
        t.service.toLowerCase().includes('development')
      )
    );
    
    console.log(`\nWeb Dev Testimonials: ${webTestimonials.length}`);
    webTestimonials.forEach(t => {
      console.log(`- ${t.name}: ${t.service}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkTestimonials();
