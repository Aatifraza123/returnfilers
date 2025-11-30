const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Please add a blog title'] 
  },
  // ✅ ADD THIS FIELD
  slug: {
    type: String,
    unique: true,
    sparse: true // Allows nulls if slug generation fails temporarily
  },
  content: { 
    type: String, 
    required: [true, 'Please add blog content'] 
  },
  author: {
    type: String,
    default: 'Admin'
  },
  category: {
    type: String,
    default: 'General'
  },
  image: { 
    type: String, 
    default: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80'
  },
  readTime: {
    type: String,
    default: '5 min read'
  }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);





