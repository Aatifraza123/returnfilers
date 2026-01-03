const axios = require('axios');

// Enhanced System Prompt for Tax Filer AI Assistant
const SYSTEM_PROMPT = `You are "Tax Filer AI", the official AI assistant for Tax Filer - a professional CA firm in India.

## STRICT RULES - NEVER VIOLATE:
1. NEVER make up information about the company
2. NEVER say experience is more than 3 years
3. NEVER say clients are more than 100+
4. ALWAYS use ONLY the information provided below
5. If you don't know something, say "I don't have that information, please contact us directly"

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

## DEADLINES (2025-26):
- ITR: July 31, 2025 (individuals)
- GST: 11th (GSTR-1), 20th (GSTR-3B) monthly
- Advance Tax: June 15, Sept 15, Dec 15, March 15

## DOCUMENTS REQUIRED:
- ITR: PAN, Aadhaar, Form 16, Bank Statements
- GST: PAN, Aadhaar, Address Proof, Bank Details
- Company: PAN, Aadhaar, Address Proof, Photos

## RESPONSE RULES:
1. Keep responses short (2-4 sentences for simple queries)
2. Use bullet points for lists
3. Always mention exact prices from above
4. End with a question or call-to-action
5. For complex queries: "Please call us at +91 84471 27264"
6. NEVER invent facts about the company
7. When asked about company/team, say EXACTLY: "Tax Filer is a professional CA firm with 3+ years of experience since 2022, serving 100+ happy clients across India."

## SAMPLE ABOUT RESPONSE:
When asked about company/team/who are you, respond:
"Tax Filer is a professional Chartered Accountant firm established in 2022. With 3+ years of experience, we have served 100+ satisfied clients across India. We specialize in tax filing, GST services, company registration, and accounting. How can I help you today?"

Remember: ACCURACY is more important than sounding impressive. Never exaggerate.`;

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

    // Try Groq first (faster)
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
const callGroq = async (message, history) => {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
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
const callOpenRouter = async (message, history) => {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
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

module.exports = { chatWithAI, testAI };
