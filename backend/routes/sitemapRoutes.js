const express = require('express');
const router = express.Router();
const Service = require('../models/serviceModel');
const Blog = require('../models/blogModel');
const DigitalService = require('../models/DigitalService');

// @desc    Generate XML Sitemap
// @route   GET /sitemap.xml
// @access  Public
router.get('/', async (req, res) => {
  try {
    const baseUrl = 'https://www.returnfilers.in';
    // Use UTC date to avoid timezone issues
    const now = new Date();
    const currentDate = now.getFullYear() + '-' + 
                       String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                       String(now.getDate()).padStart(2, '0');
    
    console.log(`🗓️ Generating sitemap for date: ${currentDate}`);

    // Fetch all active services, published blogs, and active digital services
    const [services, blogs, digitalServices] = await Promise.all([
      Service.find({ active: true }).select('_id title slug updatedAt createdAt'),
      Blog.find({ isPublished: true }).select('_id title slug updatedAt createdAt'),
      DigitalService.find({ active: true }).select('_id title slug updatedAt createdAt')
    ]);

    // Static pages with proper priorities and change frequencies
    const staticPages = [
      { url: '', changefreq: 'daily', priority: '1.0' },
      { url: '/about', changefreq: 'monthly', priority: '0.9' },
      { url: '/services', changefreq: 'weekly', priority: '0.9' },
      { url: '/digital-services', changefreq: 'weekly', priority: '0.9' },
      { url: '/expertise', changefreq: 'monthly', priority: '0.8' },
      { url: '/blog', changefreq: 'daily', priority: '0.8' },
      { url: '/contact', changefreq: 'monthly', priority: '0.7' },
      { url: '/quote', changefreq: 'monthly', priority: '0.8' },
      { url: '/booking', changefreq: 'monthly', priority: '0.8' },
      { url: '/auth', changefreq: 'yearly', priority: '0.3' }
    ];

    // Expertise pages
    const expertisePages = [
      'tax-consulting',
      'auditing', 
      'financial-advisory',
      'business-consulting',
      'gst-services',
      'company-registration'
    ];

    // Build XML with proper formatting
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    staticPages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    });

    // Add expertise pages
    expertisePages.forEach(slug => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/expertise/${slug}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += '  </url>\n';
    });

    // Add service pages (use slug if available, otherwise ID)
    services.forEach(service => {
      const serviceSlug = service.slug || service._id;
      let lastMod = currentDate;
      if (service.updatedAt) {
        const updateDate = new Date(service.updatedAt);
        lastMod = updateDate.getFullYear() + '-' + 
                 String(updateDate.getMonth() + 1).padStart(2, '0') + '-' + 
                 String(updateDate.getDate()).padStart(2, '0');
      }
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/services/${serviceSlug}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += '  </url>\n';
    });

    // Add digital service pages
    digitalServices.forEach(service => {
      const serviceSlug = service.slug || service._id;
      let lastMod = currentDate;
      if (service.updatedAt) {
        const updateDate = new Date(service.updatedAt);
        lastMod = updateDate.getFullYear() + '-' + 
                 String(updateDate.getMonth() + 1).padStart(2, '0') + '-' + 
                 String(updateDate.getDate()).padStart(2, '0');
      }
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/digital-services/${serviceSlug}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += '  </url>\n';
    });

    // Add blog pages
    blogs.forEach(blog => {
      const blogSlug = blog.slug || blog._id;
      let lastMod = currentDate;
      if (blog.updatedAt) {
        const updateDate = new Date(blog.updatedAt);
        lastMod = updateDate.getFullYear() + '-' + 
                 String(updateDate.getMonth() + 1).padStart(2, '0') + '-' + 
                 String(updateDate.getDate()).padStart(2, '0');
      }
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/blog/${blogSlug}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';

    // Set proper headers for XML
    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(xml);
    
    console.log(`✅ Sitemap generated with ${staticPages.length + expertisePages.length + services.length + digitalServices.length + blogs.length} URLs`);
  } catch (error) {
    console.error('❌ Sitemap generation error:', error);
    res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><error>Sitemap generation failed</error>');
  }
});

module.exports = router;
