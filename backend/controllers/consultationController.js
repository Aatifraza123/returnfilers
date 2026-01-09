const Consultation = require('../models/Consultation');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { createConsultationNotification } = require('../utils/notificationHelper');

// @desc    Submit consultation request
// @route   POST /api/consultations
// @access  Private (User must be logged in)
const createConsultation = async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    const userId = req.user?.id; // Get user ID from auth middleware (optional)

    console.log('NEW CONSULTATION REQUEST');
    console.log('User ID:', userId || 'Not logged in');
    console.log('Data:', { name, email, phone, service });

    // Validation
    if (!name || !email || !phone || !service) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, phone, and service'
      });
    }

    // Clean phone number
    const cleanPhone = phone.replace(/\D/g, '');

    // Create consultation
    const consultation = await Consultation.create({
      user: userId || undefined,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      service: service.trim(),
      message: message ? message.trim() : ''
    });

    // Add consultation to user's consultations array if user is logged in
    if (userId) {
      const User = require('../models/userModel');
      await User.findByIdAndUpdate(userId, {
        $push: { consultations: consultation._id }
      });
      console.log('Consultation linked to user:', userId);
    }

    console.log('Consultation saved:', consultation._id);

    // Send response immediately (BEFORE any email operations)
    res.status(201).json({
      success: true,
      message: 'Consultation request submitted successfully! We will contact you within 24 hours.',
      data: {
        id: consultation._id,
        name: consultation.name,
        service: consultation.service
      }
    });

    // Send emails in next event loop tick (completely non-blocking)
    setImmediate(() => {
      console.log('Starting email sending process for consultation:', consultation._id);
      sendConsultationEmails(consultation)
        .then(() => {
          console.log('Consultation emails sent successfully');
        })
        .catch(err => {
          console.error('Email sending failed (non-blocking):', err);
        });
      // Pass userId explicitly to ensure user notification is created
      createConsultationNotification({ ...consultation.toObject(), user: userId })
        .catch(err => console.error('Consultation notification failed:', err));
    });
  } catch (error) {
    console.error('Consultation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit consultation request'
    });
  }
};

// @desc    Get all consultations
// @route   GET /api/consultations
// @access  Private/Admin
const getConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find()
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: consultations.length,
      consultations: consultations
    });
  } catch (error) {
    console.error('Get consultations error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single consultation
// @route   GET /api/consultations/:id
// @access  Private/Admin
const getConsultationById = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid consultation ID format'
      });
    }

    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    res.json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Get consultation by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get consultation'
    });
  }
};

// @desc    Update consultation status
// @route   PATCH /api/consultations/:id
// @access  Private/Admin
const updateConsultation = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid consultation ID format'
      });
    }

    const { status } = req.body;

    const consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    res.json({
      success: true,
      message: 'Consultation updated successfully',
      data: consultation
    });
  } catch (error) {
    console.error('Update consultation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update consultation'
    });
  }
};

// @desc    Delete consultation
// @route   DELETE /api/consultations/:id
// @access  Private/Admin
const deleteConsultation = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid consultation ID format'
      });
    }

    const consultation = await Consultation.findByIdAndDelete(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    res.json({
      success: true,
      message: 'Consultation deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to send emails using professional templates
const sendConsultationEmails = async (consultation) => {
  console.log('sendConsultationEmails called for:', consultation._id);
  
  const { sendEmail } = require('../utils/emailService');
  const { getAdminNotificationTemplate, getCustomerConfirmationTemplate } = require('../utils/emailTemplates');

  // Use new professional templates
  const adminHtml = getAdminNotificationTemplate({
    type: 'consultation',
    data: {
      name: consultation.name,
      email: consultation.email,
      phone: consultation.phone,
      service: consultation.service,
      message: consultation.message
    }
  });

  const customerHtml = getCustomerConfirmationTemplate({
    type: 'consultation',
    data: {
      name: consultation.name,
      service: consultation.service,
      message: consultation.message
    }
  });

  try {
    // Send admin notification to info@returnfilers.in only
    console.log('Sending admin notification email to info@returnfilers.in...');
    await sendEmail({
      to: 'info@returnfilers.in',
      subject: `New Consultation: ${consultation.service} - ${consultation.name}`,
      html: adminHtml
    });
    console.log('✅ Admin email sent to info@returnfilers.in');

    // Customer confirmation
    console.log('Sending customer confirmation email...');
    await sendEmail({
      to: consultation.email,
      subject: `Consultation Request Received - ${consultation.service}`,
      html: customerHtml
    });
    console.log('✅ Customer email sent');

  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
  }
};

// @desc    Get user's consultations
// @route   GET /api/consultations/my-consultations
// @access  Private (User)
const getUserConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      count: consultations.length, 
      consultations 
    });
  } catch (error) {
    console.error('Get user consultations error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createConsultation,
  getConsultations,
  getConsultationById,
  updateConsultation,
  deleteConsultation,
  getUserConsultations
};







