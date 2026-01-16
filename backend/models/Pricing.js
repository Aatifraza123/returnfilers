const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['tax', 'gst', 'company', 'advisory'],
  },
  categoryTitle: {
    type: String,
    required: true,
  },
  categoryIcon: {
    type: String,
    default: 'FaRupeeSign',
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  popular: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: true,
  },
  features: [{
    type: String,
  }],
  notIncluded: [{
    type: String,
  }],
  billingCycle: {
    type: String,
    enum: ['one-time', 'monthly', 'yearly'],
    default: 'one-time',
  },
  active: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Pricing', pricingSchema);
