const Appointment = require('../models/Appointment');
const axios = require('axios');

/**
 * AI-Powered Booking Service
 * Automatically suggests and books appointments based on availability
 */

// Business hours configuration
const BUSINESS_HOURS = {
  weekdays: { start: '09:00', end: '18:00' }, // Mon-Fri
  saturday: { start: '10:00', end: '14:00' },
  sunday: null // Closed
};

// Time slot duration (minutes)
const SLOT_DURATION = 30;

/**
 * Generate available time slots for a given date
 */
const generateTimeSlots = (date) => {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Check if closed
  if (dayOfWeek === 0) return []; // Sunday closed
  
  const hours = dayOfWeek === 6 ? BUSINESS_HOURS.saturday : BUSINESS_HOURS.weekdays;
  if (!hours) return [];
  
  const slots = [];
  const [startHour, startMin] = hours.start.split(':').map(Number);
  const [endHour, endMin] = hours.end.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMin = startMin;
  
  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
    slots.push(timeStr);
    
    // Add slot duration
    currentMin += SLOT_DURATION;
    if (currentMin >= 60) {
      currentHour += Math.floor(currentMin / 60);
      currentMin = currentMin % 60;
    }
  }
  
  return slots;
};

/**
 * Get available slots for next N days
 */
const getAvailableSlots = async (daysAhead = 7) => {
  const availableSlots = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    // Skip if date is in the past
    if (date < new Date()) continue;
    
    const slots = generateTimeSlots(date);
    if (slots.length === 0) continue;
    
    // Get booked appointments for this date
    const bookedAppointments = await Appointment.find({
      appointmentDate: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      },
      status: { $in: ['pending', 'confirmed'] }
    }).select('appointmentTime');
    
    const bookedTimes = bookedAppointments.map(apt => apt.appointmentTime);
    
    // Filter out booked slots
    const availableTimesForDate = slots.filter(slot => !bookedTimes.includes(slot));
    
    if (availableTimesForDate.length > 0) {
      availableSlots.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        slots: availableTimesForDate
      });
    }
  }
  
  return availableSlots;
};

/**
 * Find best available slot (earliest available)
 */
const findBestSlot = async () => {
  const availableSlots = await getAvailableSlots(14); // Check next 2 weeks
  
  if (availableSlots.length === 0) {
    return null;
  }
  
  // Return first available slot
  const firstDay = availableSlots[0];
  return {
    date: firstDay.date,
    time: firstDay.slots[0],
    dayName: firstDay.dayName
  };
};

/**
 * AI suggests appointment slots based on customer message
 */
const suggestAppointmentSlots = async (message) => {
  try {
    const availableSlots = await getAvailableSlots(7);
    
    if (availableSlots.length === 0) {
      return {
        success: false,
        message: 'No available slots in the next 7 days. Please contact us directly.'
      };
    }
    
    // Get top 3 suggestions
    const suggestions = availableSlots.slice(0, 3).map(day => ({
      date: day.date,
      dayName: day.dayName,
      slots: day.slots.slice(0, 4) // Top 4 slots per day
    }));
    
    return {
      success: true,
      suggestions,
      message: 'Here are some available appointment slots:'
    };
    
  } catch (error) {
    console.error('Error suggesting slots:', error);
    return {
      success: false,
      message: 'Unable to fetch available slots. Please try again.'
    };
  }
};

/**
 * Auto-book appointment using AI
 */
const autoBookAppointment = async (customerData) => {
  try {
    const { name, email, phone, service, message, preferredDate, preferredTime } = customerData;
    
    let appointmentDate, appointmentTime;
    
    // If customer specified date/time, try to book that
    if (preferredDate && preferredTime) {
      const date = new Date(preferredDate);
      const slots = generateTimeSlots(date);
      
      // Check if slot is available
      const existingAppointment = await Appointment.findOne({
        appointmentDate: {
          $gte: new Date(date.setHours(0, 0, 0, 0)),
          $lt: new Date(date.setHours(23, 59, 59, 999))
        },
        appointmentTime: preferredTime,
        status: { $in: ['pending', 'confirmed'] }
      });
      
      if (!existingAppointment && slots.includes(preferredTime)) {
        appointmentDate = preferredDate;
        appointmentTime = preferredTime;
      }
    }
    
    // If no preferred time or not available, find best slot
    if (!appointmentDate || !appointmentTime) {
      const bestSlot = await findBestSlot();
      
      if (!bestSlot) {
        return {
          success: false,
          message: 'No available slots found. Please contact us directly.'
        };
      }
      
      appointmentDate = bestSlot.date;
      appointmentTime = bestSlot.time;
    }
    
    // Create appointment
    const appointment = await Appointment.create({
      name,
      email,
      phone,
      service: service || 'General Consultation',
      appointmentDate,
      appointmentTime,
      message: message || '',
      meetingType: 'online',
      bookedBy: 'ai-chatbot',
      status: 'pending'
    });
    
    console.log('✅ Auto-booked appointment:', appointment._id);
    
    return {
      success: true,
      appointment: {
        id: appointment._id,
        date: appointmentDate,
        time: appointmentTime,
        service: appointment.service
      },
      message: `Appointment booked successfully for ${new Date(appointmentDate).toLocaleDateString()} at ${appointmentTime}`
    };
    
  } catch (error) {
    console.error('❌ Auto-booking error:', error);
    return {
      success: false,
      message: 'Failed to book appointment. Please try again.'
    };
  }
};

/**
 * Parse customer message to detect booking intent
 */
const detectBookingIntent = (message) => {
  const bookingKeywords = [
    'book', 'appointment', 'schedule', 'meeting', 'consultation',
    'available', 'slot', 'time', 'date', 'meet', 'discuss'
  ];
  
  const lowerMessage = message.toLowerCase();
  return bookingKeywords.some(keyword => lowerMessage.includes(keyword));
};

/**
 * Extract date/time from message using simple parsing
 */
const extractDateTime = (message) => {
  // Simple date patterns (can be enhanced with NLP)
  const datePatterns = [
    /tomorrow/i,
    /next (monday|tuesday|wednesday|thursday|friday|saturday)/i,
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,
  ];
  
  const timePatterns = [
    /(\d{1,2}):(\d{2})\s*(am|pm)?/i,
    /(\d{1,2})\s*(am|pm)/i
  ];
  
  let date = null;
  let time = null;
  
  // Extract date
  for (const pattern of datePatterns) {
    const match = message.match(pattern);
    if (match) {
      if (match[0].toLowerCase() === 'tomorrow') {
        date = new Date();
        date.setDate(date.getDate() + 1);
      }
      // Add more date parsing logic as needed
      break;
    }
  }
  
  // Extract time
  for (const pattern of timePatterns) {
    const match = message.match(pattern);
    if (match) {
      time = match[0];
      break;
    }
  }
  
  return { date, time };
};

module.exports = {
  getAvailableSlots,
  suggestAppointmentSlots,
  autoBookAppointment,
  detectBookingIntent,
  extractDateTime,
  findBestSlot
};
