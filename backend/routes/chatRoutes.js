const express = require('express');
const router = express.Router();
const { chatWithAI, chatWithAIStream, testAI, invalidateCache } = require('../controllers/chatController');

// Public route - no auth required
router.post('/', chatWithAI);

// Streaming endpoint for real-time responses
router.post('/stream', chatWithAIStream);

// Test endpoint to check if AI APIs are working
router.get('/test', testAI);

// Cache invalidation endpoint (for admin use after updates)
router.post('/invalidate-cache', invalidateCache);

module.exports = router;
