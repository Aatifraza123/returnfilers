const express = require('express');
const router = express.Router();
const Service = require('../models/serviceModel');
const Blog = require('../models/blogModel');
const DigitalService = require('../models/DigitalService');

// @desc    Generate XML Sitemap
// @route   GET /api/sitemap
// @access  Public
router.get('/', async (req, res) => {
  try {
    const baseUrl = 'https://www.returnfilers.in';
    const currentDate = new Date().toISOString();

    // Fetch all active services, blogs, and digital services
    const [services, blogs, digitalServices] = await Promise.all([
      Service.find({ active: true }).select('_id slug updatedAt'),
      Blog.find().select('_id slug updatedAt'),
      DigitalService.find({ active: true }).select('_id slug updatedAt')
    ]);

    // Static pages
    const staticPages = [
      { url: '', changefreq: 'daily', priority: '1.0' },
      { url: '/about', changefreq: 'monthly', priority: '0.8' },
      { url: '/services', changefreq: 'weekly', priority: '0.9' },
      { url: '/digital-services', changefreq: 'weekly', priority: '0.9' },
      { url: '/expertise', changefreq: 'monthly', priority: '0.8' },
      { url: '/blog', changefreq: 'daily', priority: '0.9' },
      { url: '/contact', changefreq: 'monthly', priority: '0.7' },
      { url: '/quote', changefreq: 'monthly', priority: '0.7' },
      { url: '/booking', changefreq: 'monthly', priority: '0.7' }
    ];

    // Expertise pages
    const expertisePages = [
      'tax-consulting',
      'auditing',
      'financial-advisory',
      'business-consulting'
    ];

    // Build XML
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
      xml += `    <priority>0.8</priority>\n`;
      xml += '  </url>\n';
    });

    // Add service pages
    services.forEach(service => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/services/${service._id}</loc>\n`;
      xml += `    <lastmod>${service.updatedAt || currentDate}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += '  </url>\n';
    });

    // Add digital service pages
    digitalServices.forEach(service => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/digital-services/${service.slug}</loc>\n`;
      xml += `    <lastmod>${service.updatedAt || currentDate}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += '  </url>\n';
    });

    // Add blog pages
    blogs.forEach(blog => {
      const blogSlug = blog.slug || blog._id;
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/blog/${blogSlug}</loc>\n`;
      xml += `    <lastmod>${blog.updatedAt || currentDate}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';

    // Set proper headers for XML
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

module.exports = router;
