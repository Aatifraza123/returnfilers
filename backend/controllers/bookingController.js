const Booking = require('../models/Booking');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const { sendEmail } = require('../utils/emailService');
const { createBookingNotification } = require('../utils/notificationHelper');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private (User must be logged in)
const createBooking = async (req, res) => {
  try {
    const { name, email, phone, service, message, documents } = req.body;
    const userId = req.user.id; // Get user ID from auth middleware

    console.log('NEW BOOKING');
    console.log('User ID:', userId);
    console.log('Data:', { name, email, phone, service, hasDocuments: documents?.length > 0 });

    if (!name || !email || !phone || !service) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, phone, and service'
      });
    }

    const booking = await Booking.create({
      user: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.replace(/\D/g, ''),
      service: service.trim(),
      message: message?.trim() || '',
      documents: documents || []
    });

    // Add booking to user's bookings array
    await User.findByIdAndUpdate(userId, {
      $push: { bookings: booking._id }
    });

    console.log('Booking saved and linked to user:', booking._id);

    res.status(201).json({
      success: true,
      message: 'Booking submitted successfully!',
      data: { id: booking._id, name: booking.name }
    });

    // Send email notification
    setImmediate(() => {
      sendBookingEmail(booking).catch(err => console.error('Email failed:', err));
      // Pass the userId explicitly to ensure user notification is created
      createBookingNotification({ ...booking.toObject(), user: userId })
        .catch(err => console.error('Notification failed:', err));
    });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to submit booking' });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .select('-documents.data');

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private/Admin
const getBookingById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking
// @route   PATCH /api/bookings/:id
// @access  Private/Admin
const updateBooking = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID' });
    }

    const { status, adminNotes } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, message: 'Booking updated', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
const deleteBooking = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID' });
    }

    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reply to booking via email
// @route   POST /api/bookings/reply
// @access  Private/Admin
const replyToBooking = async (req, res) => {
  try {
    const { bookingId, to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please provide to, subject, and message' });
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:20px;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;">
              <tr><td style="background:#0B1530;padding:30px;text-align:center;border-radius:8px 8px 0 0;">
                <h1 style="color:#D4AF37;margin:0;">ReturnFilers</h1>
              </td></tr>
              <tr><td style="padding:30px;">
                <div style="white-space:pre-line;color:#333;line-height:1.6;">${message}</div>
              </td></tr>
              <tr><td style="background:#0B1530;padding:20px;text-align:center;border-radius:0 0 8px 8px;">
                <p style="color:#D4AF37;margin:0;font-weight:bold;">ReturnFilers</p>
                <p style="color:#fff;margin:5px 0 0;font-size:12px;">+91 84471 27264 | info@returnfilers.in</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `;

    await sendEmail({ to, subject, html });

    // Update booking status to contacted and create user notification
    if (bookingId) {
      const booking = await Booking.findByIdAndUpdate(bookingId, { status: 'contacted' }, { new: true });
      
      // Create notification for the user
      if (booking && booking.user) {
        const { createBookingReplyNotification } = require('../utils/notificationHelper');
        await createBookingReplyNotification(bookingId, booking.user);
      }
    }

    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Reply email error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to send email' });
  }
};

// Helper function to send booking emails using professional templates
const sendBookingEmail = async (booking) => {
  console.log('sendBookingEmail called for:', booking._id);
  
  const { getAdminNotificationTemplate, getCustomerConfirmationTemplate } = require('../utils/emailTemplates');

  // Use new professional templates
  const adminHtml = getAdminNotificationTemplate({
    type: 'booking',
    data: {
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      service: booking.service,
      preferredDate: booking.preferredDate,
      preferredTime: booking.preferredTime
    }
  });

  const customerHtml = getCustomerConfirmationTemplate({
    type: 'booking',
    data: {
      name: booking.name,
      service: booking.service,
      preferredDate: booking.preferredDate,
      preferredTime: booking.preferredTime
    }
  });

  try {
    // Send admin notification to info@returnfilers.in only
    console.log('Sending admin notification email to info@returnfilers.in...');
    await sendEmail({
      to: 'info@returnfilers.in',
      subject: `New Booking: ${booking.service} - ${booking.name}`,
      html: adminHtml
    });
    console.log('✅ Admin email sent to info@returnfilers.in');

    // Send customer confirmation
    console.log('Sending customer confirmation email...');
    await sendEmail({
      to: booking.email,
      subject: `Booking Confirmed - ${booking.service}`,
      html: customerHtml
    });
    console.log('✅ Customer email sent');

  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (User)
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .sort({ createdAt: -1 });
      // Include document data for user to download their files

    res.json({ 
      success: true, 
      count: bookings.length, 
      bookings 
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createBooking, getBookings, getBookingById, updateBooking, deleteBooking, replyToBooking, getUserBookings };
