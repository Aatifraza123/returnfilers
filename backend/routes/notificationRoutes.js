const express = require('express');
const router = express.Router();
const {
  getAdminNotifications,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getAdminUnreadCount,
  getUserUnreadCount,
  sendNotificationToUser
} = require('../controllers/notificationController');
const { protectAdmin } = require('../middleware/adminAuthMiddleware');
const { protectUser } = require('../middleware/userAuth');

// Specific routes first (more specific paths before general ones)
router.get('/admin/unread-count', protectAdmin, getAdminUnreadCount);
router.get('/user/unread-count', protectUser, getUserUnreadCount);

// Admin routes
router.get('/admin', protectAdmin, getAdminNotifications);
router.post('/send-to-user', protectAdmin, sendNotificationToUser);

// User routes
router.get('/user', protectUser, getUserNotifications);

// Common routes
router.put('/:id/read', markAsRead);
router.put('/mark-all-read', markAllAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
