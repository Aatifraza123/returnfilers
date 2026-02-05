const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/adminAuthMiddleware');
const { verifyRecaptcha } = require('../middleware/recaptchaMiddleware');
const {
  getAvailableSlotsController,
  suggestSlots,
  createAppointment,
  autoBook,
  getAppointments,
  getAppointmentsByEmail,
  updateAppointment,
  cancelAppointment
} = require('../controllers/appointmentController');

// Public routes
router.get('/available-slots', getAvailableSlotsController);
router.get('/by-email/:email', getAppointmentsByEmail);
router.post('/suggest-slots', suggestSlots);
router.post('/', verifyRecaptcha(0.5), createAppointment);
router.post('/auto-book', verifyRecaptcha(0.5), autoBook);
router.delete('/:id/cancel', cancelAppointment);

// Admin routes
router.get('/', protectAdmin, getAppointments);
router.patch('/:id', protectAdmin, updateAppointment);

// Test route to manually trigger reminders (Admin only)
router.post('/trigger-reminders', protectAdmin, async (req, res) => {
  try {
    const { triggerRemindersNow } = require('../utils/appointmentReminderService');
    await triggerRemindersNow();
    res.json({ success: true, message: 'Reminders triggered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Test route to manually trigger lead follow-ups (Admin only)
router.post('/trigger-followups', protectAdmin, async (req, res) => {
  try {
    const { triggerFollowUpsNow } = require('../utils/leadScoringService');
    await triggerFollowUpsNow();
    res.json({ success: true, message: 'Lead follow-ups triggered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
