import { useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useLocation } from 'react-router-dom';

const GoogleAnalytics = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const gaId = settings?.seo?.googleAnalyticsId;

  // Initialize Google Analytics
  useEffect(() => {
    if (!gaId || !gaId.startsWith('G-')) {
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${gaId}"]`);
    if (existingScript) {
      return;
    }

    // Load Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', gaId);

    console.log('✅ Google Analytics initialized:', gaId);

    return () => {
      // Cleanup on unmount
      const scriptToRemove = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${gaId}"]`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [gaId]);

  // Track page views on route change
  useEffect(() => {
    if (!gaId || !window.gtag) {
      return;
    }

    // Send page view event
    window.gtag('config', gaId, {
      page_path: location.pathname + location.search,
    });

    console.log('📊 GA Page view:', location.pathname);
  }, [location, gaId]);

  return null; // This component doesn't render anything
};

export default GoogleAnalytics;
