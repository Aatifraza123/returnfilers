const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
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
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required']
  },
  duration: {
    type: Number,
    default: 30, // minutes
    enum: [15, 30, 45, 60]
  },
  meetingType: {
    type: String,
    enum: ['in-person', 'online', 'phone'],
    default: 'online'
  },
  meetingLink: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
    default: 'pending'
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  adminNotes: {
    type: String,
    default: ''
  },
  cancelReason: {
    type: String,
    default: ''
  },
  bookedBy: {
    type: String,
    enum: ['customer', 'admin', 'ai-chatbot'],
    default: 'customer'
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
appointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 });
appointmentSchema.index({ email: 1, status: 1 });
appointmentSchema.index({ status: 1, createdAt: -1 });

// Virtual for full datetime
appointmentSchema.virtual('fullDateTime').get(function() {
  const date = new Date(this.appointmentDate);
  const [hours, minutes] = this.appointmentTime.split(':');
  date.setHours(parseInt(hours), parseInt(minutes));
  return date;
});

module.exports = mongoose.model('Appointment', appointmentSchema);
