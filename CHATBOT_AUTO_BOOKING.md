# 🤖 AI Chatbot Auto-Booking Feature

## Overview
AI Chatbot ab automatically booking kar sakta hai jab user apna details provide kare. Fully automated system with email confirmations!

---

## ✨ Features

### 1. Smart Detail Detection
- **Email Detection**: Automatically extracts email from message
- **Phone Detection**: Extracts Indian phone numbers (+91, 91, or 10-digit)
- **Name Extraction**: Identifies name from phrases like "my name is", "I am", "mera naam"
- **Service Detection**: Matches service from available services list

### 2. Auto-Booking Process
```
User: "I want to book ITR filing. My name is Rahul, email rahul@gmail.com, phone 9876543210"
↓
AI detects: ✅ Email, ✅ Phone, ✅ Name, ✅ Service
↓
Automatically books appointment with best available slot
↓
Sends confirmation email to user
↓
Sends notification to admin
↓
Creates lead with high score
↓
Schedules reminder 24 hours before appointment
```

### 3. Email Confirmations
**Customer Email:**
- Appointment details (service, date, time)
- Meeting type (online/phone/in-person)
- Meeting link (if online)
- Contact information
- Reschedule instructions

**Admin Email:**
- Customer details
- Appointment details
- Booking source (AI Chatbot)
- Priority notification

---

## 🎯 How It Works

### User Side (Chatbot)

**Step 1: User expresses booking intent**
```
User: "I want to book"
User: "booking karna hai"
User: "appointment chahiye"
```

**Step 2: AI asks for details**
```
AI: "I can book your appointment right away! Please share:
- Your name
- Email address
- Phone number
- Which service you need

Example: 'My name is Rahul, email rahul@gmail.com, phone 9876543210, I need ITR filing'"
```

**Step 3: User provides details**
```
User: "My name is Priya, email priya@gmail.com, phone 9123456789, I need GST registration"
```

**Step 4: Auto-booking happens**
```
AI: "🎉 Great! Your appointment has been booked successfully!

📅 Booking Details:
- Service: GST Registration
- Date: 10 February 2026
- Time: 10:00 AM

✅ Confirmation email sent to priya@gmail.com

We'll send you a reminder 24 hours before your appointment. Looking forward to serving you! 😊"
```

---

## 💻 Technical Implementation

### Backend Detection Logic

```javascript
// Extract email
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const extractedEmail = message.match(emailRegex)?.[0];

// Extract phone (Indian numbers)
const phoneRegex = /(?:\+91|91)?[\s-]?[6-9]\d{9}/;
const extractedPhone = message.match(phoneRegex)?.[0]?.replace(/[\s-]/g, '');

// Extract name
const nameMatch = message.match(/(?:my name is|i am|naam|mera naam)\s+([a-zA-Z\s]+)/i);
const extractedName = nameMatch ? nameMatch[1].trim() : 'Chatbot User';

// Detect booking intent
const bookingKeywords = ['book', 'booking', 'appointment', 'schedule', 'reserve', 'karna hai', 'chahiye'];
const isBookingIntent = bookingKeywords.some(keyword => message.toLowerCase().includes(keyword));
```

### Auto-Booking Flow

```javascript
if (isBookingIntent && extractedEmail && extractedPhone) {
  // 1. Auto-book appointment
  const bookingResult = await autoBookAppointment({
    name: extractedName,
    email: extractedEmail,
    phone: extractedPhone,
    service: serviceMatch,
    message: `Booked via AI Chatbot: ${message}`
  });

  // 2. Capture lead with high score
  await captureLeadFromForm({
    name: extractedName,
    email: extractedEmail,
    phone: extractedPhone,
    source: 'chatbot',
    service: serviceMatch,
    message: message
  });

  // 3. Return success message
  return res.json({
    success: true,
    response: `🎉 Appointment booked! Confirmation sent to ${extractedEmail}`,
    autoBooked: true
  });
}
```

---

## 📧 Email Templates

### Customer Confirmation Email
```
Subject: ✅ Appointment Confirmed - ReturnFilers

Dear [Name],

Your appointment has been successfully booked with ReturnFilers.

📅 Appointment Details:
- Service: [Service Name]
- Date: [Date]
- Time: [Time]
- Type: Online Meeting / Phone Call / In-Person

We'll send you a reminder 24 hours before your appointment.

If you need to reschedule, please contact us at +91 84471 27264

Looking forward to serving you!

Best regards,
Team ReturnFilers
```

### Admin Notification Email
```
Subject: 🔔 New Appointment: [Name] - [Date] [Time]

New appointment booked via AI Chatbot:

Customer Details:
- Name: [Name]
- Email: [Email]
- Phone: [Phone]

Appointment Details:
- Service: [Service]
- Date: [Date]
- Time: [Time]
- Booked By: AI Chatbot

Message: [User's original message]
```

---

## 🎨 Example Conversations

### Example 1: Complete Details in One Message
```
User: "Hi, I want to book ITR filing. My name is Amit Kumar, email amit.kumar@gmail.com, phone 9876543210"

AI: "🎉 Great! Your appointment has been booked successfully!

📅 Booking Details:
- Service: ITR Filing
- Date: 8 February 2026
- Time: 2:00 PM

✅ Confirmation email sent to amit.kumar@gmail.com

We'll send you a reminder 24 hours before your appointment. Looking forward to serving you! 😊"
```

### Example 2: Step-by-Step Details
```
User: "I want to book GST registration"

AI: "Great choice! I can book your appointment instantly. Please share your:
- Name
- Email
- Phone number

Example: 'My name is Priya, email priya@gmail.com, phone 9876543210'"

User: "My name is Priya Sharma, email priya.sharma@yahoo.com, phone +91 9123456789"

AI: "🎉 Perfect! Your appointment is booked!

📅 Booking Details:
- Service: GST Registration
- Date: 9 February 2026
- Time: 11:30 AM

✅ Confirmation email sent to priya.sharma@yahoo.com

Check your email for complete details. We'll remind you 24 hours before! 😊"
```

### Example 3: Hindi/Hinglish
```
User: "booking karna hai ITR filing ka. Mera naam Rahul hai, email rahul123@gmail.com, phone 9988776655"

AI: "🎉 Bahut badhiya! Aapka appointment book ho gaya hai!

📅 Booking Details:
- Service: ITR Filing
- Date: 10 February 2026
- Time: 3:30 PM

✅ Confirmation email bhej diya gaya hai rahul123@gmail.com par

Appointment se 24 ghante pehle reminder milega. Thank you! 😊"
```

---

## 🔄 Complete Automation Flow

```
User provides details in chatbot
↓
Backend detects email + phone + name
↓
Checks available slots (Mon-Fri 9am-6pm, Sat 10am-2pm)
↓
Books best available 30-min slot
↓
Creates appointment in database
↓
Sends confirmation email to customer
↓
Sends notification email to admin
↓
Creates lead with source='chatbot'
↓
Calculates lead score (chatbot=10 + appointment_book=20 = 30 points)
↓
Assigns priority based on score
↓
Schedules follow-up email
↓
Schedules reminder 24 hours before appointment
↓
✅ DONE - Fully automated!
```

---

## 📊 Lead Scoring for Chatbot Bookings

**Base Score:**
- Source (chatbot): 10 points
- Activity (appointment_book): 20 points
- **Total**: 30 points → MEDIUM priority

**Follow-up Schedule:**
- Medium priority: 7 days
- Max follow-ups: 5

**Lead Status:**
- Initial: "new"
- After booking: "contacted"
- After confirmation: "qualified"

---

## 🎯 Benefits

### For Users:
✅ Instant booking without leaving chat
✅ No need to fill forms
✅ Natural conversation
✅ Immediate confirmation
✅ Email with all details
✅ Automatic reminders

### For Business:
✅ Higher conversion rate
✅ Reduced manual work
✅ Automatic lead capture
✅ Better customer experience
✅ 24/7 booking availability
✅ Detailed analytics

---

## 🔧 Configuration

### Required Environment Variables
```env
# AI Services
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key

# Email Service
EMAIL_USER=info@returnfilers.in
EMAIL_PASS=your_password
EMAIL_HOST=smtp.zoho.in
EMAIL_PORT=465

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=your_mongodb_uri
```

### Business Hours (Configurable)
```javascript
Monday-Friday: 9:00 AM - 6:00 PM
Saturday: 10:00 AM - 2:00 PM
Sunday: Closed
Slot Duration: 30 minutes
```

---

## 🧪 Testing

### Test Auto-Booking
1. Open chatbot on website
2. Type: "I want to book ITR filing. My name is Test User, email test@example.com, phone 9876543210"
3. Check response for booking confirmation
4. Check email for confirmation
5. Check admin dashboard for new appointment
6. Check leads dashboard for new lead

### Test Different Formats
```
✅ "My name is Rahul, email rahul@gmail.com, phone 9876543210, need GST registration"
✅ "I am Priya, priya@yahoo.com, +91 9123456789, ITR filing chahiye"
✅ "Amit here, amit.k@outlook.com, 9988776655, company registration"
✅ "booking karna hai, naam Raj, email raj@gmail.com, phone 9876543210"
```

---

## 📈 Analytics

### Track in Admin Dashboard:
- Total chatbot bookings
- Conversion rate (chat → booking)
- Lead scores from chatbot
- Popular services via chatbot
- Peak booking times

### View in `/admin/leads`:
- Filter by source: "chatbot"
- See all chatbot-generated leads
- Track follow-up status
- Monitor conversion to customers

---

## 🚀 Future Enhancements

### Planned Features:
1. **Multi-language support** (Hindi, English, Hinglish)
2. **Voice input** for booking
3. **WhatsApp integration** for confirmations
4. **Calendar integration** (Google Calendar, Outlook)
5. **Payment integration** for advance booking
6. **Rescheduling via chatbot**
7. **Document upload** in chat
8. **Video call scheduling**

---

## 📞 Support

For issues or questions:
- Email: info@returnfilers.in
- Phone: +91 84471 27264
- WhatsApp: +91 84471 27264

---

## ✅ Summary

AI Chatbot ab fully automated booking system hai:
- ✅ User details automatically detect karta hai
- ✅ Best available slot book karta hai
- ✅ Confirmation email bhejta hai (customer + admin)
- ✅ Lead capture karta hai with scoring
- ✅ Reminder schedule karta hai
- ✅ Follow-up emails automatic bhejta hai

**Sab kuch automatic! User ko sirf details deni hai, baaki sab AI sambhal leta hai!** 🎉
