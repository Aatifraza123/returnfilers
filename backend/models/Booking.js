const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: { type: String },
  type: { type: String },
  size: { type: Number },
  data: { type: String }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional because some bookings might be from non-logged-in users
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  service: {
    type: String,
    required: [true, 'Service is required'],
    trim: true
  },
  message: {
    type: String,
    trim: true,
    default: ''
  },
  documents: [documentSchema],
  status: {
    type: String,
    enum: ['pending', 'contacted', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

bookingSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
