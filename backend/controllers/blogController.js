const Blog = require('../models/blogModel');

// Helper: Slugify
const slugify = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

// @desc    Get all blogs
// @route   GET /api/blogs
const getBlogs = async (req, res) => {
  try {
    // ✅ Return simple array - get all blogs (no filter)
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    console.log(`=== getBlogs called ===`);
    console.log(`Found ${blogs.length} blogs`);
    // Log first few blog IDs for debugging
    if (blogs.length > 0) {
      console.log('Sample blog IDs:', blogs.slice(0, 5).map(b => ({
        id: b._id.toString(),
        title: b.title,
        createdAt: b.createdAt
      })));
    } else {
      console.log('⚠️ No blogs found in database');
    }
    res.json(blogs); 
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
const getBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    console.log('=== getBlogById called ===');
    console.log('Fetching blog with ID:', blogId);
    console.log('ID type:', typeof blogId);
    console.log('ID length:', blogId?.length);
    console.log('Request URL:', req.url);
    console.log('Request method:', req.method);
    console.log('Request params:', req.params);
    
    // Validate MongoDB ObjectId format (24 hex characters)
    if (!blogId || typeof blogId !== 'string') {
      console.log('Invalid blog ID - not a string:', blogId);
      return res.status(400).json({ message: 'Invalid blog ID format' });
    }

    // Check if it's a valid ObjectId format (24 hex characters)
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(blogId)) {
      console.log('Invalid blog ID format (not 24 hex chars):', blogId);
      // Try to find by slug as fallback
      const blogBySlug = await Blog.findOne({ slug: blogId });
      if (blogBySlug) {
        console.log('Blog found by slug:', blogBySlug.title);
        return res.json(blogBySlug);
      }
      return res.status(400).json({ message: 'Invalid blog ID format' });
    }

    // Try to find by ID using mongoose
    let blog = null;
    
    try {
      // Use mongoose.Types.ObjectId to ensure proper ObjectId conversion
      const mongoose = require('mongoose');
      if (mongoose.Types.ObjectId.isValid(blogId)) {
        blog = await Blog.findById(blogId);
      } else {
        console.log('Invalid ObjectId format:', blogId);
        return res.status(400).json({ message: 'Invalid blog ID format' });
      }
    } catch (findError) {
      console.error('Error in Blog.findById:', findError);
      return res.status(500).json({ message: 'Database error', error: findError.message });
    }
    
    if (blog) {
      console.log('✅ Blog found by ID:', blog.title);
      console.log('Blog ID:', blog._id);
      console.log('Blog created:', blog.createdAt);
      res.json(blog);
    } else {
      console.log('❌ Blog not found with ID:', blogId);
      
      // Double check - try to find any blog to verify database connection
      const totalBlogs = await Blog.countDocuments();
      console.log('Total blogs in database:', totalBlogs);
      
      // Get all blog IDs for debugging
      const allBlogIds = await Blog.find({}).select('_id title').limit(5);
      console.log('Sample blog IDs in database:', allBlogIds.map(b => ({ id: b._id.toString(), title: b.title })));
      
      // Try to find by slug as additional fallback
      const blogBySlug = await Blog.findOne({ slug: blogId });
      if (blogBySlug) {
        console.log('✅ Blog found by slug fallback:', blogBySlug.title);
        return res.json(blogBySlug);
      }
      
      res.status(404).json({ 
        message: 'Blog not found',
        blogId: blogId,
        totalBlogs: totalBlogs,
        sampleIds: allBlogIds.map(b => b._id.toString())
      });
    }
  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    // If it's a CastError (invalid ObjectId), return 400
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid blog ID format' });
    }
    res.status(500).json({ message: error.message || 'Invalid Blog ID' });
  }
};

// @desc    Create blog
// @route   POST /api/blogs
const createBlog = async (req, res) => {
  try {
    const { title, content, category, image, author, readTime } = req.body;

    // ✅ Generate Slug
    let slug = slugify(title);
    
    // Optional: Add random number if you want to ensure uniqueness
    // slug = slug + '-' + Math.floor(Math.random() * 1000);

    const blog = await Blog.create({ 
      title, 
      slug, 
      content, 
      category, 
      image, 
      author, 
      readTime 
    });

    res.status(201).json(blog);
  } catch (error) {
    console.error("Create Error:", error);
    // Handle Duplicate Key Error (E11000)
    if (error.code === 11000) {
        return res.status(400).json({ message: "A blog with this title already exists." });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
const updateBlog = async (req, res) => {
  try {
    console.log('Update blog request:', req.params.id, req.body);
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      console.log('Blog not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Update fields
    if (req.body.title) {
      blog.title = req.body.title;
      // Generate new slug if title changed
      const newSlug = slugify(req.body.title);
      // Check if slug already exists for another blog
      const existingBlog = await Blog.findOne({ slug: newSlug, _id: { $ne: blog._id } });
      if (existingBlog) {
        // If slug exists, add a random number to make it unique
        blog.slug = newSlug + '-' + Math.floor(Math.random() * 1000);
      } else {
        blog.slug = newSlug;
      }
    }
    
    if (req.body.content !== undefined) {
      blog.content = req.body.content;
    }
    if (req.body.category !== undefined) {
      blog.category = req.body.category;
    }
    if (req.body.image !== undefined) {
      blog.image = req.body.image;
    }
    if (req.body.author !== undefined) {
      blog.author = req.body.author;
    }
    
    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (error) {
    console.error('Blog update error:', error);
    // Handle duplicate key error (E11000)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A blog with this title already exists.' });
    }
    res.status(500).json({ message: error.message || 'Failed to update blog' });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
const deleteBlog = async (req, res) => {
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

module.exports = { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog };


