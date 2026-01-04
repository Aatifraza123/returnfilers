const axios = require('axios');

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

// Check if message needs real-time info
const needsRealTimeInfo = (message) => {
  const keywords = ['today', 'latest', 'news', 'update', 'current', 'recent', 'new', 'aaj', 'abhi', 'date', 'time', 'budget', 'announcement'];
  const lowerMsg = message.toLowerCase();
  return keywords.some(kw => lowerMsg.includes(kw));
};

// Search for latest tax news using DuckDuckGo (free, no API key needed)
const searchTaxNews = async (query) => {
  try {
    // Use DuckDuckGo instant answer API (free)
    const searchQuery = `${query} India tax 2025`;
    const response = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&format=json&no_html=1`, {
      timeout: 5000
    });
    
    if (response.data?.AbstractText) {
      return response.data.AbstractText;
    }
    
    // Fallback: Return general tax info
    return null;
  } catch (error) {
    console.log('Search failed:', error.message);
    return null;
  }
};

// Get dynamic system prompt with current date
const getSystemPrompt = (additionalContext = '') => {
  const currentDate = getCurrentDate();
  
  return `You are "Tax Filer AI", the official AI assistant for Tax Filer - a professional CA firm in India.

## CRITICAL IDENTITY RULES:
- You are Tax Filer AI, NOT a general AI assistant
- You ONLY discuss Tax Filer services, pricing, and tax-related topics
- NEVER mention "knowledge cutoff", "training data", or AI limitations
- NEVER say you are an AI language model or discuss your capabilities
- If asked unrelated questions, politely redirect to Tax Filer services
- Today's Date: ${currentDate}

${additionalContext ? `## LATEST INFORMATION:\n${additionalContext}\n` : ''}

## STRICT RULES - NEVER VIOLATE:
1. NEVER make up information about the company
2. NEVER say experience is more than 3 years
3. NEVER say clients are more than 100+
4. ALWAYS use ONLY the information provided below
5. If you don't know something, say "I don't have that information, please contact us at +91 84471 27264"
6. NEVER break character or discuss being an AI
7. When asked about date/time, use today's date: ${currentDate}

## EXACT COMPANY FACTS (USE ONLY THESE):
- Company Name: Tax Filer
- Type: CA (Chartered Accountant) Firm
- Experience: 3+ years (started in 2022) - DO NOT SAY MORE THAN THIS
- Total Clients: 100+ happy clients - DO NOT SAY MORE THAN THIS
- Phone: +91 84471 27264
- Working Hours: Mon-Fri 9am-6pm, Sat 10am-2pm
- Location: India (serving clients nationwide)

## SERVICES & PRICING:

**TAX SERVICES:**
- ITR Filing (Salaried): ₹500-1,500 | 1-2 days
- ITR Filing (Business): ₹2,000-5,000 | 2-3 days
- Tax Planning: ₹1,000-2,000 | Same day
- TDS Return: ₹1,000-2,500 | 2-3 days
- Tax Audit: ₹5,000-15,000 | 5-7 days

**GST SERVICES:**
- GST Registration: ₹2,000-3,000 | 3-5 days
- GST Return (Monthly): ₹500-1,500 | 1-2 days
- GST Annual Return: ₹2,000-5,000 | 3-5 days
- GST Audit: ₹5,000-10,000 | 5-7 days

**BUSINESS REGISTRATION:**
- Private Limited Company: ₹8,000-15,000 | 7-10 days
- LLP Registration: ₹6,000-10,000 | 7-10 days
- OPC Registration: ₹7,000-12,000 | 7-10 days
- Partnership Firm: ₹3,000-5,000 | 3-5 days
- MSME/Udyam: ₹500-1,000 | 1-2 days
- Trademark: ₹5,000-8,000 | 1-2 days filing

**COMPLIANCE:**
- ROC Filing: ₹3,000-6,000 | 3-5 days
- Director KYC: ₹500-1,000 | 1-2 days
- Annual Return: ₹2,500-5,000 | 3-5 days

**ACCOUNTING:**
- Monthly Bookkeeping: ₹2,000-5,000/month
- Payroll: ₹1,000-3,000/month

## IMPORTANT DEADLINES (FY 2025-26):
- ITR Filing: July 31, 2025 (individuals), October 31, 2025 (audit cases)
- GST Returns: 11th (GSTR-1), 20th (GSTR-3B) of each month
- Advance Tax: June 15, Sept 15, Dec 15, March 15
- TDS Returns: Quarterly (July 31, Oct 31, Jan 31, May 31)

## DOCUMENTS REQUIRED:
- ITR: PAN, Aadhaar, Form 16, Bank Statements, Investment Proofs
- GST: PAN, Aadhaar, Address Proof, Bank Details, Business Proof
- Company: PAN, Aadhaar, Address Proof, Photos, NOC from landlord

## DOCUMENT SUBMISSION:
- Clients can upload documents online at: /upload-documents
- When user asks about submitting documents, applying for service, or sharing documents, guide them to /upload-documents
- Always show the link as: /upload-documents (it will be clickable)
- Steps: 1) Fill form with details 2) Select service 3) Upload documents 4) Submit
- We will review and contact within 24-48 hours
- For urgent queries: Call +91 84471 27264

## HOW TO APPLY FOR SERVICES:
1. Contact Us: Call/WhatsApp at +91 84471 27264 or visit our website
2. Share Documents: Upload documents at /upload-documents
3. Get a Quote: We'll provide pricing based on your requirements
4. Assignment: We'll assign an expert to your case
- Processing time: 3-5 working days (varies by service)

## IMPORTANT LINKS TO SHARE:
- Document Upload: /upload-documents
- All Services: /services
- Contact Page: /contact
- Get Quote: /quote
- About Us: /about

## RESPONSE RULES:
1. Keep responses short (2-4 sentences for simple queries)
2. Use bullet points for lists
3. Always mention exact prices from above
4. End with a question or call-to-action
5. For complex queries: "Please call us at +91 84471 27264"
6. NEVER invent facts about the company
7. For unrelated questions: "I'm here to help with Tax Filer services. How can I assist you with tax filing, GST, or company registration?"
8. When asked about date: "Today is ${currentDate}"

## SAMPLE ABOUT RESPONSE:
When asked about company/team/who are you, respond:
"Tax Filer is a professional Chartered Accountant firm established in 2022. With 3+ years of experience, we have served 100+ satisfied clients across India. We specialize in tax filing, GST services, company registration, and accounting. How can I help you today?"

Remember: Stay in character as Tax Filer AI. Never break character.`;
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
    let additionalContext = '';

    // Check if user needs real-time info (news, date, updates)
    if (needsRealTimeInfo(message)) {
      console.log('🔍 Searching for real-time info...');
      const searchResult = await searchTaxNews(message);
      if (searchResult) {
        additionalContext = searchResult;
        console.log('✅ Found real-time info');
      }
    }

    // Try Groq first (faster)
    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
      try {
        response = await callGroq(message, history, additionalContext);
        provider = 'Groq';
      } catch (error) {
        console.log('❌ Groq error:', error.message);
      }
    }

    // Fallback to OpenRouter
    if (!response && process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'your_openrouter_api_key_here') {
      try {
        response = await callOpenRouter(message, history, additionalContext);
        provider = 'OpenRouter';
      } catch (error) {
        console.log('❌ OpenRouter error:', error.message);
      }
    }

    if (!response) {
      return res.status(503).json({ 
        success: false, 
        message: 'Our AI assistant is temporarily unavailable. Please call us at +91 84471 27264 for immediate assistance.' 
      });
    }

    // Clean up response
    response = cleanResponse(response);

    console.log(`✅ Response via ${provider}`);
    res.json({ success: true, response, provider });

  } catch (error) {
    console.error('❌ Chat error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Something went wrong. Please try again or call us at +91 84471 27264.' 
    });
  }
};

// Clean and format response
const cleanResponse = (text) => {
  if (!text) return '';
  
  // Remove excessive newlines
  text = text.replace(/\n{3,}/g, '\n\n');
  
  // Remove markdown headers (##, ###)
  text = text.replace(/^#{1,3}\s+/gm, '');
  
  // Clean up spacing
  text = text.trim();
  
  return text;
};

// Groq API (Llama 3.1)
const callGroq = async (message, history, additionalContext = '') => {
  const messages = [
    { role: 'system', content: getSystemPrompt(additionalContext) },
    ...history.slice(-10).map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: message }
  ];

  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama-3.1-8b-instant',
      messages,
      max_tokens: 500,
      temperature: 0.7,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.3
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    }
  );

  if (!response.data?.choices?.[0]?.message?.content) {
    throw new Error('Invalid Groq response');
  }

  return response.data.choices[0].message.content;
};

// OpenRouter API (Free models - Llama, Mistral)
const callOpenRouter = async (message, history, additionalContext = '') => {
  const messages = [
    { role: 'system', content: getSystemPrompt(additionalContext) },
    ...history.slice(-10).map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: message }
  ];

  // Try free models
  const models = [
    'meta-llama/llama-3.2-3b-instruct:free',
    'mistralai/mistral-7b-instruct:free',
    'google/gemma-2-9b-it:free'
  ];

  for (const model of models) {
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model,
          messages,
          max_tokens: 500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://taxfiler.in',
            'X-Title': 'Tax Filer AI'
          },
          timeout: 30000
        }
      );

      if (response.data?.choices?.[0]?.message?.content) {
        console.log(`✅ OpenRouter model ${model} worked`);
        return response.data.choices[0].message.content;
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      console.log(`❌ OpenRouter model ${model} failed:`, errorMsg.substring(0, 100));
      continue;
    }
  }

  throw new Error('All OpenRouter models failed');
};

// Streaming chat handler (real-time response)
const chatWithAIStream = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    console.log('📨 Stream chat request:', message.substring(0, 50) + '...');

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Check if user needs real-time info
    let additionalContext = '';
    if (needsRealTimeInfo(message)) {
      console.log('🔍 Searching for real-time info...');
      const searchResult = await searchTaxNews(message);
      if (searchResult) {
        additionalContext = searchResult;
        console.log('✅ Found real-time info');
      }
    }

    const systemPrompt = getSystemPrompt(additionalContext);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10).map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message }
    ];

    let streamSuccess = false;

    // Try Groq streaming first
    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
      try {
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'llama-3.1-8b-instant',
            messages,
            max_tokens: 500,
            temperature: 0.7,
            stream: true
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
              'Content-Type': 'application/json'
            },
            responseType: 'stream',
            timeout: 30000
          }
        );

        let buffer = '';
        
        response.data.on('data', (chunk) => {
          buffer += chunk.toString();
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                res.write('data: [DONE]\n\n');
                return;
              }
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  res.write(`data: ${JSON.stringify({ content })}\n\n`);
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        });

        response.data.on('end', () => {
          if (!res.writableEnded) {
            res.write('data: [DONE]\n\n');
            res.end();
          }
        });

        response.data.on('error', (err) => {
          console.log('❌ Groq stream error:', err.message);
          if (!res.writableEnded) {
            res.write(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`);
            res.end();
          }
        });

        streamSuccess = true;
        console.log('✅ Streaming via Groq');
      } catch (error) {
        console.log('❌ Groq stream failed:', error.message);
      }
    }

    // Fallback to OpenRouter streaming
    if (!streamSuccess && process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'your_openrouter_api_key_here') {
      try {
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: 'meta-llama/llama-3.2-3b-instruct:free',
            messages,
            max_tokens: 500,
            temperature: 0.7,
            stream: true
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://taxfiler.in',
              'X-Title': 'Tax Filer AI'
            },
            responseType: 'stream',
            timeout: 30000
          }
        );

        let buffer = '';
        
        response.data.on('data', (chunk) => {
          buffer += chunk.toString();
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                res.write('data: [DONE]\n\n');
                return;
              }
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  res.write(`data: ${JSON.stringify({ content })}\n\n`);
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        });

        response.data.on('end', () => {
          if (!res.writableEnded) {
            res.write('data: [DONE]\n\n');
            res.end();
          }
        });

        response.data.on('error', (err) => {
          console.log('❌ OpenRouter stream error:', err.message);
          if (!res.writableEnded) {
            res.write(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`);
            res.end();
          }
        });

        streamSuccess = true;
        console.log('✅ Streaming via OpenRouter');
      } catch (error) {
        console.log('❌ OpenRouter stream failed:', error.message);
      }
    }

    if (!streamSuccess) {
      res.write(`data: ${JSON.stringify({ error: 'AI unavailable. Call +91 84471 27264' })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }

  } catch (error) {
    console.error('❌ Stream error:', error);
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ error: 'Something went wrong' })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  }
};

// Test endpoint
const testAI = async (req, res) => {
  const results = {
    groq: { configured: false, working: false, error: null },
    openrouter: { configured: false, working: false, error: null }
  };

  // Test Groq
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
    results.groq.configured = true;
    try {
      const response = await callGroq('Say "Groq is working" in exactly 3 words.', []);
      results.groq.working = true;
      results.groq.response = response;
    } catch (error) {
      results.groq.error = error.message;
    }
  }

  // Test OpenRouter
  if (process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'your_openrouter_api_key_here') {
    results.openrouter.configured = true;
    try {
      const response = await callOpenRouter('Say "OpenRouter is working" in exactly 3 words.', []);
      results.openrouter.working = true;
      results.openrouter.response = response;
    } catch (error) {
      results.openrouter.error = error.message;
    }
  }

  const anyWorking = results.groq.working || results.openrouter.working;

  res.json({
    success: anyWorking,
    message: anyWorking ? '✅ AI is ready!' : '❌ No AI provider working',
    results
  });
};

module.exports = { chatWithAI, chatWithAIStream, testAI };
