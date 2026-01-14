import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ 
  title = 'ReturnFilers - Expert Chartered Accountants & Tax Consultants',
  description = 'Professional CA services including GST registration, ITR filing, tax planning, auditing, and business consulting.',
  keywords = 'chartered accountant, CA services, GST registration, ITR filing, tax consultant',
  image = 'https://www.returnfilers.in/logo-transparent.png',
  type = 'website'
}) => {
  const location = useLocation();
  const url = `https://www.returnfilers.in${location.pathname}`;

  useEffect(() => {
    // Update title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Primary Meta Tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Open Graph
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);

    // Twitter
    updateMetaTag('twitter:url', url, true);
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', image, true);
  }, [title, description, keywords, image, type, url]);

  return null;
};

export default SEO;
