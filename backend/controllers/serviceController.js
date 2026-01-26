const Service = require('../models/serviceModel');
const axios = require('axios');
const { uploadImage, deleteImage, extractPublicId } = require('../utils/cloudinary');

// Helper function to invalidate AI chatbot cache
const invalidateAIChatbotCache = async () => {
  try {
    await axios.post('http://localhost:5000/api/chat/invalidate-cache');
    console.log('🤖 AI Chatbot cache invalidated after service update');
  } catch (error) {
    console.log('⚠️ Failed to invalidate AI chatbot cache:', error.message);
  }
};

// @desc    Get all active services
// @route   GET /api/services
const getServices = async (req, res) => {
  try {
    const services = await Service.find({}).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Single Service by ID
// @route   GET /api/services/:id
const getServiceById = async (req, res) => {
  try {
    const serviceId = req.params.id;
    console.log('=== getServiceById called ===');
    console.log('Service ID:', serviceId);
    
    // Validate MongoDB ObjectId format
    if (!serviceId || serviceId.length !== 24) {
      console.log('Invalid service ID format:', serviceId);
      return res.status(400).json({ message: 'Invalid service ID format' });
    }

    const service = await Service.findById(serviceId);
    console.log('Service found:', service ? service.title : 'NOT FOUND');
    
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service not found', serviceId });
    }
  } catch (error) {
    console.error('Error in getServiceById:', error);
    res.status(500).json({ message: 'Invalid Service ID', error: error.message });
  }
};

// @desc    Create new service
// @route   POST /api/services
const createService = async (req, res) => {
  try {
    // ✅ Destructure image
    const { title, description, price, category, icon, features, image } = req.body;
    
    let imageUrl = '';
    let imagePublicId = '';
    
    // Upload image to Cloudinary if provided
    if (image && image.startsWith('data:image')) {
      try {
        console.log('📤 Uploading image to Cloudinary...');
        const uploadResult = await uploadImage(image, 'services');
        imageUrl = uploadResult.url;
        imagePublicId = uploadResult.publicId;
        console.log('✅ Image uploaded:', imageUrl);
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        return res.status(500).json({ message: 'Failed to upload image' });
      }
    } else if (image && image.includes('cloudinary.com')) {
      // If it's already a Cloudinary URL, use it as is
      imageUrl = image;
      imagePublicId = extractPublicId(image);
    }
    
    const service = await Service.create({
      title,
      description,
      price,
      category,
      icon,
      features,
      image: imageUrl,
      imagePublicId: imagePublicId
    });

    // Invalidate AI chatbot cache
    await invalidateAIChatbotCache();

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (service) {
      const oldImagePublicId = service.imagePublicId;
      
      // Update all fields, including image and faqs - handle empty strings properly
      if (req.body.title !== undefined) service.title = req.body.title;
      if (req.body.description !== undefined) service.description = req.body.description;
      if (req.body.price !== undefined) service.price = req.body.price;
      if (req.body.category !== undefined) service.category = req.body.category;
      if (req.body.features !== undefined) service.features = req.body.features;
      if (req.body.icon !== undefined) service.icon = req.body.icon;
      if (req.body.faqs !== undefined) service.faqs = req.body.faqs;
      
      // ✅ Handle image field with Cloudinary upload and auto-delete
      if (req.body.image !== undefined) {
        // If new image is a base64 string, upload to Cloudinary
        if (req.body.image && req.body.image.startsWith('data:image')) {
          try {
            console.log('📤 Uploading new image to Cloudinary...');
            const uploadResult = await uploadImage(req.body.image, 'services');
            service.image = uploadResult.url;
            service.imagePublicId = uploadResult.publicId;
            console.log('✅ New image uploaded:', uploadResult.url);
            
            // Delete old image from Cloudinary
            if (oldImagePublicId) {
              console.log('🗑️ Deleting old image from Cloudinary...');
              await deleteImage(oldImagePublicId);
            }
          } catch (uploadError) {
            console.error('Image upload failed:', uploadError);
            return res.status(500).json({ message: 'Failed to upload image' });
          }
        } else if (req.body.image && req.body.image.includes('cloudinary.com')) {
          // If it's already a Cloudinary URL and different from current, update it
          if (req.body.image !== service.image) {
            service.image = req.body.image;
            service.imagePublicId = extractPublicId(req.body.image);
            
            // Delete old image if it exists
            if (oldImagePublicId) {
              await deleteImage(oldImagePublicId);
            }
          }
        } else if (req.body.image === '' || req.body.image === null) {
          // If image is being removed, delete from Cloudinary
          if (oldImagePublicId) {
            console.log('🗑️ Removing image from Cloudinary...');
            await deleteImage(oldImagePublicId);
          }
          service.image = '';
          service.imagePublicId = '';
        }
      }
      
      const updatedService = await service.save();
      console.log('Service updated:', updatedService._id, 'Image:', updatedService.image, 'FAQs:', updatedService.faqs?.length);
      
      // Invalidate AI chatbot cache
      await invalidateAIChatbotCache();
      
      res.json(updatedService);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (service) {
      // Delete image from Cloudinary if it exists
      if (service.imagePublicId) {
        console.log('🗑️ Deleting service image from Cloudinary...');
        await deleteImage(service.imagePublicId);
      }
      
      await service.deleteOne();
      
      // Invalidate AI chatbot cache
      await invalidateAIChatbotCache();
      
      res.json({ message: 'Service removed' });
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};
