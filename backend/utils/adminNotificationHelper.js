const Notification = require('../models/notificationModel');

// Notify user when booking status is updated
exports.notifyBookingStatusUpdate = async (booking, status, adminNote = '') => {
  try {
    if (!booking.user) {
      console.log('⚠️ No user ID in booking, skipping notification');
      return;
    }

    console.log(`📢 Creating booking status update notification for user: ${booking.user}`);

    const statusMessages = {
      pending: 'Your booking is being reviewed',
      confirmed: 'Your booking has been confirmed',
      processing: 'Your booking is being processed',
      completed: 'Your booking has been completed',
      cancelled: 'Your booking has been cancelled'
    };

    // For status updates, we add 'action' field to bypass unique index
    const notification = await Notification.create({
      type: 'booking',
      title: 'Booking Status Updated',
      message: statusMessages[status] || `Your booking status: ${status}`,
      relatedId: booking._id,
      relatedModel: 'Booking',
      recipient: 'user',
      recipientId: booking.user,
      link: '/dashboard/bookings',
      metadata: {
        action: 'status_update', // This allows multiple notifications for same booking
        status,
        service: booking.service,
        adminNote,
        timestamp: new Date()
      }
    });
    console.log('✅ Booking status notification created:', notification._id);
  } catch (error) {
    console.error('❌ Error sending booking status notification:', error);
  }
};

// Notify user when quote is responded
exports.notifyQuoteResponse = async (quote, response) => {
  try {
    if (!quote.user) {
      console.log('⚠️ No user ID in quote, skipping notification');
      return;
    }

    console.log(`📢 Creating quote response notification for user: ${quote.user}`);

    const notification = await Notification.create({
      type: 'quote',
      title: 'Quote Response Received',
      message: `We have sent you a quote for ${quote.service}. Check your email!`,
      relatedId: quote._id,
      relatedModel: 'Quote',
      recipient: 'user',
      recipientId: quote.user,
      link: '/dashboard/quotes',
      metadata: {
        action: 'quote_response', // Allows multiple responses
        service: quote.service,
        hasResponse: true,
        timestamp: new Date()
      }
    });
    console.log('✅ Quote response notification created:', notification._id);
  } catch (error) {
    console.error('❌ Error sending quote response notification:', error);
  }
};

// Notify user when consultation is scheduled
exports.notifyConsultationScheduled = async (consultation, scheduledDate, scheduledTime) => {
  try {
    if (!consultation.user) return;

    await Notification.create({
      type: 'consultation',
      title: 'Consultation Scheduled',
      message: `Your consultation for ${consultation.service} has been scheduled for ${scheduledDate} at ${scheduledTime}`,
      relatedId: consultation._id,
      relatedModel: 'Consultation',
      recipient: 'user',
      recipientId: consultation.user,
      link: '/dashboard/consultations',
      metadata: {
        action: 'consultation_scheduled', // Allows multiple schedules
        service: consultation.service,
        scheduledDate,
        scheduledTime,
        timestamp: new Date()
      }
    });
    console.log('✅ Consultation scheduled notification sent to user');
  } catch (error) {
    console.error('❌ Error sending consultation scheduled notification:', error);
  }
};

// Notify user when admin replies to contact message
exports.notifyContactReply = async (contactId, userId, replyMessage) => {
  try {
    await Notification.create({
      type: 'contact',
      title: 'Admin Reply Received',
      message: `We have replied to your message. Check your email!`,
      relatedId: contactId,
      relatedModel: 'Contact',
      recipient: 'user',
      recipientId: userId,
      link: '/dashboard',
      metadata: {
        hasReply: true
      }
    });
    console.log('✅ Contact reply notification sent to user');
  } catch (error) {
    console.error('❌ Error sending contact reply notification:', error);
  }
};

// Generic notification for user
exports.notifyUser = async (userId, { title, message, type = 'system', link = '/dashboard', metadata = {} }) => {
  try {
    await Notification.create({
      type,
      title,
      message,
      recipient: 'user',
      recipientId: userId,
      link,
      metadata
    });
    console.log('✅ Custom notification sent to user');
  } catch (error) {
    console.error('❌ Error sending custom notification:', error);
  }
};

// Notify user about document upload request
exports.notifyDocumentRequest = async (bookingId, userId, documentType) => {
  try {
    await Notification.create({
      type: 'booking',
      title: 'Document Upload Required',
      message: `Please upload ${documentType} for your booking`,
      relatedId: bookingId,
      relatedModel: 'Booking',
      recipient: 'user',
      recipientId: userId,
      link: '/dashboard/bookings',
      metadata: {
        action: 'document_required',
        documentType
      }
    });
    console.log('✅ Document request notification sent to user');
  } catch (error) {
    console.error('❌ Error sending document request notification:', error);
  }
};

// Notify user about payment request
exports.notifyPaymentRequest = async (bookingId, userId, amount, service) => {
  try {
    await Notification.create({
      type: 'booking',
      title: 'Payment Request',
      message: `Payment of ₹${amount} is required for ${service}`,
      relatedId: bookingId,
      relatedModel: 'Booking',
      recipient: 'user',
      recipientId: userId,
      link: '/dashboard/bookings',
      metadata: {
        action: 'payment_required',
        amount,
        service
      }
    });
    console.log('✅ Payment request notification sent to user');
  } catch (error) {
    console.error('❌ Error sending payment request notification:', error);
  }
};

// Notify user when service is completed
exports.notifyServiceCompleted = async (bookingId, userId, service) => {
  try {
    await Notification.create({
      type: 'booking',
      title: 'Service Completed',
      message: `Your ${service} service has been completed successfully`,
      relatedId: bookingId,
      relatedModel: 'Booking',
      recipient: 'user',
      recipientId: userId,
      link: '/dashboard/bookings',
      metadata: {
        action: 'completed',
        service
      }
    });
    console.log('✅ Service completion notification sent to user');
  } catch (error) {
    console.error('❌ Error sending service completion notification:', error);
  }
};
