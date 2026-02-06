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
  cancelAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');

// Public routes
router.get('/available-slots', getAvailableSlotsController);
router.get('/by-email/:email', getAppointmentsByEmail);
router.post('/suggest-slots', suggestSlots);
router.post('/', createAppointment); // Removed reCAPTCHA for now
router.post('/auto-book', autoBook); // Removed reCAPTCHA for now
router.delete('/:id/cancel', cancelAppointment);

// Admin routes
router.get('/', protectAdmin, getAppointments);
router.patch('/:id', protectAdmin, updateAppointment);
router.delete('/:id', protectAdmin, deleteAppointment);

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
