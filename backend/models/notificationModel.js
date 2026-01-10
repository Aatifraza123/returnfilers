const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['booking', 'quote', 'consultation', 'contact', 'user', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedModel'
  },
  relatedModel: {
    type: String,
    enum: ['Booking', 'Quote', 'Consultation', 'Contact', 'User']
  },
  recipient: {
    type: String,
    enum: ['admin', 'user'],
    default: 'admin'
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  link: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for faster queries
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

// Compound index to prevent duplicate notifications for the same entity
// This ensures one notification per (type, relatedId, recipient, recipientId) combination
notificationSchema.index(
  { type: 1, relatedId: 1, recipient: 1, recipientId: 1 },
  { 
    unique: true,
    partialFilterExpression: { relatedId: { $exists: true } },
    name: 'unique_notification_per_entity'
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
