const Lead = require('../models/Lead');
const cron = require('node-cron');
const { sendEmail } = require('./emailService');

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
      console.log(`📊 Updating existing lead: ${email}`);
      
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

      console.log(`✅ Lead updated: ${lead.email} | Score: ${lead.score} | Priority: ${lead.priority}`);
      return lead;
    } else {
      // Create new lead
      console.log(`🆕 Creating new lead: ${email}`);
      
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

      console.log(`✅ New lead created: ${lead.email} | Score: ${lead.score} | Priority: ${lead.priority}`);
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
      console.log(`⚠️ Lead not found for activity tracking: ${email}`);
      return null;
    }

    lead.addActivity(activityType, description, metadata);
    await lead.save();

    console.log(`📊 Activity tracked for ${email}: ${activityType} | New score: ${lead.score}`);
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
  const followUpTemplates = {
    urgent: {
      subject: '🔥 Exclusive Offer: Let\'s Get Started Today!',
      content: `
        <p>Dear ${lead.name},</p>
        <p>Thank you for your interest in our services! We noticed you're looking for <strong>${lead.interestedServices.join(', ')}</strong>.</p>
        <p>As a valued potential client, we'd like to offer you a <strong>complimentary 30-minute consultation</strong> to discuss your specific needs.</p>
        <p><strong>Why choose ReturnFilers?</strong></p>
        <ul>
          <li>✅ Expert CA professionals with 10+ years experience</li>
          <li>✅ Fast turnaround time</li>
          <li>✅ Transparent pricing</li>
          <li>✅ Dedicated support</li>
        </ul>
        <p>Book your free consultation now: <a href="${process.env.FRONTEND_URL}/appointment">Schedule Appointment</a></p>
        <p>Or call us directly: <strong>+91 84471 27264</strong></p>
      `
    },
    high: {
      subject: '💼 Ready to Help with Your ${lead.interestedServices[0] || "Business"} Needs',
      content: `
        <p>Dear ${lead.name},</p>
        <p>We received your inquiry about <strong>${lead.interestedServices.join(', ')}</strong> and would love to help!</p>
        <p>Our team specializes in providing comprehensive solutions tailored to your needs.</p>
        <p><strong>Next Steps:</strong></p>
        <ol>
          <li>Schedule a free consultation: <a href="${process.env.FRONTEND_URL}/appointment">Book Now</a></li>
          <li>Get a custom quote: <a href="${process.env.FRONTEND_URL}/quote">Request Quote</a></li>
          <li>Call us: +91 84471 27264</li>
        </ol>
        <p>We're here to make your financial management seamless!</p>
      `
    },
    medium: {
      subject: '📊 Your Financial Success Starts Here',
      content: `
        <p>Dear ${lead.name},</p>
        <p>Thank you for reaching out to ReturnFilers!</p>
        <p>We understand that managing ${lead.interestedServices.join(', ')} can be complex. That's why we're here to help.</p>
        <p><strong>Explore our services:</strong></p>
        <ul>
          <li>Tax Filing & Planning</li>
          <li>GST Registration & Returns</li>
          <li>Company Registration</li>
          <li>Accounting & Bookkeeping</li>
        </ul>
        <p>Visit our website: <a href="${process.env.FRONTEND_URL}/services">View All Services</a></p>
        <p>Have questions? Reply to this email or call +91 84471 27264</p>
      `
    },
    low: {
      subject: '📧 Stay Updated with ReturnFilers',
      content: `
        <p>Dear ${lead.name},</p>
        <p>Thanks for your interest in ReturnFilers!</p>
        <p>We're here whenever you need professional CA services.</p>
        <p><strong>Stay connected:</strong></p>
        <ul>
          <li>📱 Follow us for tax tips and updates</li>
          <li>📧 Subscribe to our newsletter</li>
          <li>🌐 Visit our blog for helpful articles</li>
        </ul>
        <p>When you're ready, we're just a call away: +91 84471 27264</p>
      `
    }
  };

  const template = followUpTemplates[lead.priority] || followUpTemplates.medium;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0B1530 0%, #1a2b5e 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; }
        .priority-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 20px; }
        .urgent { background: #ff4444; color: white; }
        .high { background: #ff9800; color: white; }
        .medium { background: #2196F3; color: white; }
        .low { background: #4CAF50; color: white; }
        .button { display: inline-block; padding: 12px 30px; background: #D4AF37; color: #0B1530; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 5px; }
        .footer { background: #f1f1f1; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        ul, ol { line-height: 1.8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>ReturnFilers</h2>
          <p>Professional CA Services</p>
        </div>
        <div class="content">
          <span class="priority-badge ${lead.priority}">${lead.priority.toUpperCase()} PRIORITY</span>
          ${template.content}
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/appointment" class="button">Book Consultation</a>
            <a href="${process.env.FRONTEND_URL}/services" class="button" style="background: #0B1530; color: white;">View Services</a>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ReturnFilers. All rights reserved.</p>
          <p>📞 +91 84471 27264 | 📧 info@returnfilers.in</p>
          <p><a href="${process.env.FRONTEND_URL}/api/newsletter/unsubscribe/${encodeURIComponent(lead.email)}" style="color: #666;">Unsubscribe</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await sendEmail({
      to: lead.email,
      subject: template.subject,
      html
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
    
    const nextFollowUp = new Date();
    nextFollowUp.setDate(nextFollowUp.getDate() + followUpDays[lead.priority]);
    lead.nextFollowUpDate = nextFollowUp;

    await lead.save();

    console.log(`✅ Follow-up email sent to ${lead.email} | Priority: ${lead.priority}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send follow-up to ${lead.email}:`, error);
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
      console.log('📭 No leads need follow-up today');
      return;
    }

    console.log(`📧 Found ${leads.length} lead(s) needing follow-up`);

    let sentCount = 0;
    for (const lead of leads) {
      const sent = await sendFollowUpEmail(lead);
      if (sent) sentCount++;
      
      // Delay between emails
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(`✅ Sent ${sentCount}/${leads.length} follow-up emails`);
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
