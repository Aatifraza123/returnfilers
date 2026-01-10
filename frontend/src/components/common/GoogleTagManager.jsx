import { useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';

const GoogleTagManager = () => {
  const { settings } = useSettings();
  const gtmId = settings?.seo?.googleTagManagerId;

  useEffect(() => {
    if (!gtmId || !gtmId.startsWith('GTM-')) {
      return;
    }

    // Check if GTM already exists
    if (window.dataLayer && document.querySelector(`script[src*="googletagmanager.com/gtm.js?id=${gtmId}"]`)) {
      return;
    }

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });

    // Load GTM script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
    document.head.appendChild(script);

    // Add noscript iframe for GTM
    const noscript = document.createElement('noscript');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    noscript.appendChild(iframe);
    document.body.insertBefore(noscript, document.body.firstChild);

    console.log('✅ Google Tag Manager initialized:', gtmId);

    return () => {
      const scriptToRemove = document.querySelector(`script[src*="googletagmanager.com/gtm.js?id=${gtmId}"]`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [gtmId]);

  return null;
};

export default GoogleTagManager;
