const mongoose = require('mongoose');

const digitalServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  icon: {
    type: String,
    default: 'FaCode'
  },
  price: {
    type: String,
    required: true
  },
  timeline: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  // New field for service types/packages
  packages: [{
    name: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    },
    features: [{
      type: String
    }],
    timeline: {
      type: String
    }
  }],
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DigitalService', digitalServiceSchema);
