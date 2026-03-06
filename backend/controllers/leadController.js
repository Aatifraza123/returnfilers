const Lead = require('../models/Lead');
const { captureLeadFromForm, trackLeadActivity, sendFollowUpEmail } = require('../utils/leadScoringService');

/**
 * @desc    Get all leads
 * @route   GET /api/leads
 * @access  Private/Admin
 */
const getLeads = async (req, res) => {
  try {
    const { status, priority, source } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (source) query.source = source;
    
    const leads = await Lead.find(query)
      .sort({ score: -1, createdAt: -1 })
      .select('-__v');
    
    res.json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leads'
    });
  }
};

/**
 * @desc    Get single lead
 * @route   GET /api/leads/:id
 * @access  Private/Admin
 */
const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lead'
    });
  }
};

/**
 * @desc    Create lead manually
 * @route   POST /api/leads
 * @access  Private/Admin
 */
const createLead = async (req, res) => {
  try {
    const { name, email, phone, source, interestedServices, budget, notes, service, message } = req.body;
    
    // Check if lead exists
    const existingLead = await Lead.findOne({ email: email.toLowerCase().trim() });
    if (existingLead) {
      return res.status(400).json({
        success: false,
        message: 'Lead with this email already exists'
      });
    }
    
    const lead = await Lead.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.replace(/\D/g, '') || '',
      source: source || 'manual',
      interestedServices: service ? [service] : (interestedServices || []),
      budget: budget || 'not-specified',
      notes: message || notes || ''
    });
    
    lead.calculateScore();
    await lead.save();
    
    // Send confirmation email to user
    setImmediate(async () => {
      try {
        const { sendEmail } = require('../utils/emailService');
        
        // User confirmation email
        const userHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #0B1530; color: white; padding: 20px; text-align: center; }
              .content { background: #f9f9f9; padding: 30px; }
              .button { display: inline-block; padding: 12px 30px; background: #D4AF37; color: #0B1530; text-decoration: none; border-radius: 5px; font-weight: bold; }
              .footer { background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>✅ Thank You for Contacting Us!</h2>
              </div>
              <div class="content">
                <p>Dear ${name},</p>
                <p>Thank you for reaching out to ReturnFilers. We have received your inquiry and our team will get back to you within 24 hours.</p>
                
                <div style="background: white; padding: 20px; border-left: 4px solid #D4AF37; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #0B1530;">Your Details</h3>
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Phone:</strong> ${phone}</p>
                  ${service ? `<p><strong>Service:</strong> ${service}</p>` : ''}
                  ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
                </div>
                
                <p>In the meantime, feel free to explore our services or call us directly at <strong>+91 84471 27264</strong></p>
                
                <p style="text-align: center; margin-top: 30px;">
                  <a href="${process.env.FRONTEND_URL || 'https://www.returnfilers.in'}/services" class="button">View Our Services</a>
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
                <h2>🔔 New Lead from ${source || 'Website'}</h2>
              </div>
              <div class="content">
                <div class="details">
                  <h3>Lead Details</h3>
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Phone:</strong> ${phone}</p>
                  <p><strong>Source:</strong> ${source || 'Manual'}</p>
                  ${service ? `<p><strong>Service:</strong> ${service}</p>` : ''}
                  ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
                  <p><strong>Score:</strong> ${lead.score}/100</p>
                  <p><strong>Priority:</strong> ${lead.priority}</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;
        
        // Send to user
        await sendEmail({
          to: email,
          subject: '✅ Thank You for Contacting ReturnFilers',
          html: userHtml
        });
        
        // Send to admin
        await sendEmail({
          to: process.env.ADMIN_EMAIL || 'info@returnfilers.in',
          subject: `🔔 New Lead: ${name} - ${source || 'Website'}`,
          html: adminHtml
        });
        
        console.log('✅ Lead confirmation emails sent');
      } catch (err) {
        console.error('❌ Failed to send lead emails:', err);
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create lead'
    });
  }
};

/**
 * @desc    Update lead
 * @route   PATCH /api/leads/:id
 * @access  Private/Admin
 */
const updateLead = async (req, res) => {
  try {
    const { status, priority, budget, notes, assignedTo, interestedServices, tags } = req.body;
    
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    // Update fields
    if (status) lead.status = status;
    if (priority) lead.priority = priority;
    if (budget) lead.budget = budget;
    if (notes !== undefined) lead.notes = notes;
    if (assignedTo) lead.assignedTo = assignedTo;
    if (interestedServices) lead.interestedServices = interestedServices;
    if (tags) lead.tags = tags;
    
    // If status changed to won, mark as converted
    if (status === 'won' && !lead.convertedToCustomer) {
      lead.convertedToCustomer = true;
      lead.conversionDate = new Date();
    }
    
    // Recalculate score
    lead.calculateScore();
    await lead.save();
    
    res.json({
      success: true,
      message: 'Lead updated successfully',
      data: lead
    });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update lead'
    });
  }
};

/**
 * @desc    Add activity to lead
 * @route   POST /api/leads/:id/activity
 * @access  Private/Admin
 */
const addLeadActivity = async (req, res) => {
  try {
    const { type, description, metadata } = req.body;
    
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    lead.addActivity(type, description, metadata);
    await lead.save();
    
    res.json({
      success: true,
      message: 'Activity added successfully',
      data: lead
    });
  } catch (error) {
    console.error('Add activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add activity'
    });
  }
};

/**
 * @desc    Send follow-up email to lead
 * @route   POST /api/leads/:id/follow-up
 * @access  Private/Admin
 */
const sendLeadFollowUp = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    const sent = await sendFollowUpEmail(lead);
    
    if (sent) {
      res.json({
        success: true,
        message: 'Follow-up email sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send follow-up email'
      });
    }
  } catch (error) {
    console.error('Send follow-up error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send follow-up'
    });
  }
};

/**
 * @desc    Delete lead
 * @route   DELETE /api/leads/:id
 * @access  Private/Admin
 */
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete lead'
    });
  }
};

/**
 * @desc    Get lead statistics
 * @route   GET /api/leads/stats
 * @access  Private/Admin
 */
const getLeadStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'new' });
    const qualifiedLeads = await Lead.countDocuments({ status: 'qualified' });
    const convertedLeads = await Lead.countDocuments({ convertedToCustomer: true });
    
    const priorityBreakdown = await Lead.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    
    const sourceBreakdown = await Lead.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);
    
    const avgScore = await Lead.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$score' } } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalLeads,
        newLeads,
        qualifiedLeads,
        convertedLeads,
        conversionRate: totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : 0,
        averageScore: avgScore[0]?.avgScore?.toFixed(2) || 0,
        priorityBreakdown,
        sourceBreakdown
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  addLeadActivity,
  sendLeadFollowUp,
  deleteLead,
  getLeadStats
};
