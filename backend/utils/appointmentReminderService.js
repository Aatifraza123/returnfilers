const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const { sendEmail } = require('./emailService');

/**
 * Automated Appointment Reminder Service
 * Sends reminders 24 hours before appointments
 */

/**
 * Send reminder email to customer
 */
const sendReminderEmail = async (appointment) => {
  const appointmentDate = new Date(appointment.appointmentDate).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const reminderHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0B1530 0%, #1a2b5e 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .reminder-box { background: white; padding: 25px; border-left: 5px solid #D4AF37; margin: 20px 0; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .time-badge { display: inline-block; background: #D4AF37; color: #0B1530; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; }
        .button { display: inline-block; padding: 14px 30px; background: #D4AF37; color: #0B1530; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 5px; }
        .button-secondary { background: #0B1530; color: white; }
        .footer { background: #f1f1f1; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
        .icon { font-size: 48px; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="icon">⏰</div>
          <h2 style="margin: 0;">Appointment Reminder</h2>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your appointment is tomorrow!</p>
        </div>
        <div class="content">
          <p>Dear ${appointment.name},</p>
          <p>This is a friendly reminder about your upcoming appointment with <strong>ReturnFilers</strong>.</p>
          
          <div class="reminder-box">
            <h3 style="margin-top: 0; color: #0B1530;">📅 Appointment Details</h3>
            <p style="margin: 10px 0;"><strong>Service:</strong> ${appointment.service}</p>
            <p style="margin: 10px 0;"><strong>Date:</strong> ${appointmentDate}</p>
            <p style="margin: 10px 0;"><strong>Time:</strong> <span class="time-badge">${appointment.appointmentTime}</span></p>
            <p style="margin: 10px 0;"><strong>Type:</strong> ${
              appointment.meetingType === 'online' 
                ? '💻 Online Meeting' 
                : appointment.meetingType === 'phone' 
                ? '📞 Phone Call' 
                : '🏢 In-Person'
            }</p>
            ${appointment.meetingLink ? `
              <p style="margin: 10px 0;"><strong>Meeting Link:</strong><br/>
              <a href="${appointment.meetingLink}" style="color: #D4AF37; word-break: break-all;">${appointment.meetingLink}</a></p>
            ` : ''}
          </div>

          <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;"><strong>⚠️ Important:</strong> Please be available 5 minutes before the scheduled time.</p>
          </div>

          <h4 style="color: #0B1530;">📋 What to Prepare:</h4>
          <ul style="line-height: 1.8;">
            <li>Relevant documents (if any)</li>
            <li>List of questions or concerns</li>
            <li>Previous financial records (if applicable)</li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            ${appointment.meetingLink ? `
              <a href="${appointment.meetingLink}" class="button">Join Meeting</a>
            ` : ''}
            <a href="tel:+918447127264" class="button button-secondary">Call Us: +91 84471 27264</a>
          </div>

          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <strong>Need to reschedule?</strong><br/>
            Please contact us at least 4 hours before your appointment:<br/>
            📞 +91 84471 27264 | 📧 info@returnfilers.in
          </p>
        </div>
        <div class="footer">
          <p style="margin: 5px 0;">We look forward to meeting you!</p>
          <p style="margin: 5px 0;">© ${new Date().getFullYear()} ReturnFilers. All rights reserved.</p>
          <p style="margin: 5px 0;">Professional CA Services | Tax & Financial Advisory</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await sendEmail({
      to: appointment.email,
      subject: `⏰ Reminder: Your appointment tomorrow at ${appointment.appointmentTime}`,
      html: reminderHtml
    });

    // Mark reminder as sent
    appointment.reminderSent = true;
    await appointment.save();

    console.log(`✅ Reminder sent to ${appointment.email} for appointment ${appointment._id}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send reminder to ${appointment.email}:`, error.message);
    return false;
  }
};

/**
 * Check and send reminders for appointments in next 24 hours
 */
const checkAndSendReminders = async () => {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Set time range: 24 hours from now (±1 hour buffer)
    const startTime = new Date(tomorrow);
    startTime.setHours(now.getHours() - 1, 0, 0, 0);
    
    const endTime = new Date(tomorrow);
    endTime.setHours(now.getHours() + 1, 59, 59, 999);

    // Find appointments that need reminders
    const appointments = await Appointment.find({
      appointmentDate: {
        $gte: startTime,
        $lte: endTime
      },
      status: { $in: ['pending', 'confirmed'] },
      reminderSent: false
    });

    if (appointments.length === 0) {
      console.log('📭 No appointments need reminders at this time');
      return;
    }

    console.log(`📧 Found ${appointments.length} appointment(s) needing reminders`);

    let sentCount = 0;
    for (const appointment of appointments) {
      const sent = await sendReminderEmail(appointment);
      if (sent) sentCount++;
      
      // Small delay between emails
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`✅ Sent ${sentCount}/${appointments.length} reminders successfully`);
  } catch (error) {
    console.error('❌ Error in reminder service:', error);
  }
};

/**
 * Start the automated reminder cron job
 * Runs every hour to check for appointments
 */
const startReminderService = () => {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', () => {
    console.log('🔔 Running appointment reminder check...');
    checkAndSendReminders();
  });

  console.log('✅ Appointment reminder service started (runs every hour)');
  
  // Run once immediately on startup
  setTimeout(() => {
    console.log('🔔 Initial reminder check on startup...');
    checkAndSendReminders();
  }, 5000); // Wait 5 seconds after server start
};

/**
 * Manual trigger for testing
 */
const triggerRemindersNow = async () => {
  console.log('🔔 Manually triggering reminder check...');
  await checkAndSendReminders();
};

module.exports = {
  startReminderService,
  checkAndSendReminders,
  sendReminderEmail,
  triggerRemindersNow
};
