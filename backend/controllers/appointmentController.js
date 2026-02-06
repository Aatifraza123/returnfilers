const Appointment = require('../models/Appointment');
const { getAvailableSlots, autoBookAppointment, suggestAppointmentSlots } = require('../utils/aiBookingService');
const { sendEmail } = require('../utils/emailService');

/**
 * @desc    Get available appointment slots
 * @route   GET /api/appointments/available-slots
 * @access  Public
 */
const getAvailableSlotsController = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const slots = await getAvailableSlots(parseInt(days));
    
    res.json({
      success: true,
      data: slots
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available slots'
    });
  }
};

/**
 * @desc    AI suggests appointment slots
 * @route   POST /api/appointments/suggest-slots
 * @access  Public
 */
const suggestSlots = async (req, res) => {
  try {
    const { message } = req.body;
    const suggestions = await suggestAppointmentSlots(message);
    
    res.json(suggestions);
  } catch (error) {
    console.error('Suggest slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to suggest slots'
    });
  }
};

/**
 * @desc    Create appointment (manual or AI-powered)
 * @route   POST /api/appointments
 * @access  Public
 */
const createAppointment = async (req, res) => {
  try {
    const { name, email, phone, service, appointmentDate, appointmentTime, message, meetingType } = req.body;
    
    // Validation
    if (!name || !email || !phone || !service || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    // Check if slot is already booked
    const existingAppointment = await Appointment.findOne({
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $in: ['pending', 'confirmed'] }
    });
    
    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked. Please choose another slot.'
      });
    }
    
    // Create appointment
    const appointment = await Appointment.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.replace(/\D/g, ''),
      service: service.trim(),
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      message: message?.trim() || '',
      meetingType: meetingType || 'online',
      bookedBy: 'customer'
    });
    
    // Send response immediately
    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully! You will receive a confirmation email shortly.',
      data: {
        id: appointment._id,
        date: appointment.appointmentDate,
        time: appointment.appointmentTime
      }
    });
    
    // Send emails in background
    setImmediate(async () => {
      try {
        await sendAppointmentEmails(appointment);

        // Capture lead for scoring and follow-up
        const { captureLeadFromForm } = require('../utils/leadScoringService');
        await captureLeadFromForm({
          name: appointment.name,
          email: appointment.email,
          phone: appointment.phone,
          source: 'appointment',
          service: appointment.service,
          message: appointment.message
        });
        console.log('✅ Lead captured from appointment');
      } catch (err) {
        console.error('Email sending failed:', err);
      }
    });
    
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create appointment'
    });
  }
};

/**
 * @desc    AI auto-book appointment
 * @route   POST /api/appointments/auto-book
 * @access  Public
 */
const autoBook = async (req, res) => {
  try {
    const result = await autoBookAppointment(req.body);
    
    if (result.success) {
      // Send confirmation emails
      const appointment = await Appointment.findById(result.appointment.id);
      setImmediate(async () => {
        try {
          await sendAppointmentEmails(appointment);
        } catch (err) {
          console.error('Email sending failed:', err);
        }
      });
    }
    
    res.json(result);
  } catch (error) {
    console.error('Auto-book error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to auto-book appointment'
    });
  }
};

/**
 * @desc    Get all appointments (Admin)
 * @route   GET /api/appointments
 * @access  Private/Admin
 */
const getAppointments = async (req, res) => {
  try {
    const { status, date, email } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (email) query.email = email.toLowerCase().trim();
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: startDate, $lte: endDate };
    }
    
    const appointments = await Appointment.find(query)
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .select('-__v');
    
    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments'
    });
  }
};

/**
 * @desc    Get appointments by email (Public - for guest users)
 * @route   GET /api/appointments/by-email/:email
 * @access  Public
 */
const getAppointmentsByEmail = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase().trim();
    
    const appointments = await Appointment.find({ email })
      .sort({ appointmentDate: -1 })
      .select('-__v');
    
    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Get appointments by email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments'
    });
  }
};

/**
 * @desc    Update appointment status
 * @route   PATCH /api/appointments/:id
 * @access  Private/Admin
 */
const updateAppointment = async (req, res) => {
  try {
    const { status, adminNotes, meetingLink } = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes, meetingLink },
      { new: true, runValidators: true }
    );
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment'
    });
  }
};

/**
 * @desc    Cancel appointment
 * @route   DELETE /api/appointments/:id/cancel
 * @access  Public/Private
 */
const cancelAppointment = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'cancelled',
        cancelReason: reason || 'No reason provided'
      },
      { new: true }
    );
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment'
    });
  }
};

/**
 * @desc    Delete appointment permanently (Admin only)
 * @route   DELETE /api/appointments/:id
 * @access  Private/Admin
 */
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Appointment deleted permanently'
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete appointment'
    });
  }
};

/**
 * Helper: Send appointment confirmation emails
 */
const sendAppointmentEmails = async (appointment) => {
  const appointmentDate = new Date(appointment.appointmentDate).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Customer confirmation email
  const customerHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0B1530; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .appointment-details { background: white; padding: 20px; border-left: 4px solid #D4AF37; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #D4AF37; color: #0B1530; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .footer { background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>✅ Appointment Confirmed!</h2>
        </div>
        <div class="content">
          <p>Dear ${appointment.name},</p>
          <p>Your appointment has been successfully booked with ReturnFilers.</p>
          
          <div class="appointment-details">
            <h3 style="margin-top: 0; color: #0B1530;">Appointment Details</h3>
            <p><strong>Service:</strong> ${appointment.service}</p>
            <p><strong>Date:</strong> ${appointmentDate}</p>
            <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
            <p><strong>Type:</strong> ${appointment.meetingType === 'online' ? 'Online Meeting' : appointment.meetingType === 'phone' ? 'Phone Call' : 'In-Person'}</p>
            ${appointment.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${appointment.meetingLink}">${appointment.meetingLink}</a></p>` : ''}
          </div>
          
          <p>We'll send you a reminder 24 hours before your appointment.</p>
          <p>If you need to reschedule or cancel, please contact us at +91 84471 27264</p>
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/dashboard/consultations" class="button">View My Appointments</a>
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ReturnFilers. All rights reserved.</p>
          <p>📞 +91 84471 27264 | 📧 info@returnfilers.in</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Admin notification email
  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #D4AF37; color: #0B1530; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .details { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🔔 New Appointment Booked</h2>
        </div>
        <div class="content">
          <div class="details">
            <h3>Customer Details</h3>
            <p><strong>Name:</strong> ${appointment.name}</p>
            <p><strong>Email:</strong> ${appointment.email}</p>
            <p><strong>Phone:</strong> ${appointment.phone}</p>
          </div>
          
          <div class="details">
            <h3>Appointment Details</h3>
            <p><strong>Service:</strong> ${appointment.service}</p>
            <p><strong>Date:</strong> ${appointmentDate}</p>
            <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
            <p><strong>Type:</strong> ${appointment.meetingType}</p>
            <p><strong>Booked By:</strong> ${appointment.bookedBy}</p>
          </div>
          
          ${appointment.message ? `
          <div class="details">
            <h3>Message</h3>
            <p>${appointment.message}</p>
          </div>
          ` : ''}
        </div>
      </div>
    </body>
    </html>
  `;
  
  try {
    // Send to customer
    await sendEmail({
      to: appointment.email,
      subject: '✅ Appointment Confirmed - ReturnFilers',
      html: customerHtml
    });
    
    // Send to admin
    await sendEmail({
      to: 'info@returnfilers.in',
      subject: `🔔 New Appointment: ${appointment.name} - ${appointmentDate} ${appointment.appointmentTime}`,
      html: adminHtml
    });
    
    console.log('✅ Appointment emails sent');
  } catch (error) {
    console.error('❌ Failed to send appointment emails:', error);
  }
};

module.exports = {
  getAvailableSlotsController,
  suggestSlots,
  createAppointment,
  autoBook,
  getAppointments,
  getAppointmentsByEmail,
  updateAppointment,
  cancelAppointment,
  deleteAppointment
};
