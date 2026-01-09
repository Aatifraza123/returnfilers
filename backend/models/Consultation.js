const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional because some consultations might be from non-logged-in users
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v.replace(/\D/g, ''));
      },
      message: 'Please provide a valid phone number'
    }
  },
  service: {
    type: String,
    required: [true, 'Service is required for consultation'],
    trim: true
  },
  message: {
    type: String,
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'closed', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true,
  collection: 'consultations'
});

// Index for faster queries
consultationSchema.index({ email: 1 });
consultationSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Consultation', consultationSchema);












