const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  createService, 
  deleteService, 
  getServices, 
  createBlog, 
  deleteBlog, // <--- Import this
  getBlogs 
} = require('../controllers/adminController');

// Service Routes
router.route('/services')
  .get(protect, getServices)
  .post(protect, createService);

router.route('/services/:id')
  .delete(protect, deleteService);

// Blog Routes
router.route('/blogs')
  .get(protect, getBlogs)
  .post(protect, createBlog);

// <--- ADD THIS SECTION FOR DELETE TO WORK
router.route('/blogs/:id')
  .delete(protect, deleteBlog); 

module.exports = router;



