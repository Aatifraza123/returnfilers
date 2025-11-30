const express = require('express');
const router = express.Router();

// Import controller functions with error handling
let getBlogs, getBlogById, createBlog, updateBlog, deleteBlog;
try {
  const blogController = require('../controllers/blogController');
  getBlogs = blogController.getBlogs;
  getBlogById = blogController.getBlogById;
  createBlog = blogController.createBlog;
  updateBlog = blogController.updateBlog;
  deleteBlog = blogController.deleteBlog;
  console.log('✓ Blog controller functions loaded');
} catch (error) {
  console.error('✗ Error loading blog controller:', error);
}

const { protect, admin } = require('../middleware/authMiddleware'); 

// Public Routes (GET requests - no auth needed)
// IMPORTANT: Order matters - specific routes before parameterized routes
router.get('/', (req, res, next) => {
  console.log('GET /api/blogs - Route hit');
  if (!getBlogs) {
    return res.status(500).json({ message: 'Blog controller not loaded' });
  }
  getBlogs(req, res, next);
});

// Test route to verify router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Blog routes are working!', timestamp: new Date().toISOString() });
});

// Get blog by ID - MUST be after /test route
router.get('/:id', (req, res, next) => {
  console.log('GET /api/blogs/:id - Route hit');
  console.log('Blog ID from params:', req.params.id);
  if (!getBlogById) {
    return res.status(500).json({ message: 'Blog controller not loaded' });
  }
  getBlogById(req, res, next);
});

// Admin Routes (Protected - require authentication)
// Note: These routes must be defined after the GET routes to avoid conflicts
router.post('/', protect, admin, createBlog);
router.put('/:id', protect, admin, updateBlog);
router.delete('/:id', protect, admin, deleteBlog);

module.exports = router;
