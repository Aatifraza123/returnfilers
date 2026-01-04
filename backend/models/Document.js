const mongoose = require('mongoose');

// Subdocument schema for uploaded files
const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },
  size: { type: Number },
  data: { type: String } // Base64 encoded
}, { _id: false });

const documentSchema = new mongoose.Schema({
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
  documents: [fileSchema],
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'completed', 'rejected'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  collection: 'document_submissions'
});

documentSchema.index({ status: 1, createdAt: -1 });
documentSchema.index({ email: 1 });

module.exports = mongoose.model('DocumentSubmission', documentSchema);
