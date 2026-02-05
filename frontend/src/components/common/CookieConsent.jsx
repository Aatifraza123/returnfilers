import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('returnfilersCookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('returnfilersCookieConsent', 'true');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('returnfilersCookieConsent', 'false');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] animate-slide-up">
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Content */}
            <div className="flex items-start gap-3 flex-1">
              <span className="text-2xl">🍪</span>
              <div>
                <p className="text-gray-900 text-sm font-medium mb-1">
                  We use cookies
                </p>
                <p className="text-gray-600 text-sm">
                  We use cookies to improve your experience.{' '}
                  <Link 
                    to="/cookie-policy" 
                    className="text-blue-600 underline hover:text-blue-700"
                  >
                    Learn more
                  </Link>
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={handleDecline}
                className="flex-1 md:flex-none px-5 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 md:flex-none px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
