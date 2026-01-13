const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Company Info
  companyName: {
    type: String,
    default: 'ReturnFilers'
  },
  logo: {
    type: String,
    default: '' // URL to logo image
  },
  logoText: {
    type: String,
    default: 'RF' // Fallback text if no logo image
  },
  email: {
    type: String,
    default: 'info@returnfilers.in'
  },
  phone: {
    type: String,
    default: '+91 84471 27264'
  },
  whatsapp: {
    type: String,
    default: '+91 84471 27264'
  },
  supportEmail: {
    type: String,
    default: 'support@returnfilers.in'
  },
  address: {
    type: String,
    default: ''
  },
  
  // Business Details
  businessDetails: {
    gstNumber: { type: String, default: '' },
    panNumber: { type: String, default: '' },
    registrationNumber: { type: String, default: '' },
    certifications: { type: String, default: '' },
    workingDays: { type: String, default: 'Monday - Saturday' }
  },
  
  // Brand Colors
  brandColors: {
    primary: { type: String, default: '#0B1530' },
    secondary: { type: String, default: '#C9A227' },
    accent: { type: String, default: '#1E3A8A' },
    footerBg: { type: String, default: '#0B1530' },
    footerText: { type: String, default: '#ffffff' },
    footerLink: { type: String, default: '#C9A227' },
    footerCompanyName: { type: String, default: '#C9A227' }
  },
  
  // Hero Section
  hero: {
    title: { type: String, default: 'Professional Tax & Financial Services' },
    subtitle: { type: String, default: 'Expert Chartered Accountants for Your Business Growth' },
    ctaText: { type: String, default: 'Get Started' },
    ctaLink: { type: String, default: '/quote' },
    backgroundImage: { type: String, default: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop' }
  },
  
  // Footer
  footer: {
    description: { type: String, default: 'Professional chartered accountancy services with expertise in taxation, auditing, and financial consulting.' },
    copyrightText: { type: String, default: '© 2024 ReturnFilers. All rights reserved.' },
    quickLinks: [{ 
      label: { type: String },
      url: { type: String }
    }]
  },
  
  // Social Media Links
  socialMedia: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' },
    whatsapp: { type: String, default: '' }
  },
  
  // Social Media Colors (Individual colors for each platform)
  socialMediaColors: {
    facebook: { 
      color: { type: String, default: '#1877F2' }, // Facebook Blue
      hoverColor: { type: String, default: '#FFFFFF' }
    },
    instagram: { 
      color: { type: String, default: '#E4405F' }, // Instagram Pink
      hoverColor: { type: String, default: '#FFFFFF' }
    },
    linkedin: { 
      color: { type: String, default: '#0A66C2' }, // LinkedIn Blue
      hoverColor: { type: String, default: '#FFFFFF' }
    },
    twitter: { 
      color: { type: String, default: '#1DA1F2' }, // Twitter Blue
      hoverColor: { type: String, default: '#FFFFFF' }
    },
    youtube: { 
      color: { type: String, default: '#FF0000' }, // YouTube Red
      hoverColor: { type: String, default: '#FFFFFF' }
    },
    whatsapp: { 
      color: { type: String, default: '#25D366' }, // WhatsApp Green
      hoverColor: { type: String, default: '#FFFFFF' }
    }
  },
  
  // Business Hours
  businessHours: {
    weekdays: { type: String, default: 'Monday - Friday: 9:00 AM - 6:00 PM' },
    saturday: { type: String, default: 'Saturday: 10:00 AM - 2:00 PM' },
    sunday: { type: String, default: 'Sunday: Closed' },
    holidays: { type: String, default: 'Closed on public holidays' }
  },
  
  // SEO Settings
  seo: {
    metaTitle: { type: String, default: 'ReturnFilers - Professional CA Services' },
    metaDescription: { type: String, default: 'Expert Chartered Accountant services for tax filing, GST, auditing, and business registration.' },
    metaKeywords: { type: String, default: 'CA, Chartered Accountant, Tax Filing, GST, Audit' },
    faviconUrl: { type: String, default: '/favicon.svg' },
    ogImage: { type: String, default: '' },
    googleAnalyticsId: { type: String, default: '' },
    googleTagManagerId: { type: String, default: '' },
    facebookPixelId: { type: String, default: '' }
  },
  
  // About Company
  about: {
    yearEstablished: { type: Number, default: 2022 },
    yearsOfExperience: { type: Number, default: 3 },
    clientsServed: { type: Number, default: 100 },
    projectsCompleted: { type: Number, default: 200 },
    successRate: { type: Number, default: 98 },
    teamSize: { type: Number, default: 5 },
    missionStatement: { type: String, default: '' },
    visionStatement: { type: String, default: '' }
  },
  
  // Feature Toggles
  features: {
    enableChatbot: { type: Boolean, default: true },
    enableTestimonials: { type: Boolean, default: true },
    enableBlog: { type: Boolean, default: true },
    enableNewsletter: { type: Boolean, default: true },
    enableSocialMedia: { type: Boolean, default: true },
    showPricing: { type: Boolean, default: true }
  },
  
  // Testimonials Settings
  testimonialsSettings: {
    autoRotate: { type: Boolean, default: true },
    rotateSpeed: { type: Number, default: 5000 },
    showCount: { type: Number, default: 5 }
  },
  
  // Booking Settings
  bookingSettings: {
    confirmationMessage: { type: String, default: 'Thank you for booking! We will contact you within 24 hours.' },
    termsAndConditions: { type: String, default: '' },
    maxFileSize: { type: Number, default: 5 },
    allowedFileTypes: { type: String, default: '.pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx' }
  },
  
  // Promotional
  promotional: {
    bannerEnabled: { type: Boolean, default: false },
    bannerText: { type: String, default: '' },
    bannerLink: { type: String, default: '' },
    discountText: { type: String, default: '' }
  },
  
  // Policies
  privacyPolicy: {
    type: String,
    default: ''
  },
  termsConditions: {
    type: String,
    default: ''
  },
  refundPolicy: {
    type: String,
    default: ''
  },
  
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
