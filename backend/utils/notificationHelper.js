const Notification = require('../models/notificationModel');

// Create notification for new booking
exports.createBookingNotification = async (booking) => {
  try {
    // Check if admin notification already exists for this booking
    const existingAdminNotif = await Notification.findOne({
      type: 'booking',
      relatedId: booking._id,
      recipient: 'admin'
    });

    if (!existingAdminNotif) {
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
    } else {
      console.log('⚠️ Booking admin notification already exists, skipping');
    }

    // User notification - notify user that their booking was received
    if (booking.user) {
      // Check if user notification already exists for this booking
      const existingUserNotif = await Notification.findOne({
        type: 'booking',
        relatedId: booking._id,
        recipient: 'user',
        recipientId: booking.user
      });

      if (!existingUserNotif) {
        await Notification.create({
          type: 'booking',
          title: 'Booking Received Successfully',
          message: `Your booking for ${booking.service} has been confirmed. Our team will contact you within 24 hours.`,
          relatedId: booking._id,
          relatedModel: 'Booking',
          recipient: 'user',
          recipientId: booking.user,
          link: '/dashboard/bookings',
          metadata: {
            service: booking.service
          }
        });
        console.log('✅ Booking user notification created');
      } else {
        console.log('⚠️ Booking user notification already exists, skipping');
      }
    }
  } catch (error) {
    console.error('❌ Error creating booking notification:', error);
  }
};

// Create notification for new quote
exports.createQuoteNotification = async (quote) => {
  try {
    // Check if admin notification already exists for this quote
    const existingAdminNotif = await Notification.findOne({
      type: 'quote',
      relatedId: quote._id,
      recipient: 'admin'
    });

    if (!existingAdminNotif) {
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
    } else {
      console.log('⚠️ Quote admin notification already exists, skipping');
    }

    // User notification
    if (quote.user) {
      // Check if user notification already exists for this quote
      const existingUserNotif = await Notification.findOne({
        type: 'quote',
        relatedId: quote._id,
        recipient: 'user',
        recipientId: quote.user
      });

      if (!existingUserNotif) {
        await Notification.create({
          type: 'quote',
          title: 'Quote Request Received',
          message: `Your quote request for ${quote.service} has been received. We'll send you a detailed quote within 24 hours.`,
          relatedId: quote._id,
          relatedModel: 'Quote',
          recipient: 'user',
          recipientId: quote.user,
          link: '/dashboard/quotes',
          metadata: {
            service: quote.service
          }
        });
        console.log('✅ Quote user notification created');
      } else {
        console.log('⚠️ Quote user notification already exists, skipping');
      }
    }
  } catch (error) {
    console.error('❌ Error creating quote notification:', error);
  }
};

// Create notification for new consultation
exports.createConsultationNotification = async (consultation) => {
  try {
    // Check if admin notification already exists for this consultation
    const existingAdminNotif = await Notification.findOne({
      type: 'consultation',
      relatedId: consultation._id,
      recipient: 'admin'
    });

    if (!existingAdminNotif) {
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
    } else {
      console.log('⚠️ Consultation admin notification already exists, skipping');
    }

    // User notification
    if (consultation.user) {
      // Check if user notification already exists for this consultation
      const existingUserNotif = await Notification.findOne({
        type: 'consultation',
        relatedId: consultation._id,
        recipient: 'user',
        recipientId: consultation.user
      });

      if (!existingUserNotif) {
        await Notification.create({
          type: 'consultation',
          title: 'Consultation Request Received',
          message: `Your consultation request for ${consultation.service} has been received. Our expert will reach out to you shortly.`,
          relatedId: consultation._id,
          relatedModel: 'Consultation',
          recipient: 'user',
          recipientId: consultation.user,
          link: '/dashboard/consultations',
          metadata: {
            service: consultation.service
          }
        });
        console.log('✅ Consultation user notification created');
      } else {
        console.log('⚠️ Consultation user notification already exists, skipping');
      }
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

