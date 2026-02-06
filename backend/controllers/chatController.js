const axios = require('axios');
const Service = require('../models/serviceModel');
const DigitalService = require('../models/DigitalService');
const Testimonial = require('../models/testimonialModel');
const Blog = require('../models/blogModel');
const Pricing = require('../models/Pricing');
const Settings = require('../models/settingsModel');

// Cache (refresh every 5 minutes for website data, 30 min for news)
let dataCache = { services: null, digitalServices: null, testimonials: null, blogs: null, pricing: null, settings: null, news: null };
let cacheTime = { services: 0, digitalServices: 0, testimonials: 0, blogs: 0, pricing: 0, settings: 0, news: 0 };
const CACHE_DURATION = 5 * 60 * 1000;
const NEWS_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes for news

// Fetch services
const getServices = async () => {
  const now = Date.now();
  if (dataCache.services && (now - cacheTime.services) < CACHE_DURATION) return dataCache.services;
  try {
    dataCache.services = await Service.find({ active: true }).select('title price timeline category description');
    cacheTime.services = now;
  } catch (e) { console.log('Services fetch error'); }
  return dataCache.services || [];
};

// Fetch digital services
const getDigitalServices = async () => {
  const now = Date.now();
  if (dataCache.digitalServices && (now - cacheTime.digitalServices) < CACHE_DURATION) return dataCache.digitalServices;
  try {
    dataCache.digitalServices = await DigitalService.find({ active: true }).select('title description packages');
    cacheTime.digitalServices = now;
  } catch (e) { console.log('Digital services fetch error'); }
  return dataCache.digitalServices || [];
};

// Fetch testimonials
const getTestimonials = async () => {
  const now = Date.now();
  if (dataCache.testimonials && (now - cacheTime.testimonials) < CACHE_DURATION) return dataCache.testimonials;
  try {
    dataCache.testimonials = await Testimonial.find({ isActive: true }).select('name title quote rating').limit(5);
    cacheTime.testimonials = now;
  } catch (e) { console.log('Testimonials fetch error'); }
  return dataCache.testimonials || [];
};

// Fetch blogs
const getBlogs = async () => {
  const now = Date.now();
  if (dataCache.blogs && (now - cacheTime.blogs) < CACHE_DURATION) return dataCache.blogs;
  try {
    dataCache.blogs = await Blog.find({ isPublished: true }).select('title category').sort({ createdAt: -1 }).limit(5);
    cacheTime.blogs = now;
  } catch (e) { console.log('Blogs fetch error'); }
  return dataCache.blogs || [];
};

// Fetch pricing
const getPricing = async () => {
  const now = Date.now();
  if (dataCache.pricing && (now - cacheTime.pricing) < CACHE_DURATION) return dataCache.pricing;
  try {
    dataCache.pricing = await Pricing.find({ active: true }).select('category categoryTitle name price description features billingCycle popular').sort({ order: 1 });
    cacheTime.pricing = now;
  } catch (e) { console.log('Pricing fetch error'); }
  return dataCache.pricing || [];
};

// Fetch settings
const getSettings = async () => {
  const now = Date.now();
  if (dataCache.settings && (now - cacheTime.settings) < CACHE_DURATION) return dataCache.settings;
  try {
    dataCache.settings = await Settings.findOne().select('companyName email phone whatsapp businessHours about hero footer');
    cacheTime.settings = now;
  } catch (e) { console.log('Settings fetch error'); }
  return dataCache.settings || {};
};

// Fetch tax/finance news from GNews API (free)
const getTaxNews = async () => {
  const now = Date.now();
  if (dataCache.news && (now - cacheTime.news) < NEWS_CACHE_DURATION) return dataCache.news;
  
  try {
    // Using GNews free API - 100 requests/day
    const response = await axios.get('https://gnews.io/api/v4/search', {
      params: {
        q: 'GST OR "income tax" OR ITR OR "tax filing" India',
        lang: 'en',
        country: 'in',
        max: 5,
        apikey: process.env.GNEWS_API_KEY || '0e5e5c5c5c5c5c5c5c5c5c5c5c5c5c5c' // fallback dummy
      },
      timeout: 5000
    });
    
    if (response.data?.articles) {
      dataCache.news = response.data.articles.map(a => ({
        title: a.title,
        source: a.source?.name,
        date: new Date(a.publishedAt).toLocaleDateString('en-IN')
      }));
      cacheTime.news = now;
    }
  } catch (e) { 
    console.log('News fetch error:', e.message);
    // Fallback to static important dates
    dataCache.news = [
      { title: 'ITR Filing Deadline: July 31, 2025 (for individuals)', source: 'Income Tax Dept', date: 'Important' },
      { title: 'GST Returns: 11th (GSTR-1), 20th (GSTR-3B) of each month', source: 'GST Portal', date: 'Monthly' },
      { title: 'Advance Tax: 15th June, Sept, Dec, March', source: 'Income Tax Dept', date: 'Quarterly' }
    ];
  }
  return dataCache.news || [];
};

// Format data for prompt
const formatServices = (services) => {
  if (!services?.length) return '(Contact us for services)';
  return services.map(s => {
    let line = `- ${s.title}: ₹${s.price} (${s.timeline || '3-7 Days'})`;
    if (s.category) line += ` [${s.category}]`;
    if (s.description) line += `\n  ${s.description.substring(0, 150)}...`;
    return line;
  }).join('\n');
};

const formatDigitalServices = (digitalServices) => {
  if (!digitalServices?.length) return '(No digital services yet)';
  let result = [];
  digitalServices.forEach(service => {
    result.push(`\n${service.title}:`);
    if (service.description) {
      result.push(`  ${service.description.substring(0, 200)}`);
    }
    if (service.packages && service.packages.length > 0) {
      result.push(`  Packages:`);
      service.packages.forEach(pkg => {
        result.push(`    • ${pkg.name}: ₹${pkg.price} (${pkg.timeline || 'Contact for timeline'})`);
        if (pkg.features && pkg.features.length > 0) {
          const topFeatures = pkg.features.slice(0, 3).join(', ');
          result.push(`      Features: ${topFeatures}`);
        }
      });
    }
  });
  return result.join('\n');
};

const formatTestimonials = (testimonials) => {
  if (!testimonials?.length) return '(No reviews yet)';
  return testimonials.map(t => `- "${t.quote?.substring(0, 80)}..." - ${t.name}, ${t.title} (${t.rating}★)`).join('\n');
};

const formatBlogs = (blogs) => {
  if (!blogs?.length) return '(No blogs yet)';
  return blogs.map(b => `- ${b.title} [${b.category}]`).join('\n');
};

const formatPricing = (pricing) => {
  if (!pricing?.length) return '(No pricing packages yet)';
  const categories = {};
  pricing.forEach(p => {
    if (!categories[p.category]) categories[p.category] = [];
    categories[p.category].push(p);
  });
  
  let result = [];
  Object.keys(categories).forEach(category => {
    const categoryTitle = categories[category][0]?.categoryTitle || category.toUpperCase();
    result.push(`\n${categoryTitle}:`);
    categories[category].forEach(p => {
      let line = `- ${p.name}: ${p.price}`;
      if (p.billingCycle && p.billingCycle !== 'one-time') line += ` (${p.billingCycle})`;
      if (p.popular) line += ' ⭐ POPULAR';
      result.push(line);
      if (p.description) result.push(`  ${p.description.substring(0, 100)}...`);
    });
  });
  return result.join('\n');
};

const formatSettings = (settings) => {
  if (!settings) return {};
  return {
    companyName: settings.companyName || 'ReturnFilers',
    email: settings.email || 'info@returnfilers.in',
    phone: settings.phone || '+91 84471 27264',
    whatsapp: settings.whatsapp || '+91 84471 27264',
    businessHours: settings.businessHours || {},
    about: settings.about || {},
    hero: settings.hero || {},
    footer: settings.footer || {}
  };
};

const formatNews = (news) => {
  if (!news?.length) return '(No recent news)';
  return news.map(n => `- ${n.title} [${n.source}] - ${n.date}`).join('\n');
};

// Get current date
const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-IN', { 
    timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
};

// Build system prompt with all data
const getSystemPrompt = async () => {
  const [services, digitalServices, testimonials, blogs, pricing, settings, news] = await Promise.all([
    getServices(), getDigitalServices(), getTestimonials(), getBlogs(), getPricing(), getSettings(), getTaxNews()
  ]);
  
  const companySettings = formatSettings(settings);
  
  return `You are "ReturnFilers AI", the official AI assistant for ReturnFilers - a professional tax and business consulting firm in India.

## TODAY: ${getCurrentDate()}

## ABOUT RETURNFILERS:
ReturnFilers is a professional tax and business consulting firm that combines technology-driven e-filing with expert tax support to ensure error-free tax returns. We provide trusted advice and seamless compliance solutions at reasonable pricing.

**What We Do:**
- Income Tax Return (ITR) Filing for individuals and businesses
- GST Registration, Filing & Compliance
- Business Registration (Company, LLP, Partnership, Proprietorship)
- Accounting & Bookkeeping Services
- Payroll Management
- Tax Planning & Advisory
- Audit Services (Statutory, Tax, Internal)
- Digital Services (Website Development, E-commerce Solutions)

**Our Mission:** To provide hassle-free, accurate, and timely tax filing services to individuals and businesses across India.

**Our Vision:** Making tax compliance simple, accessible, and stress-free for everyone through technology and expert guidance.

**Why Choose ReturnFilers:**
- Expert tax and business consultants with ${companySettings.about?.yearsOfExperience || 3}+ years experience
- 100% compliance with tax laws and regulations
- Technology-driven e-filing platform
- Transparent pricing with no hidden charges
- Dedicated support throughout the process
- ${companySettings.about?.clientsServed || 100}+ satisfied clients across India

## STRICT RULES:
- You are ReturnFilers AI, NOT a general assistant
- ONLY discuss ReturnFilers services and tax topics
- NEVER mention "CA firm", "Chartered Accountant", or "CA services"
- ALWAYS say "tax and business consulting firm" or "tax consulting firm"
- NEVER mention AI limitations or training data
- Experience: ${companySettings.about?.yearsOfExperience || 3}+ years (since ${companySettings.about?.yearEstablished || 2022}) - NEVER say more
- Clients: ${companySettings.about?.clientsServed || 100}+ - NEVER say more
- Use EXACT prices from services list below
- If unsure: "Please contact us at ${companySettings.phone || '+91 84471 27264'}"

## YOUR INTRODUCTION (USE THIS EXACTLY):
"I'm ReturnFilers AI, your assistant for tax and business consulting services. I'm here to help you with tax filing, GST registration, business setup, and more. How can I assist you today?"

## COMPANY INFO:
- Company: ${companySettings.companyName || 'ReturnFilers'} (Professional Tax & Business Consulting Firm)
- Phone/WhatsApp: ${companySettings.phone || '+91 84471 27264'}
- Email: ${companySettings.email || 'info@returnfilers.in'}
- Website: https://returnfilers.in
- Hours: ${companySettings.businessHours?.weekdays || 'Mon-Fri 9am-6pm'}, ${companySettings.businessHours?.saturday || 'Sat 10am-2pm'}
- Established: ${companySettings.about?.yearEstablished || 2022}

## OUR SERVICES (USE EXACT PRICES):
${formatServices(services)}

## PRICING PACKAGES:
${formatPricing(pricing)}

## DIGITAL SERVICES (WEB DEVELOPMENT):
${formatDigitalServices(digitalServices)}

All web development packages include mobile responsive design, professional quality, and dedicated support. Timelines and features vary by package.

## CLIENT REVIEWS:
${formatTestimonials(testimonials)}

## RECENT BLOGS:
${formatBlogs(blogs)}

## LATEST TAX NEWS & UPDATES:
${formatNews(news)}

## IMPORTANT DEADLINES:
- ITR Filing (Individuals): July 31
- ITR Filing (Audit Cases): October 31
- GST Returns: GSTR-1 (11th), GSTR-3B (20th) monthly
- Advance Tax: June 15, Sept 15, Dec 15, March 15

## IMPORTANT - YOU ARE ON THE WEBSITE:
You are embedded IN the returnfilers.in website. Users are ALREADY on the website.
- NEVER write "returnfilers.in" or "our website" - user is already here!
- For links, use SHORT paths like: /booking, /quote, /services, /contact, /digital-services
- Example: "Book your service here: /booking" (NOT "returnfilers.in/booking")

## PAGE LINKS (SHORT PATHS ONLY):
- /booking → for service booking (with or without documents)
- /quote → for getting price quote
- /services → for all tax and business consulting services list
- /digital-services → for web development packages
- /contact → for contact page
- /about → for about us page
- /blog → for blog articles

## CRITICAL - WHEN USER ASKS FOR LINKS:
When user asks for ANY link (booking link, website link, service link, contact link, etc.):
- ALWAYS provide the actual path: /booking, /quote, /services, /contact, /digital-services
- NEVER just say "you can book from our website" or "visit our booking page"
- ALWAYS give the clickable link path
- Example: "Sure! Book here: /booking" ✅
- Example: "You can visit our booking page" ❌

Examples:
- User: "booking link do" → "Sure! Book your service here: /booking"
- User: "website link" → "You're already on our website! Here are quick links:\n- Book Service: /booking\n- Get Quote: /quote\n- All Services: /services"
- User: "contact link" → "Contact us here: /contact"
- User: "digital services link" → "Check our web development packages: /digital-services"

## AI AUTO-BOOKING FEATURE:

**Two Types of Bookings:**

1. **SERVICE BOOKING** (Document Upload) - /booking page
   - For services like GST Registration, Company Registration, ITR Filing
   - Requires document upload
   - DO NOT auto-book these
   - Always direct to: /booking

2. **APPOINTMENT BOOKING** (Date/Time based) - Can AUTO-BOOK
   - For consultations, meetings, discussions
   - User provides: name, email, phone, preferred date/time
   - You CAN auto-book these appointments
   - Confirm with user before booking

**When to AUTO-BOOK Appointment:**
If user says: "I want to schedule a meeting", "book an appointment", "consultation chahiye"
AND provides: name, email, phone

Response: "Great! I can book an appointment for you. Let me find the next available slot..."
Then book using available time slots.

**When to give /booking link:**
If user says: "I want GST registration", "company registration karna hai", "ITR file karna hai"
Response: "To book this service, please visit: /booking
You can upload required documents there."

## WHEN TO GIVE LINKS:
- ALWAYS when user asks for any link, page, or wants to book/contact/quote
- When user wants to see services, pricing, or packages
- When user wants to upload documents or book appointment
- Keep responses natural but ALWAYS include the actual link path

## RESPONSE STYLE:
- Short, natural answers (2-4 lines)
- Use exact prices from services list
- Share tax news when asked
- Be helpful but don't over-explain

## APPRECIATION & EMOTIONAL RESPONSES:
When user says thank you, thanks, love you, you're awesome, great job, etc:
- Respond warmly and professionally
- Show genuine appreciation
- Keep it brief but heartfelt
- Add a helpful follow-up offer

Examples:
- "Thank you" → "You're most welcome! 😊 Happy to help. Feel free to reach out anytime you need assistance with tax matters!"
- "Love you" / "I love you" → "Aww, that's so sweet! 💛 I'm here to make your tax journey easier. Let me know if there's anything else I can help with!"
- "You're awesome" / "Great job" → "Thank you so much! 🙏 Your kind words mean a lot. I'm always here to assist you with any tax-related queries!"
- "You're the best" → "That really made my day! 😊 Thank you for the appreciation. Don't hesitate to ask if you need any help!"
- "Bye" / "Goodbye" → "Goodbye! Take care! 👋 Feel free to come back anytime you need help with taxes or our services!"
- "Good morning/afternoon/evening" → Respond with appropriate greeting + "How can I assist you today?"
- "How are you" → "I'm doing great, thank you for asking! 😊 How can I help you today?"

Be warm, friendly, and professional. Use emojis sparingly but appropriately.`;
};

// Main chat handler
const chatWithAI = async (req, res) => {
  try {
    console.log('📨 Chat request received');
    const { message, history = [] } = req.body;
    if (!message?.trim()) return res.status(400).json({ success: false, message: 'Message required' });

    console.log('📨 Chat:', message.substring(0, 50));

    // Detect appointment booking intent (not service booking)
    const appointmentKeywords = ['appointment', 'schedule', 'meeting', 'consultation', 'discuss', 'milna', 'baat karna'];
    const isAppointmentIntent = appointmentKeywords.some(keyword => message.toLowerCase().includes(keyword));
    
    // Extract user details if provided
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(\+91|91)?[\s-]?[6-9]\d{9}/;
    const extractedEmail = message.match(emailRegex)?.[0];
    const extractedPhone = message.match(phoneRegex)?.[0];
    
    // Auto-book appointment if user provides details
    if (isAppointmentIntent && extractedEmail && extractedPhone) {
      try {
        // Extract name (simple approach - first capitalized word)
        const nameMatch = message.match(/(?:name|naam)\s+(?:is|hai)?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
        const extractedName = nameMatch ? nameMatch[1] : 'Chatbot User';
        
        // Auto-book appointment
        const { autoBookAppointment } = require('../utils/aiBookingService');
        const bookingResult = await autoBookAppointment({
          name: extractedName,
          email: extractedEmail,
          phone: extractedPhone.replace(/\D/g, ''),
          service: 'General Consultation',
          message: message
        });
        
        if (bookingResult.success) {
          console.log('✅ AI Chatbot auto-booked appointment:', bookingResult.appointment.id);
        }
      } catch (err) {
        console.error('Auto-booking failed:', err.message);
      }
    }
    
    // Capture lead for any booking intent
    if (isAppointmentIntent || message.toLowerCase().includes('book')) {
      try {
        const { captureLeadFromForm } = require('../utils/leadScoringService');
        await captureLeadFromForm({
          name: 'Chatbot User',
          email: extractedEmail || 'chatbot@temp.com',
          phone: extractedPhone || '',
          source: 'chatbot',
          message: message,
          service: 'Booking Inquiry'
        });
      } catch (err) {
        console.error('Lead capture failed:', err.message);
      }
    }

    let response = null, provider = null;

    // Try Groq
    if (process.env.GROQ_API_KEY) {
      try {
        console.log('🔄 Trying Groq API...');
        response = await callGroq(message, history);
        provider = 'Groq';
        console.log('✅ Groq API success');
      } catch (e) { 
        console.log('❌ Groq error:', e.message);
        if (e.response) {
          console.log('Groq status:', e.response.status);
          console.log('Groq data:', JSON.stringify(e.response.data).substring(0, 200));
        }
      }
    }

    // Fallback OpenRouter
    if (!response && process.env.OPENROUTER_API_KEY) {
      try {
        console.log('🔄 Trying OpenRouter API...');
        response = await callOpenRouter(message, history);
        provider = 'OpenRouter';
        console.log('✅ OpenRouter API success');
      } catch (e) { 
        console.log('❌ OpenRouter error:', e.message);
        if (e.response) {
          console.log('OpenRouter status:', e.response.status);
          console.log('OpenRouter data:', JSON.stringify(e.response.data).substring(0, 200));
        }
      }
    }

    if (!response) {
      return res.status(503).json({ success: false, message: 'AI unavailable. Call +91 84471 27264' });
    }

    response = response.replace(/\n{3,}/g, '\n\n').replace(/^#{1,3}\s+/gm, '').trim();
    console.log(`✅ ${provider}`);
    res.json({ success: true, response, provider });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ success: false, message: 'Error. Call +91 84471 27264' });
  }
};

// Groq API
const callGroq = async (message, history) => {
  const systemPrompt = await getSystemPrompt();
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-10).map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: message }
  ];

  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    { model: 'llama-3.1-8b-instant', messages, max_tokens: 500, temperature: 0.7 },
    { headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }, timeout: 30000 }
  );
  return response.data?.choices?.[0]?.message?.content;
};

// OpenRouter API
const callOpenRouter = async (message, history) => {
  const systemPrompt = await getSystemPrompt();
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-10).map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: message }
  ];

  const models = ['meta-llama/llama-3.2-3b-instruct:free', 'mistralai/mistral-7b-instruct:free'];
  for (const model of models) {
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        { model, messages, max_tokens: 500, temperature: 0.7 },
        { headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}` }, timeout: 30000 }
      );
      if (response.data?.choices?.[0]?.message?.content) {
        return response.data.choices[0].message.content;
      }
    } catch (e) { continue; }
  }
  throw new Error('All models failed');
};

// Streaming handler
const chatWithAIStream = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message?.trim()) return res.status(400).json({ success: false, message: 'Message required' });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const systemPrompt = await getSystemPrompt();
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10).map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message }
    ];

    if (process.env.GROQ_API_KEY) {
      try {
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          { model: 'llama-3.1-8b-instant', messages, max_tokens: 500, temperature: 0.7, stream: true },
          { headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }, responseType: 'stream', timeout: 30000 }
        );

        let buffer = '';
        response.data.on('data', (chunk) => {
          buffer += chunk.toString();
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') { res.write('data: [DONE]\n\n'); return; }
              try {
                const content = JSON.parse(data).choices?.[0]?.delta?.content;
                if (content) res.write(`data: ${JSON.stringify({ content })}\n\n`);
              } catch (e) {}
            }
          }
        });
        response.data.on('end', () => { if (!res.writableEnded) { res.write('data: [DONE]\n\n'); res.end(); } });
        response.data.on('error', () => { if (!res.writableEnded) res.end(); });
        return;
      } catch (e) { console.log('Stream failed'); }
    }

    res.write(`data: ${JSON.stringify({ error: 'AI unavailable' })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    if (!res.writableEnded) { res.write('data: [DONE]\n\n'); res.end(); }
  }
};

// Test endpoint
const testAI = async (req, res) => {
  // Force refresh cache if ?refresh=true
  if (req.query.refresh === 'true') {
    dataCache = { services: null, digitalServices: null, testimonials: null, blogs: null, pricing: null, settings: null, news: null };
    cacheTime = { services: 0, digitalServices: 0, testimonials: 0, blogs: 0, pricing: 0, settings: 0, news: 0 };
  }
  
  const [services, digitalServices, testimonials, blogs, pricing, settings, news] = await Promise.all([
    getServices(), getDigitalServices(), getTestimonials(), getBlogs(), getPricing(), getSettings(), getTaxNews()
  ]);
  res.json({ 
    success: true, 
    data: {
      services: services.length,
      digitalServices: digitalServices.length,
      testimonials: testimonials.length,
      blogs: blogs.length,
      pricing: pricing.length,
      settings: settings ? 'loaded' : 'not found',
      news: news.length
    },
    details: {
      services: services.map(s => ({ title: s.title, price: s.price })),
      digitalServices: digitalServices.map(d => ({ title: d.title, packages: d.packages?.length })),
      pricing: pricing.map(p => ({ name: p.name, price: p.price, category: p.category })),
      settings: settings ? {
        companyName: settings.companyName,
        phone: settings.phone,
        email: settings.email,
        yearsOfExperience: settings.about?.yearsOfExperience,
        clientsServed: settings.about?.clientsServed
      } : null
    },
    cacheInfo: 'Data refreshes every 5 minutes automatically'
  });
};

// Cache invalidation endpoint for admin use
const invalidateCache = async (req, res) => {
  try {
    // Clear all cache
    dataCache = { services: null, digitalServices: null, testimonials: null, blogs: null, pricing: null, settings: null, news: null };
    cacheTime = { services: 0, digitalServices: 0, testimonials: 0, blogs: 0, pricing: 0, settings: 0, news: 0 };
    
    console.log('🔄 AI Chatbot cache invalidated by admin');
    
    res.json({ 
      success: true, 
      message: 'AI Chatbot cache cleared successfully. New data will be loaded on next chat request.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cache invalidation error:', error);
    res.status(500).json({ success: false, message: 'Failed to clear cache' });
  }
};

module.exports = { chatWithAI, chatWithAIStream, testAI, invalidateCache };
