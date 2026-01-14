const Service = require('../models/serviceModel');
const Blog = require('../models/blogModel');

// -------------------------
// SERVICE CONTROLLERS
// -------------------------

// @desc    Create a new Service
// @route   POST /api/admin/services
exports.createService = async (req, res) => {
  try {
    const { title, description, icon, price, category, features, image, faqs } = req.body;
    
    const service = await Service.create({
      title,
      description,
      icon,
      price,
      category,
      features: Array.isArray(features) ? features : (features ? features.split(',').map(f => f.trim()) : []),
      image,
      faqs: faqs || []
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get All Services
// @route   GET /api/admin/services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({});
    res.json({ services }); // Wrap in object to match frontend expectation (data.services)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a Service
// @route   DELETE /api/admin/services/:id
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service) {
      await service.deleteOne();
      res.json({ message: 'Service removed' });
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------
// BLOG CONTROLLERS
// -------------------------

// @desc    Create a new Blog
// @route   POST /api/admin/blogs
exports.createBlog = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and Content are required' });
    }

    const blog = await Blog.create({
      title,
      content,
      image,
      // Safety check: prevent crash if req.user is missing
      author: req.user ? req.user.name : 'Admin' 
    });

    res.status(201).json(blog);
  } catch (error) {
    console.error("Blog Create Error:", error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get All Blogs
// @route   GET /api/admin/blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    // If your frontend expects array directly, return blogs. 
    // If it expects { blogs: [] }, return { blogs }.
    // Based on your previous AdminBlogs.jsx, you used data (array check), so sending array is safer.
    res.json(blogs); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a Blog
// @route   DELETE /api/admin/blogs/:id
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      await blog.deleteOne();
      res.json({ message: 'Blog removed' });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



