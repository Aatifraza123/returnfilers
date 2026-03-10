const express = require('express');
const router = express.Router();
const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  addLeadActivity,
  sendLeadFollowUp,
  deleteLead,
  getLeadStats
} = require('../controllers/leadController');
const { protectAdmin } = require('../middleware/adminAuthMiddleware');

// Public route for lead creation (no auth required)
router.post('/', createLead);

// All other routes require admin authentication
router.use(protectAdmin);

// Stats route (must be before /:id)
router.get('/stats', getLeadStats);

// CRUD routes (admin only)
router.get('/', getLeads);

router.route('/:id')
  .get(getLeadById)
  .patch(updateLead)
  .delete(deleteLead);

// Activity and follow-up routes
router.post('/:id/activity', addLeadActivity);
router.post('/:id/follow-up', sendLeadFollowUp);

module.exports = router;
