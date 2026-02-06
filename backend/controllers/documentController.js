const Document = require('../models/Document');
const mongoose = require('mongoose');
const { sendEmail } = require('../utils/emailService');

// @desc    Submit documents
// @route   POST /api/documents
// @access  Public
const createDocument = async (req, res) => {
  try {
    const { name, email, phone, service, message, documents } = req.body;

    console.log('NEW DOCUMENT SUBMISSION');

    // Validation
    if (!name || !email || !phone || !service) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, phone, and service'
      });
    }

    if (!documents || documents.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one document'
      });
    }

    // Format documents array
    const formattedDocs = documents.map(doc => ({
      name: doc.name,
      type: doc.type || '',
      size: doc.size || 0,
      data: doc.data
    }));

    // Create document submission
    const doc = await Document.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.replace(/\D/g, ''),
      service: service.trim(),
      message: message?.trim() || '',
      documents: formattedDocs
    });

    console.log('Document submission saved:', doc._id);

    // Send response immediately
    res.status(201).json({
      success: true,
      message: 'Documents submitted successfully! We will review and contact you soon.',
      data: {
        id: doc._id,
        name: doc.name
      }
    });

    // Send email notification in background
    setImmediate(() => {
      sendDocumentEmails(doc).catch(err => {
        console.error('Email sending failed:', err);
      });
    });

  } catch (error) {
    console.error('Document submission error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit documents'
    });
  }
};

// @desc    Get all document submissions
// @route   GET /api/documents
// @access  Private/Admin
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .sort({ createdAt: -1 })
      .select('-documents.data'); // Exclude base64 data for list view

    res.json({
      success: true,
      count: documents.length,
      documents: documents
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single document submission with full data
// @route   GET /api/documents/:id
// @access  Private/Admin
const getDocumentById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document ID'
      });
    }

    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Document submission not found'
      });
    }

    res.json({
      success: true,
      data: doc
    });
  } catch (error) {
    console.error('Get document by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update document status/notes
// @route   PATCH /api/documents/:id
// @access  Private/Admin
const updateDocument = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document ID'
      });
    }

    const { status, adminNotes } = req.body;

    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true, runValidators: true }
    );

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Document submission not found'
      });
    }

    res.json({
      success: true,
      message: 'Document updated successfully',
      data: doc
    });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete document submission
// @route   DELETE /api/documents/:id
// @access  Private/Admin
const deleteDocument = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document ID'
      });
    }

    const doc = await Document.findByIdAndDelete(req.params.id);

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Document submission not found'
      });
    }

    res.json({
      success: true,
      message: 'Document submission deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to send emails
const sendDocumentEmails = async (doc) => {
  const adminEmailAddress = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'info@returnfilers.in';

  const { getEmailTemplate } = require('../utils/emailTemplates');
  
  const adminHtml = getEmailTemplate({
    title: 'New Document Submission',
    content: `
      <p style="margin: 0 0 16px 0; color: #4b5563;">A new document submission has been received.</p>
      <div style="background: #f9fafb; padding: 16px; margin: 20px 0; border: 1px solid #e5e7eb;">
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Name</p>
        <p style="margin: 0 0 12px 0; color: #4b5563; font-size: 14px;">${doc.name}</p>
        
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Email</p>
        <p style="margin: 0 0 12px 0;"><a href="mailto:${doc.email}" style="color: #2563eb; text-decoration: none; font-size: 14px;">${doc.email}</a></p>
        
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Phone</p>
        <p style="margin: 0 0 12px 0;"><a href="tel:${doc.phone}" style="color: #2563eb; text-decoration: none; font-size: 14px;">${doc.phone || 'Not provided'}</a></p>
        
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Service</p>
        <p style="margin: 0 0 12px 0; color: #111827; font-weight: 600; font-size: 14px;">${doc.service}</p>
        
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Documents</p>
        <p style="margin: 0 0 12px 0; color: #4b5563; font-size: 14px;">${doc.documents.length} file(s) uploaded</p>
        
        ${doc.message ? `
        <div style="padding-top: 12px; margin-top: 12px; border-top: 1px solid #e5e7eb;">
          <p style="color: #111827; font-weight: 600; margin: 0 0 6px 0; font-size: 13px;">Message</p>
          <p style="color: #4b5563; margin: 0; line-height: 1.6; font-size: 14px;">${doc.message}</p>
        </div>
        ` : ''}
        
        <div style="padding-top: 12px; margin-top: 12px; border-top: 1px solid #e5e7eb;">
          <p style="color: #111827; font-weight: 600; margin: 0 0 6px 0; font-size: 13px;">Reference ID</p>
          <p style="color: #4b5563; margin: 0; font-size: 14px; font-family: monospace;">${doc._id}</p>
        </div>
      </div>
      <p style="margin: 16px 0 0 0; color: #4b5563;">Please review and respond to the user within 24 hours.</p>
    `
  });

  // Customer confirmation template
  const customerHtml = getEmailTemplate({
    title: 'Document Submission Confirmed',
    content: `
      <p style="margin: 0 0 16px 0; color: #4b5563;">Hi <strong>${doc.name}</strong>,</p>
      <p style="margin: 0 0 16px 0; color: #4b5563;">Thank you for submitting your documents for <strong>${doc.service}</strong>.</p>
      <div style="background: #f9fafb; padding: 16px; margin: 20px 0; border: 1px solid #e5e7eb;">
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Service</p>
        <p style="margin: 0 0 12px 0; color: #111827; font-weight: 600; font-size: 14px;">${doc.service}</p>
        
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Documents Uploaded</p>
        <p style="margin: 0 0 12px 0; color: #4b5563; font-size: 14px;">${doc.documents.length} file(s)</p>
        
        <p style="margin: 0 0 6px 0; color: #111827; font-weight: 600; font-size: 13px;">Reference ID</p>
        <p style="margin: 0; color: #4b5563; font-size: 14px; font-family: monospace;">${doc._id}</p>
      </div>
      <p style="margin: 16px 0; color: #4b5563;">Our team will review your documents and contact you within 24-48 hours.</p>
      <p style="margin: 20px 0 0 0; color: #4b5563;">Best regards,<br><strong style="color: #111827;">Team ReturnFilers</strong></p>
    `
  });

  try {
    // Send admin notification
    await sendEmail({
      to: adminEmailAddress,
      subject: `New Document Submission - ${doc.service} - ${doc.name}`,
      html: adminHtml
    });

    // Send customer confirmation
    await sendEmail({
      to: doc.email,
      subject: 'Document Submission Confirmed - ReturnFilers',
      html: customerHtml
    });

  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
  }
};

module.exports = {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument
};
