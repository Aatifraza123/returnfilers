const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Please add a service title'] 
  },
  description: { 
    type: String, 
    required: [true, 'Please add a description'] 
  },
  price: { 
    type: String, 
    required: [true, 'Please add a price'], 
    default: 'Contact for Price' 
  },
  category: {
    type: String,
    required: [true, 'Please select a category'], 
    default: 'Tax'
  },
  timeline: {
    type: String,
    default: '3-7 Working Days'
  },
  features: {
    type: [String],
    default: []
  },
  // ✅ NEW IMAGE FIELD
  image: { 
    type: String, 
    default: '' // Stores URL string
  },
  icon: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);




