const Testimonial = require('../models/testimonialModel');

// @desc    Get all testimonials (public - only active)
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all testimonials (admin - all)
// @route   GET /api/admin/testimonials
// @access  Private/Admin
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    console.error('Get all testimonials error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create testimonial
// @route   POST /api/admin/testimonials
// @access  Private/Admin
const createTestimonial = async (req, res) => {
  try {
    const { name, title, quote, rating, image, isActive } = req.body;

    if (!name || !title || !quote) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, title, and quote'
      });
    }

    const testimonial = await Testimonial.create({
      name: name.trim(),
      title: title.trim(),
      quote: quote.trim(),
      rating: rating || 5,
      image: image || '',
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: testimonial
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update testimonial
// @route   PUT /api/admin/testimonials/:id
// @access  Private/Admin
const updateTestimonial = async (req, res) => {
  try {
    const { name, title, quote, rating, image, isActive } = req.body;

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      {
        name: name?.trim(),
        title: title?.trim(),
        quote: quote?.trim(),
        rating,
        image,
        isActive
      },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/admin/testimonials/:id
// @access  Private/Admin
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle testimonial active status
// @route   PATCH /api/admin/testimonials/:id/toggle
// @access  Private/Admin
const toggleTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    testimonial.isActive = !testimonial.isActive;
    await testimonial.save();

    res.json({
      success: true,
      message: `Testimonial ${testimonial.isActive ? 'activated' : 'deactivated'} successfully`,
      data: testimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getTestimonials,
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonial
};
