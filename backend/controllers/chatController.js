const axios = require('axios');
const Service = require('../models/serviceModel');
const Testimonial = require('../models/testimonialModel');
const Blog = require('../models/blogModel');
const Portfolio = require('../models/portfolioModel');

// Cache (refresh every 5 minutes for website data, 30 min for news)
let dataCache = { services: null, testimonials: null, blogs: null, portfolio: null, news: null };
let cacheTime = { services: 0, testimonials: 0, blogs: 0, portfolio: 0, news: 0 };
const CACHE_DURATION = 5 * 60 * 1000;
const NEWS_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes for news

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
  const [services, testimonials, blogs, portfolio, news] = await Promise.all([
    getServices(), getTestimonials(), getBlogs(), getPortfolio(), getTaxNews()
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

## LATEST TAX NEWS & UPDATES:
${formatNews(news)}

## IMPORTANT DEADLINES:
- ITR Filing (Individuals): July 31
- ITR Filing (Audit Cases): October 31
- GST Returns: GSTR-1 (11th), GSTR-3B (20th) monthly
- Advance Tax: June 15, Sept 15, Dec 15, March 15

## WEBSITE LINKS (USE ONLY WHEN RELEVANT):
- Document Upload: https://taxfiler.in/upload-documents
- Get Quote: https://taxfiler.in/quote  
- Services: https://taxfiler.in/services
- Contact: https://taxfiler.in/contact
- Blogs: https://taxfiler.in/blog

## WHEN TO USE LINKS:
- Document upload link → ONLY when user asks to upload/submit documents
- Quote link → ONLY when user wants pricing/quote
- Services link → ONLY when user asks about all services
- Contact link → ONLY when user wants to contact
- DO NOT add links in every response!

## RESPONSE STYLE:
- Short, natural answers (2-4 lines)
- Use exact prices from services list
- Share tax news when asked about updates
- Add link ONLY if directly relevant to user's question
- DO NOT end every response with website link`;
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
  const [services, testimonials, blogs, portfolio, news] = await Promise.all([
    getServices(), getTestimonials(), getBlogs(), getPortfolio(), getTaxNews()
  ]);
  res.json({ 
    success: true, 
    data: {
      services: services.length,
      testimonials: testimonials.length,
      blogs: blogs.length,
      portfolio: portfolio.length,
      news: news.length
    }
  });
};

module.exports = { chatWithAI, chatWithAIStream, testAI };
