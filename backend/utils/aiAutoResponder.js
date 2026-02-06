const axios = require('axios');

/**
 * AI Auto-Responder Service
 * Automatically generates personalized email responses for common queries
 */

// Common query categories
const QUERY_CATEGORIES = {
  PRICING: ['price', 'cost', 'fee', 'charge', 'rate', 'pricing', 'affordable'],
  SERVICES: ['service', 'offer', 'provide', 'do you', 'can you', 'help with'],
  APPOINTMENT: ['appointment', 'meeting', 'consultation', 'schedule', 'book', 'available'],
  TAX_FILING: ['tax', 'itr', 'return', 'filing', 'gst', 'income tax'],
  DOCUMENTS: ['document', 'paper', 'upload', 'submit', 'required', 'need'],
  URGENT: ['urgent', 'asap', 'immediately', 'emergency', 'quick'],
  GENERAL: ['hello', 'hi', 'inquiry', 'question', 'information', 'details']
};

/**
 * Categorize the query based on keywords
 */
const categorizeQuery = (message) => {
  const lowerMessage = message.toLowerCase();
  
  for (const [category, keywords] of Object.entries(QUERY_CATEGORIES)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return category;
    }
  }
  
  return 'GENERAL';
};

/**
 * Generate AI response using OpenRouter/Groq
 */
const generateAIResponse = async (name, email, message, category) => {
  try {
    const apiKey = process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.log('⚠️ No AI API key found, using template response');
      return generateTemplateResponse(name, category);
    }

    const prompt = `You are a professional CA (Chartered Accountant) assistant for ReturnFilers.
    
Client Details:
- Name: ${name}
- Email: ${email}
- Query Category: ${category}
- Message: ${message}

Generate a professional, warm, and helpful email response that:
1. Acknowledges their query
2. Provides relevant information based on the category
3. Offers next steps (book consultation, call, etc.)
4. Keeps it concise (max 150 words)
5. Ends with a professional signature

Response should be in a friendly but professional tone.`;

    // Try Groq first (faster and free)
    if (process.env.GROQ_API_KEY) {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: 'You are a professional CA assistant.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 300
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content.trim();
    }

    // Fallback to OpenRouter
    if (process.env.OPENROUTER_API_KEY) {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: [
            { role: 'system', content: 'You are a professional CA assistant.' },
            { role: 'user', content: prompt }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
            'X-Title': 'ReturnFilers CA Website'
          }
        }
      );

      return response.data.choices[0].message.content.trim();
    }

  } catch (error) {
    console.error('❌ AI Response Generation Error:', error.message);
    return generateTemplateResponse(name, category);
  }
};

/**
 * Fallback template responses
 */
const generateTemplateResponse = (name, category) => {
  const templates = {
    PRICING: `Dear ${name},

Thank you for your inquiry about our pricing. We offer competitive and transparent pricing for all our services.

Our pricing varies based on the specific service and complexity. To provide you with an accurate quote, I'd recommend:

1. Schedule a free 15-minute consultation
2. Call us at +91 84471 27264
3. Visit our pricing page: ${process.env.FRONTEND_URL}/pricing

We're committed to providing value-driven services at reasonable rates.

Best regards,
ReturnFilers Team`,

    SERVICES: `Dear ${name},

Thank you for reaching out! We offer comprehensive CA services including:

• Income Tax Return Filing
• GST Registration & Filing
• Company Registration
• Audit Services
• Financial Planning & Advisory
• Accounting & Bookkeeping

I'd be happy to discuss your specific requirements. Please book a consultation or call us at +91 84471 27264.

Best regards,
ReturnFilers Team`,

    APPOINTMENT: `Dear ${name},

Thank you for your interest in scheduling a consultation!

You can book an appointment through:
1. Our website: ${process.env.FRONTEND_URL}/booking
2. Call us directly: +91 84471 27264
3. WhatsApp: +91 84471 27264

We offer both in-person and online consultations at your convenience.

Looking forward to assisting you!

Best regards,
ReturnFilers Team`,

    TAX_FILING: `Dear ${name},

Thank you for your tax filing inquiry!

We specialize in hassle-free tax filing services with:
• Expert guidance from certified CAs
• 100% accurate filing
• Maximum refund optimization
• Timely submission

Let's discuss your specific tax situation. Book a consultation or call us at +91 84471 27264.

Best regards,
ReturnFilers Team`,

    DOCUMENTS: `Dear ${name},

Thank you for your query about documents!

For most services, you'll typically need:
• PAN Card
• Aadhaar Card
• Bank Statements
• Previous year's returns (if applicable)

The exact requirements depend on your specific service. We'll provide a detailed checklist after our initial consultation.

Book now: ${process.env.FRONTEND_URL}/booking

Best regards,
ReturnFilers Team`,

    URGENT: `Dear ${name},

We understand your matter is urgent!

For immediate assistance:
📞 Call: +91 84471 27264
💬 WhatsApp: +91 84471 27264

We're available Mon-Fri: 9am-6pm, Sat: 10am-2pm

We'll prioritize your request and get back to you within 2 hours during business hours.

Best regards,
ReturnFilers Team`,

    GENERAL: `Dear ${name},

Thank you for contacting ReturnFilers!

We've received your inquiry and our team will review it shortly. We typically respond within 24 hours during business days.

For immediate assistance:
📞 Call: +91 84471 27264
💬 WhatsApp: +91 84471 27264
🌐 Visit: ${process.env.FRONTEND_URL}

We look forward to assisting you with your financial needs!

Best regards,
ReturnFilers Team`
  };

  return templates[category] || templates.GENERAL;
};

/**
 * Main function to process and respond to contact form submissions
 */
const processContactQuery = async (contactData) => {
  try {
    const { name, email, message } = contactData;
    
    // Categorize the query
    const category = categorizeQuery(message);
    
    // Generate AI response
    const aiResponse = await generateAIResponse(name, email, message, category);
    
    return {
      category,
      response: aiResponse,
      shouldAutoSend: category !== 'URGENT', // Don't auto-send for urgent queries
      priority: category === 'URGENT' ? 'high' : 'normal'
    };
    
  } catch (error) {
    console.error('❌ Error processing contact query:', error);
    return {
      category: 'GENERAL',
      response: generateTemplateResponse(contactData.name, 'GENERAL'),
      shouldAutoSend: false,
      priority: 'normal'
    };
  }
};

module.exports = {
  processContactQuery,
  categorizeQuery,
  generateAIResponse,
  generateTemplateResponse
};
