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
    console.log('Data:', { name, email, phone, service, documentsCount: documents?.length });

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

    // Create document submission
    const doc = await Document.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.replace(/\D/g, ''),
      service: service.trim(),
      message: message?.trim() || '',
      documents: documents
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
  const adminEmailAddress = process.env.EMAIL_USER || 'razaaatif658@gmail.com';

  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px;">
              <tr>
                <td style="background-color: #0B1530; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="color: #D4AF37; margin: 0;">New Document Submission</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px;">
                  <table width="100%" cellpadding="8">
                    <tr><td style="color: #666;"><strong>Name:</strong></td><td>${doc.name}</td></tr>
                    <tr><td style="color: #666;"><strong>Email:</strong></td><td>${doc.email}</td></tr>
                    <tr><td style="color: #666;"><strong>Phone:</strong></td><td>${doc.phone}</td></tr>
                    <tr><td style="color: #666;"><strong>Service:</strong></td><td>${doc.service}</td></tr>
                    <tr><td style="color: #666;"><strong>Documents:</strong></td><td>${doc.documents.length} file(s)</td></tr>
                    ${doc.message ? `<tr><td style="color: #666;"><strong>Message:</strong></td><td>${doc.message}</td></tr>` : ''}
                  </table>
                  <p style="margin-top: 20px; color: #666; font-size: 12px;">Reference ID: ${doc._id}</p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #0B1530; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
                  <p style="color: #D4AF37; margin: 0; font-weight: bold;">Tax Filer</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    await sendEmail({
      to: adminEmailAddress,
      subject: `New Document Submission - ${doc.service} - ${doc.name}`,
      html: adminHtml
    });
    console.log('Admin notification email sent');
  } catch (error) {
    console.error('Email sending failed:', error.message);
  }
};

module.exports = {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument
};
