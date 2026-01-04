const axios = require('axios');
const Service = require('../models/serviceModel');
const Testimonial = require('../models/testimonialModel');
const Blog = require('../models/blogModel');
const Portfolio = require('../models/portfolioModel');

// Cache (refresh every 5 minutes)
let dataCache = { services: null, testimonials: null, blogs: null, portfolio: null };
let cacheTime = { services: 0, testimonials: 0, blogs: 0, portfolio: 0 };
const CACHE_DURATION = 5 * 60 * 1000;

// Fetch services
const getServices = async () => {
  const now = Date.now();
  if (dataCache.services && (now - cacheTime.services) < CACHE_DURATION) return dataCache.services;
  try {
    dataCache.services = await Service.find({ active: true }).select('title price timeline');
    cacheTime.services = now;
  } catch (e) { console.log('Services fetch error'); }
  return dataCache.services || [];
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

// Format data for prompt
const formatServices = (services) => {
  if (!services?.length) return '(Contact us for services)';
  return services.map(s => `- ${s.title}: ₹${s.price} (${s.timeline || '3-7 Days'})`).join('\n');
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

// Get current date
const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-IN', { 
    timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
};

// Build system prompt with all data
const getSystemPrompt = async () => {
  const [services, testimonials, blogs, portfolio] = await Promise.all([
    getServices(), getTestimonials(), getBlogs(), getPortfolio()
  ]);
  
  return `You are "Tax Filer AI", the official AI assistant for Tax Filer - a professional CA firm in India.

## TODAY: ${getCurrentDate()}

## STRICT RULES:
- You are Tax Filer AI, NOT a general assistant
- ONLY discuss Tax Filer services and tax topics
- NEVER mention AI limitations or training data
- Experience: 3+ years (since 2022) - NEVER say more
- Clients: 100+ - NEVER say more
- Use EXACT prices from services list below
- If unsure: "Please contact us at +91 84471 27264"

## COMPANY INFO:
- Company: Tax Filer (CA Firm)
- Phone/WhatsApp: +91 84471 27264
- Email: info@taxfiler.in
- Website: https://taxfiler.in
- Hours: Mon-Fri 9am-6pm, Sat 10am-2pm

## OUR SERVICES (USE EXACT PRICES):
${formatServices(services)}

## CLIENT REVIEWS:
${formatTestimonials(testimonials)}

## RECENT BLOGS:
${formatBlogs(blogs)}

## OUR WORK/PORTFOLIO:
${formatPortfolio(portfolio)}

## IMPORTANT LINKS:
- Services: /services
- Upload Documents: /upload-documents
- Contact: /contact
- Get Quote: /quote
- Blogs: /blog
- Portfolio: /portfolio

## RESPONSE RULES:
1. Keep responses short (2-4 sentences)
2. Use bullet points for lists
3. Mention exact prices from services
4. When asked about reviews, share actual client testimonials
5. When asked about blogs, mention recent blog titles
6. End with question or call-to-action`;
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
  const [services, testimonials, blogs, portfolio] = await Promise.all([
    getServices(), getTestimonials(), getBlogs(), getPortfolio()
  ]);
  res.json({ 
    success: true, 
    data: {
      services: services.length,
      testimonials: testimonials.length,
      blogs: blogs.length,
      portfolio: portfolio.length
    }
  });
};

module.exports = { chatWithAI, chatWithAIStream, testAI };
