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

// All routes require admin authentication
router.use(protectAdmin);

// Stats route (must be before /:id)
router.get('/stats', getLeadStats);

// CRUD routes
router.route('/')
  .get(getLeads)
  .post(createLead);

router.route('/:id')
  .get(getLeadById)
  .patch(updateLead)
  .delete(deleteLead);

// Activity and follow-up routes
router.post('/:id/activity', addLeadActivity);
router.post('/:id/follow-up', sendLeadFollowUp);

module.exports = router;
