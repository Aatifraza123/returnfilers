const Service = require('../models/serviceModel');

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
    
    const service = await Service.create({
      title,
      description,
      price,
      category,
      icon,
      features,
      image // ✅ Save Image
    });

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
      // Update all fields, including image - handle empty strings properly
      if (req.body.title !== undefined) service.title = req.body.title;
      if (req.body.description !== undefined) service.description = req.body.description;
      if (req.body.price !== undefined) service.price = req.body.price;
      if (req.body.category !== undefined) service.category = req.body.category;
      if (req.body.features !== undefined) service.features = req.body.features;
      if (req.body.icon !== undefined) service.icon = req.body.icon;
      
      // ✅ Properly handle image field - allow empty string to clear image
      if (req.body.image !== undefined) {
        service.image = req.body.image || ''; // Allow empty string
      }
      
      const updatedService = await service.save();
      console.log('Service updated:', updatedService._id, 'Image:', updatedService.image);
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
      await service.deleteOne();
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
