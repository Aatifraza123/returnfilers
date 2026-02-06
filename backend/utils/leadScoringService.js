const Lead = require('../models/Lead');
const cron = require('node-cron');
const { sendEmail } = require('./emailService');
const { getEmailTemplate } = require('./emailTemplates-automation');

/**
 * Smart Lead Scoring & Auto Follow-up Service
 * Automatically captures, scores, and follows up with leads
 */

/**
 * Create or update lead from form submission
 */
const captureLeadFromForm = async (data) => {
  try {
    const { name, email, phone, source, service, budget, message } = data;

    // Check if lead already exists
    let lead = await Lead.findOne({ email: email.toLowerCase().trim() });

    if (lead) {
      // Update existing lead
      
      // Add new activity
      lead.addActivity('form_submit', `Submitted ${source} form`, {
        service: service || 'Not specified',
        message: message?.substring(0, 100) || ''
      });

      // Update interested services
      if (service && !lead.interestedServices.includes(service)) {
        lead.interestedServices.push(service);
      }

      // Update budget if provided and higher than current
      if (budget && budget !== 'not-specified') {
        const budgetPriority = {
          'above-5lakh': 5,
          '1lakh-5lakh': 4,
          '50k-1lakh': 3,
          '10k-50k': 2,
          'under-10k': 1,
          'not-specified': 0
        };
        
        if (budgetPriority[budget] > budgetPriority[lead.budget]) {
          lead.budget = budget;
        }
      }

      // Update phone if not set
      if (phone && !lead.phone) {
        lead.phone = phone;
      }

      // Recalculate score
      lead.calculateScore();
      await lead.save();

      return lead;
    } else {
      // Create new lead
      
      lead = await Lead.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.replace(/\D/g, '') || '',
        source,
        interestedServices: service ? [service] : [],
        budget: budget || 'not-specified',
        activities: [{
          type: 'form_submit',
          description: `Submitted ${source} form`,
          timestamp: new Date(),
          metadata: {
            service: service || 'Not specified',
            message: message?.substring(0, 100) || ''
          }
        }]
      });

      // Calculate initial score
      lead.calculateScore();
      await lead.save();

      return lead;
    }
  } catch (error) {
    console.error('❌ Lead capture error:', error);
    throw error;
  }
};

/**
 * Track lead activity (page visit, email open, etc.)
 */
const trackLeadActivity = async (email, activityType, description, metadata = {}) => {
  try {
    const lead = await Lead.findOne({ email: email.toLowerCase().trim() });
    
    if (!lead) {
      return null;
    }

    lead.addActivity(activityType, description, metadata);
    await lead.save();

    return lead;
  } catch (error) {
    console.error('❌ Activity tracking error:', error);
    return null;
  }
};

/**
 * Send follow-up email based on lead priority
 */
const sendFollowUpEmail = async (lead) => {
  try {
    const emailData = getEmailTemplate('leadFollowup', {
      name: lead.name,
      email: lead.email,
      priority: lead.priority,
      service: lead.interestedServices[0] || 'our services',
      createdAt: lead.createdAt
    });

    await sendEmail({
      to: lead.email,
      subject: emailData.subject,
      html: emailData.html
    });

    // Update lead
    lead.lastContactDate = new Date();
    lead.followUpCount += 1;
    
    // Set next follow-up based on priority
    const followUpDays = {
      urgent: 1,
      high: 3,
      medium: 7,
      low: 14
    };
    
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + followUpDays[lead.priority]);
    lead.nextFollowUpDate = nextDate;

    // Add activity
    lead.addActivity('email_sent', `Follow-up email sent (${lead.priority} priority)`);

    await lead.save();

    return true;
  } catch (error) {
    console.error(`❌ Failed to send follow-up to ${lead.email}:`, error.message);
    return false;
  }
};

/**
 * Auto follow-up cron job
 * Runs daily to send follow-ups to leads
 */
const checkAndSendFollowUps = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find leads that need follow-up today
    const leads = await Lead.find({
      nextFollowUpDate: {
        $gte: today,
        $lt: tomorrow
      },
      status: { $in: ['new', 'contacted'] },
      convertedToCustomer: false,
      followUpCount: { $lt: 5 } // Max 5 follow-ups
    }).sort({ score: -1 }); // Prioritize high-score leads

    if (leads.length === 0) {
      return;
    }

    let sentCount = 0;
    for (const lead of leads) {
      const sent = await sendFollowUpEmail(lead);
      if (sent) sentCount++;
      
      // Delay between emails
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

  } catch (error) {
    console.error('❌ Follow-up service error:', error);
  }
};

/**
 * Start automated follow-up service
 */
const startFollowUpService = () => {
  // Run daily at 10 AM
  cron.schedule('0 10 * * *', () => {
    console.log('🔔 Running daily lead follow-up check...');
    checkAndSendFollowUps();
  });

  console.log('✅ Lead follow-up service started (runs daily at 10 AM)');
  
  // Initial check on startup (after 10 seconds)
  setTimeout(() => {
    console.log('🔔 Initial follow-up check on startup...');
    checkAndSendFollowUps();
  }, 10000);
};

/**
 * Manual trigger for testing
 */
const triggerFollowUpsNow = async () => {
  console.log('🔔 Manually triggering follow-up check...');
  await checkAndSendFollowUps();
};

module.exports = {
  captureLeadFromForm,
  trackLeadActivity,
  sendFollowUpEmail,
  startFollowUpService,
  checkAndSendFollowUps,
  triggerFollowUpsNow
};
