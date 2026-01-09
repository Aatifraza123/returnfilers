const Notification = require('../models/notificationModel');

// Create notification for new booking
exports.createBookingNotification = async (booking) => {
  try {
    // Admin notification
    await Notification.create({
      type: 'booking',
      title: 'New Booking Received',
      message: `${booking.name} has booked ${booking.service}`,
      relatedId: booking._id,
      relatedModel: 'Booking',
      recipient: 'admin',
      link: '/admin/bookings',
      metadata: {
        customerName: booking.name,
        service: booking.service,
        email: booking.email
      }
    });
    console.log('✅ Booking admin notification created');

    // User notification - notify user that their booking was received
    if (booking.user) {
      await Notification.create({
        type: 'booking',
        title: 'Booking Confirmation',
        message: `Your booking for ${booking.service} has been received. We will contact you soon.`,
        relatedId: booking._id,
        relatedModel: 'Booking',
        recipient: 'user',
        recipientId: booking.user,
        link: '/dashboard',
        metadata: {
          service: booking.service
        }
      });
      console.log('✅ Booking user notification created');
    }
  } catch (error) {
    console.error('❌ Error creating booking notification:', error);
  }
};

// Create notification for new quote
exports.createQuoteNotification = async (quote) => {
  try {
    // Admin notification
    await Notification.create({
      type: 'quote',
      title: 'New Quote Request',
      message: `${quote.name} requested a quote for ${quote.service}`,
      relatedId: quote._id,
      relatedModel: 'Quote',
      recipient: 'admin',
      link: '/admin/quotes',
      metadata: {
        customerName: quote.name,
        service: quote.service,
        email: quote.email
      }
    });
    console.log('✅ Quote admin notification created');

    // User notification
    if (quote.user) {
      await Notification.create({
        type: 'quote',
        title: 'Quote Request Received',
        message: `Your quote request for ${quote.service} has been received. We will send you a quote soon.`,
        relatedId: quote._id,
        relatedModel: 'Quote',
        recipient: 'user',
        recipientId: quote.user,
        link: '/dashboard',
        metadata: {
          service: quote.service
        }
      });
      console.log('✅ Quote user notification created');
    }
  } catch (error) {
    console.error('❌ Error creating quote notification:', error);
  }
};

// Create notification for new consultation
exports.createConsultationNotification = async (consultation) => {
  try {
    // Admin notification
    await Notification.create({
      type: 'consultation',
      title: 'New Consultation Request',
      message: `${consultation.name} requested consultation for ${consultation.service}`,
      relatedId: consultation._id,
      relatedModel: 'Consultation',
      recipient: 'admin',
      link: '/admin/consultations',
      metadata: {
        customerName: consultation.name,
        service: consultation.service,
        email: consultation.email
      }
    });
    console.log('✅ Consultation admin notification created');

    // User notification
    if (consultation.user) {
      await Notification.create({
        type: 'consultation',
        title: 'Consultation Request Received',
        message: `Your consultation request for ${consultation.service} has been received. We will reach out to you shortly.`,
        relatedId: consultation._id,
        relatedModel: 'Consultation',
        recipient: 'user',
        recipientId: consultation.user,
        link: '/dashboard',
        metadata: {
          service: consultation.service
        }
      });
      console.log('✅ Consultation user notification created');
    }
  } catch (error) {
    console.error('❌ Error creating consultation notification:', error);
  }
};

// Create notification for new contact message
exports.createContactNotification = async (contact) => {
  try {
    await Notification.create({
      type: 'contact',
      title: 'New Contact Message',
      message: `${contact.name} sent a message: ${contact.message.substring(0, 50)}...`,
      relatedId: contact._id,
      relatedModel: 'Contact',
      recipient: 'admin',
      link: '/admin/contacts',
      metadata: {
        customerName: contact.name,
        email: contact.email,
        subject: contact.subject
      }
    });
    console.log('✅ Contact notification created');
  } catch (error) {
    console.error('❌ Error creating contact notification:', error);
  }
};

// Create notification for user (when admin responds, etc.)
exports.createUserNotification = async (userId, data) => {
  try {
    await Notification.create({
      ...data,
      recipient: 'user',
      recipientId: userId
    });
    console.log('✅ User notification created');
  } catch (error) {
    console.error('❌ Error creating user notification:', error);
  }
};

// Create notification when admin replies to a booking
exports.createBookingReplyNotification = async (bookingId, userId) => {
  try {
    await Notification.create({
      type: 'booking',
      title: 'Admin Response',
      message: `We have responded to your booking request. Please check your email.`,
      relatedId: bookingId,
      relatedModel: 'Booking',
      recipient: 'user',
      recipientId: userId,
      link: '/dashboard',
      metadata: {
        action: 'admin_response'
      }
    });
    console.log('✅ Booking reply notification created for user');
  } catch (error) {
    console.error('❌ Error creating booking reply notification:', error);
  }
};

