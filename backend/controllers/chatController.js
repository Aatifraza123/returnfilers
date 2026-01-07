const axios = require('axios');
const Service = require('../models/serviceModel');
const DigitalService = require('../models/DigitalService');
const Testimonial = require('../models/testimonialModel');
const Blog = require('../models/blogModel');
const Portfolio = require('../models/portfolioModel');

// Cache (refresh every 5 minutes for website data, 30 min for news)
let dataCache = { services: null, digitalServices: null, testimonials: null, blogs: null, portfolio: null, news: null };
let cacheTime = { services: 0, digitalServices: 0, testimonials: 0, blogs: 0, portfolio: 0, news: 0 };
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

// Fetch portfolio
const getPortfolio = async () => {
  const now = Date.now();
  if (dataCache.portfolio && (now - cacheTime.portfolio) < CACHE_DURATION) return dataCache.portfolio;
  try {
    dataCache.portfolio = await Portfolio.find({ isActive: true }).select('title category client').limit(5);
    cacheTime.portfolio = now;
  } catch (e) { console.log('Portfolio fetch error'); }
  return dataCache.portfolio || [];
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

const formatPortfolio = (portfolio) => {
  if (!portfolio?.length) return '(No portfolio yet)';
  return portfolio.map(p => `- ${p.title} (${p.category}) - Client: ${p.client || 'Confidential'}`).join('\n');
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
  const [services, digitalServices, testimonials, blogs, portfolio, news] = await Promise.all([
    getServices(), getDigitalServices(), getTestimonials(), getBlogs(), getPortfolio(), getTaxNews()
  ]);
  
  return `You are "ReturnFilers AI", the official AI assistant for ReturnFilers - a professional CA firm in India.

## TODAY: ${getCurrentDate()}

## STRICT RULES:
- You are ReturnFilers AI, NOT a general assistant
- ONLY discuss ReturnFilers services and tax topics
- NEVER mention AI limitations or training data
- Experience: 3+ years (since 2022) - NEVER say more
- Clients: 100+ - NEVER say more
- Use EXACT prices from services list below
- If unsure: "Please contact us at +91 84471 27264"

## COMPANY INFO:
- Company: ReturnFilers (CA Firm)
- Phone/WhatsApp: +91 84471 27264
- Email: info@returnfilers.in
- Website: https://returnfilers.in
- Hours: Mon-Fri 9am-6pm, Sat 10am-2pm

## OUR SERVICES (USE EXACT PRICES):
${formatServices(services)}

## DIGITAL SERVICES (WEB DEVELOPMENT):
${formatDigitalServices(digitalServices)}

All web development packages include mobile responsive design, professional quality, and dedicated support. Timelines and features vary by package.

## CLIENT REVIEWS:
${formatTestimonials(testimonials)}

## RECENT BLOGS:
${formatBlogs(blogs)}

## OUR WORK/PORTFOLIO:
${formatPortfolio(portfolio)}

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
- /services → for all CA services list
- /digital-services → for web development packages
- /contact → for contact page

## WHEN TO GIVE LINKS:
- ONLY when user specifically asks to book, upload documents, get quote, etc.
- DO NOT add links in general information responses
- Keep responses natural and conversational

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
    const { message, history = [] } = req.body;
    if (!message?.trim()) return res.status(400).json({ success: false, message: 'Message required' });

    console.log('📨 Chat:', message.substring(0, 50));

    let response = null, provider = null;

    // Try Groq
    if (process.env.GROQ_API_KEY) {
      try {
        response = await callGroq(message, history);
        provider = 'Groq';
      } catch (e) { console.log('Groq error:', e.message); }
    }

    // Fallback OpenRouter
    if (!response && process.env.OPENROUTER_API_KEY) {
      try {
        response = await callOpenRouter(message, history);
        provider = 'OpenRouter';
      } catch (e) { console.log('OpenRouter error:', e.message); }
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
    dataCache = { services: null, digitalServices: null, testimonials: null, blogs: null, portfolio: null, news: null };
    cacheTime = { services: 0, digitalServices: 0, testimonials: 0, blogs: 0, portfolio: 0, news: 0 };
  }
  
  const [services, digitalServices, testimonials, blogs, portfolio, news] = await Promise.all([
    getServices(), getDigitalServices(), getTestimonials(), getBlogs(), getPortfolio(), getTaxNews()
  ]);
  res.json({ 
    success: true, 
    data: {
      services: services.length,
      digitalServices: digitalServices.length,
      testimonials: testimonials.length,
      blogs: blogs.length,
      portfolio: portfolio.length,
      news: news.length
    },
    details: {
      services: services.map(s => ({ title: s.title, price: s.price })),
      digitalServices: digitalServices.map(d => ({ title: d.title, packages: d.packages?.length }))
    },
    cacheInfo: 'Data refreshes every 5 minutes automatically'
  });
};

module.exports = { chatWithAI, chatWithAIStream, testAI };
