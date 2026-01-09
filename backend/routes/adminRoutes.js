const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/adminAuthMiddleware');
const { 
  createService, 
  deleteService, 
  getServices, 
  createBlog, 
  deleteBlog,
  getBlogs 
} = require('../controllers/adminController');

// Service Routes
router.route('/services')
  .get(protectAdmin, getServices)
  .post(protectAdmin, createService);

router.route('/services/:id')
  .delete(protectAdmin, deleteService);

// Blog Routes
router.route('/blogs')
  .get(protectAdmin, getBlogs)
  .post(protectAdmin, createBlog);

router.route('/blogs/:id')
  .delete(protectAdmin, deleteBlog); 

module.exports = router;



