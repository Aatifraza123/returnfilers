const mongoose = require('mongoose');

const leadActivitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['page_visit', 'form_submit', 'email_open', 'email_click', 'appointment_book', 'quote_request'],
    required: true
  },
  description: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Map,
    of: String
  }
}, { _id: false });

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  },
  phone: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    enum: ['contact_form', 'quote_request', 'booking', 'appointment', 'newsletter', 'chatbot', 'manual'],
    default: 'contact_form'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'],
    default: 'new'
  },
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  interestedServices: [{
    type: String
  }],
  budget: {
    type: String,
    enum: ['under-10k', '10k-50k', '50k-1lakh', '1lakh-5lakh', 'above-5lakh', 'not-specified'],
    default: 'not-specified'
  },
  activities: [leadActivitySchema],
  lastContactDate: Date,
  nextFollowUpDate: Date,
  followUpCount: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  convertedToCustomer: {
    type: Boolean,
    default: false
  },
  conversionDate: Date,
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Indexes
leadSchema.index({ email: 1 });
leadSchema.index({ score: -1 });
leadSchema.index({ priority: 1, status: 1 });
leadSchema.index({ nextFollowUpDate: 1 });

// Calculate lead score based on activities
leadSchema.methods.calculateScore = function() {
  let score = 0;
  
  // Base score from source
  const sourceScores = {
    'appointment': 30,
    'quote_request': 25,
    'booking': 25,
    'contact_form': 15,
    'chatbot': 10,
    'newsletter': 5,
    'manual': 0
  };
  score += sourceScores[this.source] || 0;
  
  // Activity-based scoring
  const activityScores = {
    'appointment_book': 20,
    'quote_request': 15,
    'form_submit': 10,
    'email_click': 5,
    'email_open': 3,
    'page_visit': 1
  };
  
  this.activities.forEach(activity => {
    score += activityScores[activity.type] || 0;
  });
  
  // Budget score
  const budgetScores = {
    'above-5lakh': 20,
    '1lakh-5lakh': 15,
    '50k-1lakh': 10,
    '10k-50k': 5,
    'under-10k': 2,
    'not-specified': 0
  };
  score += budgetScores[this.budget] || 0;
  
  // Recency bonus (contacted in last 7 days)
  if (this.lastContactDate) {
    const daysSinceContact = (Date.now() - this.lastContactDate) / (1000 * 60 * 60 * 24);
    if (daysSinceContact <= 7) {
      score += 10;
    }
  }
  
  // Multiple services interest
  if (this.interestedServices.length > 1) {
    score += this.interestedServices.length * 3;
  }
  
  // Cap at 100
  this.score = Math.min(score, 100);
  
  // Auto-assign priority based on score
  if (this.score >= 70) {
    this.priority = 'urgent';
  } else if (this.score >= 50) {
    this.priority = 'high';
  } else if (this.score >= 30) {
    this.priority = 'medium';
  } else {
    this.priority = 'low';
  }
  
  return this.score;
};

// Add activity
leadSchema.methods.addActivity = function(type, description, metadata = {}) {
  this.activities.push({
    type,
    description,
    timestamp: new Date(),
    metadata
  });
  this.calculateScore();
};

module.exports = mongoose.model('Lead', leadSchema);
