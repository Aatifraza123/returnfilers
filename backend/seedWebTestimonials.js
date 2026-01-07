require('dotenv').config();
const mongoose = require('mongoose');
const Testimonial = require('./models/testimonialModel');
const connectDB = require('./config/db');

const webTestimonials = [
  {
    name: 'Rajesh Kumar',
    title: 'CEO, TechStart Solutions',
    service: 'Web Development',
    quote: 'ReturnFilers created an amazing website for our startup. The design is modern, fast, and exactly what we needed. Their team was professional and delivered on time!',
    rating: 5,
    isActive: true
  },
  {
    name: 'Priya Sharma',
    title: 'Owner, Fashion Boutique',
    service: 'E-commerce Website',
    quote: 'Our e-commerce website has transformed our business. We now get orders from all over India. The admin panel is so easy to use. Highly recommended!',
    rating: 5,
    isActive: true
  },
  {
    name: 'Amit Patel',
    title: 'Director, Real Estate Ventures',
    service: 'Business Website',
    quote: 'Professional service from start to finish. They understood our requirements perfectly and delivered a beautiful website that showcases our properties excellently.',
    rating: 5,
    isActive: true
  },
  {
    name: 'Sneha Reddy',
    title: 'Founder, Digital Marketing Agency',
    service: 'Custom Web Application',
    quote: 'We needed a custom CRM system and ReturnFilers delivered beyond expectations. The application is robust, user-friendly, and has improved our workflow significantly.',
    rating: 5,
    isActive: true
  }
];

const seedWebTestimonials = async () => {
  try {
    await connectDB();
    
    console.log('Adding web development testimonials...');
    
    // Add new testimonials
    for (const testimonial of webTestimonials) {
      await Testimonial.create(testimonial);
      console.log(`✓ Added: ${testimonial.name} - ${testimonial.service}`);
    }
    
    console.log('\n✅ Web development testimonials seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding testimonials:', error.message);
    process.exit(1);
  }
};

seedWebTestimonials();
