const axios = require('axios');
const Service = require('../models/serviceModel');

// Cache for services (refresh every 5 minutes)
let servicesCache = null;
let servicesCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch services from database
const getServicesFromDB = async () => {
  const now = Date.now();
  if (servicesCache && (now - servicesCacheTime) < CACHE_DURATION) {
    return servicesCache;
  }
  
  try {
    const services = await Service.find({ active: true }).select('title description price timeline');
    servicesCache = services;
    servicesCacheTime = now;
    return services;
  } catch (error) {
    console.log('Error fetching services:', error.message);
    return servicesCache || [];
  }
};

// Format services for AI prompt
const formatServicesForPrompt = (services) => {
  if (!services || services.length === 0) {
    return '(No services available - ask user to contact us)';
  }
  
  return services.map(s => {
    let line = `- ${s.title}`;
    if (s.price) line += `: ₹${s.price}`;
    if (s.timeline) line += ` (${s.timeline})`;
    return line;
  }).join('\n');
};

// Get current date in India timezone
const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Get dynamic system prompt with services from database
const getSystemPrompt = async (additionalContext = '') => {
  const currentDate = getCurrentDate();
  const services = await getServicesFromDB();
  const servicesText = formatServicesForPrompt(services);
  
  return `You are "Tax Filer AI", the official AI assistant for Tax Filer - a professional CA firm in India.

## CRITICAL IDENTITY RULES:
- You are Tax Filer AI, NOT a general AI assistant
- You ONLY discuss Tax Filer services, pricing, and tax-related topics
- NEVER mention "knowledge cutoff", "training data", or AI limitations
- If asked unrelated questions, politely redirect to Tax Filer services
- Today's Date: ${currentDate}

${additionalContext ? `## LATEST INFORMATION:\n${additionalContext}\n` : ''}

## STRICT RULES:
1. NEVER make up information about the company
2. Experience: 3+ years (started 2022) - NEVER say more
3. Clients: 100+ - NEVER say more
4. Use ONLY the services and pricing listed below
5. If you don't know something: "Please contact us at +91 84471 27264"

## COMPANY INFO:
- Company: Tax Filer (CA Firm)
- Experience: 3+ years (since 2022)
- Clients: 100+
- Phone/WhatsApp: +91 84471 27264
- Email: info@taxfiler.in
- Website: https://taxfiler.in
- Hours: Mon-Fri 9am-6pm, Sat 10am-2pm

## OUR SERVICES (FROM DATABASE - USE THESE EXACT PRICES):
${servicesText}

## IMPORTANT LINKS:
- Document Upload: /upload-documents
- All Services: /services
- Contact: /contact
- Get Quote: /quote

## HOW TO APPLY:
1. Contact us at +91 84471 27264
2. Upload documents at /upload-documents
3. Get quote and pay
4. We assign an expert

## RESPONSE RULES:
1. Keep responses short (2-4 sentences)
2. Use bullet points for lists
3. Always mention exact prices from services above
4. End with a question or call-to-action
5. For complex queries: "Please call us at +91 84471 27264"

Remember: Stay in character as Tax Filer AI.`;
};

// Main chat handler
const chatWithAI = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    console.log('📨 Chat request:', message.substring(0, 50) + '...');

    let response = null;
    let provider = null;

    // Try Groq first
    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
      try {
        response = await callGroq(message, history);
        provider = 'Groq';
      } catch (error) {
        console.log('❌ Groq error:', error.message);
      }
    }

    // Fallback to OpenRouter
    if (!response && process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'your_openrouter_api_key_here') {
      try {
        response = await callOpenRouter(message, history);
        provider = 'OpenRouter';
      } catch (error) {
        console.log('❌ OpenRouter error:', error.message);
      }
    }

    if (!response) {
      return res.status(503).json({ 
        success: false, 
        message: 'AI unavailable. Please call +91 84471 27264' 
      });
    }

    response = response.replace(/\n{3,}/g, '\n\n').replace(/^#{1,3}\s+/gm, '').trim();

    console.log(`✅ Response via ${provider}`);
    res.json({ success: true, response, provider });

  } catch (error) {
    console.error('❌ Chat error:', error);
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
    { headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' }, timeout: 30000 }
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
        { headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' }, timeout: 30000 }
      );
      if (response.data?.choices?.[0]?.message?.content) {
        return response.data.choices[0].message.content;
      }
    } catch (err) {
      continue;
    }
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

    let success = false;

    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
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
        success = true;
      } catch (e) { console.log('Groq stream failed'); }
    }

    if (!success) {
      res.write(`data: ${JSON.stringify({ error: 'AI unavailable. Call +91 84471 27264' })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  } catch (error) {
    if (!res.writableEnded) { res.write('data: [DONE]\n\n'); res.end(); }
  }
};

// Test endpoint
const testAI = async (req, res) => {
  const services = await getServicesFromDB();
  res.json({ success: true, servicesCount: services.length, services: services.map(s => s.title) });
};

module.exports = { chatWithAI, chatWithAIStream, testAI };
