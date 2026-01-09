const express = require('express');
const router = express.Router();

// Import from controllers
const { getPublicServices, getPublicBlogs } = require('../controllers/publicController');

// Define Routes
router.get('/services', getPublicServices);
router.get('/blogs', getPublicBlogs);

// Note: /api/consultations is handled by consultationRoutes
// Note: /api/contact is handled by contactRoutes

module.exports = router;

