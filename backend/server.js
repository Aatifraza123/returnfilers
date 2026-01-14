require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userAuthRoutes = require('./routes/userAuthRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const contactRoutes = require('./routes/contactRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const blogRoutes = require('./routes/blogRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const chatRoutes = require('./routes/chatRoutes');
const documentRoutes = require('./routes/documentRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const digitalServiceRoutes = require('./routes/digitalServiceRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const sitemapRoutes = require('./routes/sitemapRoutes');

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
app.use('/api/user/auth', userAuthRoutes);
console.log('✓ User auth routes registered at /api/user/auth');
app.use('/api/admin/auth', adminAuthRoutes);
console.log('✓ Admin auth routes registered at /api/admin/auth');
app.use('/api/admin', adminRoutes);

// Quote routes - use controller which sends emails
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

// Direct test route to verify routing works
app.get('/api/blogs/test-direct', (req, res) => {
  res.json({ message: 'Direct route test - routing is working!' });
});

app.use('/api/testimonials', testimonialRoutes);
console.log('✓ Testimonial routes registered at /api/testimonials');

app.use('/api/chat', chatRoutes);
console.log('✓ Chat routes registered at /api/chat');

app.use('/api/documents', documentRoutes);
console.log('✓ Document routes registered at /api/documents');

app.use('/api/bookings', bookingRoutes);
console.log('✓ Booking routes registered at /api/bookings');

app.use('/api/digital-services', digitalServiceRoutes);
console.log('✓ Digital Service routes registered at /api/digital-services');

app.use('/api/settings', settingsRoutes);
console.log('✓ Settings routes registered at /api/settings');

app.use('/api/notifications', notificationRoutes);
console.log('✓ Notification routes registered at /api/notifications');

// Sitemap route
app.use('/sitemap.xml', sitemapRoutes);
console.log('✓ Sitemap route registered at /sitemap.xml');

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


