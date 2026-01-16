import { useEffect, useState } from 'react';
import { useSettings } from '../context/SettingsContext';

const TestSettings = () => {
  const { settings, refreshSettings } = useSettings();
  const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleTimeString());

  const handleRefresh = () => {
    refreshSettings();
    setLastRefresh(new Date().toLocaleTimeString());
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Settings Test Page</h1>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-primary transition"
          >
            Refresh Settings
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">Last refresh: {lastRefresh}</p>

        {settings ? (
          <div className="space-y-6">
            {/* Logo Section */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold mb-3">Logo</h2>
              <div className="space-y-2">
                <p><strong>Logo URL:</strong> {settings.logo || '(empty)'}</p>
                <p><strong>Logo Text:</strong> {settings.logoText || 'RF'}</p>
                {settings.logo && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <img 
                      src={settings.logo} 
                      alt="Logo" 
                      className="h-16 object-contain border p-2"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'block';
                      }}
                    />
                    <p style={{ display: 'none' }} className="text-red-500 text-sm">Failed to load image</p>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media Colors */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold mb-3">Social Media Colors</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <strong>Icon Color:</strong>
                  <div 
                    className="w-12 h-12 rounded border"
                    style={{ backgroundColor: settings.socialMediaColors?.iconColor || '#C9A227' }}
                  ></div>
                  <span>{settings.socialMediaColors?.iconColor || '#C9A227'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <strong>Hover Color:</strong>
                  <div 
                    className="w-12 h-12 rounded border"
                    style={{ backgroundColor: settings.socialMediaColors?.iconHoverColor || '#FFFFFF' }}
                  ></div>
                  <span>{settings.socialMediaColors?.iconHoverColor || '#FFFFFF'}</span>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold mb-3">Company Info</h2>
              <div className="space-y-2">
                <p><strong>Company Name:</strong> {settings.companyName}</p>
                <p><strong>Email:</strong> {settings.email}</p>
                <p><strong>Phone:</strong> {settings.phone}</p>
              </div>
            </div>

            {/* Raw JSON */}
            <div>
              <h2 className="text-xl font-bold mb-3">Raw Settings (JSON)</h2>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                {JSON.stringify(settings, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <p>Loading settings...</p>
        )}
      </div>
    </div>
  );
};

export default TestSettings;
