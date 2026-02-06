const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const { sendEmail } = require('./emailService');
const { getEmailTemplate } = require('./emailTemplates-automation');

/**
 * Automated Appointment Reminder Service
 * Sends reminders 24 hours before appointments
 */

/**
 * Send reminder email to customer
 */
const sendReminderEmail = async (appointment) => {
  try {
    const emailData = getEmailTemplate('appointmentReminder', appointment);
    
    await sendEmail({
      to: appointment.email,
      subject: emailData.subject,
      html: emailData.html
    });

    // Mark reminder as sent
    appointment.reminderSent = true;
    await appointment.save();

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
