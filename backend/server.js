require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const contactRoutes = require('./routes/contactRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const blogRoutes = require('./routes/blogRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// Connect Database
connectDB();

// ==========================================
// MIDDLEWARE
// ==========================================
// CORS Configuration - Support both development and production
const allowedOrigins = [
  // Production frontend URLs
  'https://ca-website-nine-mu.vercel.app',
  'https://ca-website-it5v.vercel.app',
  'https://ca-website-puce.vercel.app',
  // Environment variable frontend URL
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  // Local development
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:3000'
];

// Function to check if origin is allowed
const isOriginAllowed = (origin) => {
  if (!origin) return true; // Allow requests with no origin (like mobile apps or curl requests)
  
  // Check exact match
  if (allowedOrigins.includes(origin)) return true;
  
  // Allow Vercel preview deployments (pattern: *.vercel.app)
  if (origin.includes('.vercel.app')) return true;
  
  return false;
};

// Shared CORS options
const corsOptions = {
  origin: function (origin, callback) {
    try {
      if (isOriginAllowed(origin)) {
        console.log(`✅ CORS allowed origin: ${origin || 'no origin'}`);
        callback(null, true);
      } else {
        console.warn(`🚫 CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    } catch (error) {
      console.error('❌ CORS error:', error);
      callback(error);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200 // For legacy browser support
};

// Apply CORS middleware (must be before other middleware)
app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: '50mb' })); 
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Log incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  // Special logging for blog routes
  if (req.url.startsWith('/api/blogs')) {
    console.log('📝 Blog route request:', req.method, req.url);
  }
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// ==========================================
// ROUTES
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Quote routes - MUST be before /api publicRoutes to avoid conflicts
const Quote = require('./models/quoteModel');

// POST /api/quotes - Public route for submitting quotes
app.post('/api/quotes', async (req, res) => {
  try {
    console.log('POST /api/quotes - Request received:', req.body);
    
    const { name, email, phone, company, service, budget, message } = req.body;

    // Validation
    if (!name || !email || !phone || !service || !message) {
      return res.status(400).json({ 
        message: 'Please fill in all required fields',
        received: { name: !!name, email: !!email, phone: !!phone, service: !!service, message: !!message }
      });
    }

    // Create quote
    const quote = await Quote.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: (company || '').trim(),
      service: service.trim(),
      budget: (budget || '').trim(),
      message: message.trim()
    });

    console.log('Quote created successfully:', quote._id);
    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully',
      quote
    });
  } catch (error) {
    console.error('Quote creation error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to create quote',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Register quotes router for GET, PATCH, DELETE (admin routes)
app.use('/api/quotes', quoteRoutes);
console.log('✓ Quote routes registered at /api/quotes');

// Specific routes MUST be registered before /api catch-all to avoid conflicts
// IMPORTANT: Blog routes MUST be registered before publicRoutes to avoid conflicts
app.use('/api/blogs', blogRoutes);
console.log('✓ Blog routes registered at /api/blogs');

app.use('/api/consultations', consultationRoutes);
console.log('✓ Consultation routes registered at /api/consultations');
app.use('/api/contacts', contactRoutes);
console.log('✓ Contact routes registered at /api/contacts');
app.use('/api/newsletter', newsletterRoutes);
console.log('✓ Newsletter routes registered at /api/newsletter');
app.use('/api/services', serviceRoutes);  // Handles all /api/services/* routes (GET, POST, PUT, DELETE)
app.use('/api/payments', paymentRoutes);
console.log('✓ Payment routes registered at /api/payments');

// Direct test route to verify routing works
app.get('/api/blogs/test-direct', (req, res) => {
  res.json({ message: 'Direct route test - routing is working!' });
});

app.use('/api/portfolio', portfolioRoutes);
app.use('/api/testimonials', testimonialRoutes);
console.log('✓ Testimonial routes registered at /api/testimonials');

app.use('/api/chat', chatRoutes);
console.log('✓ Chat routes registered at /api/chat');

// Public routes last - /api/blogs in publicRoutes won't be reached (blogRoutes handles it first)
app.use('/api', publicRoutes); 

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
  console.log(`Server running on http://localhost:${PORT}`)
);


