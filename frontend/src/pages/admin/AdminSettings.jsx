import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaSave, FaBuilding, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFileAlt } from 'react-icons/fa';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('company'); // 'company', 'privacy', 'terms', 'refund'
  const [settings, setSettings] = useState({
    companyName: '',
    email: '',
    phone: '',
    address: '',
    privacyPolicy: '',
    termsConditions: '',
    refundPolicy: '',
    lastUpdated: null
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/settings', settings);
      if (data.success) {
        toast.success('Settings updated successfully!');
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-12 h-12 border-4 border-[#C9A227] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0B1530]">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage company information and policies
            {settings.lastUpdated && (
              <span className="ml-2 text-xs">
                • Last updated: {new Date(settings.lastUpdated).toLocaleDateString('en-IN')}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0B1530] to-[#1a2b5c] text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50"
        >
          <FaSave size={12} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('company')}
          className={`px-4 py-3 font-semibold text-sm transition-colors whitespace-nowrap ${
            activeTab === 'company'
              ? 'text-[#C9A227] border-b-2 border-[#C9A227]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaBuilding className="inline mr-2" size={14} />
          Company Info
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-3 font-semibold text-sm transition-colors whitespace-nowrap ${
            activeTab === 'privacy'
              ? 'text-[#C9A227] border-b-2 border-[#C9A227]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaFileAlt className="inline mr-2" size={14} />
          Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`px-4 py-3 font-semibold text-sm transition-colors whitespace-nowrap ${
            activeTab === 'terms'
              ? 'text-[#C9A227] border-b-2 border-[#C9A227]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaFileAlt className="inline mr-2" size={14} />
          Terms & Conditions
        </button>
        <button
          onClick={() => setActiveTab('refund')}
          className={`px-4 py-3 font-semibold text-sm transition-colors whitespace-nowrap ${
            activeTab === 'refund'
              ? 'text-[#C9A227] border-b-2 border-[#C9A227]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaFileAlt className="inline mr-2" size={14} />
          Refund Policy
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {activeTab === 'company' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#0B1530] mb-4">Company Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <FaBuilding className="inline mr-2" size={12} />
                Company Name
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <FaEnvelope className="inline mr-2" size={12} />
                Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <FaPhone className="inline mr-2" size={12} />
                Phone
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <FaMapMarkerAlt className="inline mr-2" size={12} />
                Address
              </label>
              <textarea
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                rows="3"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm resize-none"
              />
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div>
            <h2 className="text-xl font-bold text-[#0B1530] mb-4">Privacy Policy</h2>
            <textarea
              value={settings.privacyPolicy}
              onChange={(e) => handleChange('privacyPolicy', e.target.value)}
              rows="20"
              placeholder="Enter your privacy policy content here..."
              className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm resize-none font-mono"
            />
            <p className="text-xs text-gray-500 mt-2">
              Tip: You can use line breaks and basic formatting. This will be displayed on the Privacy Policy page.
            </p>
          </div>
        )}

        {activeTab === 'terms' && (
          <div>
            <h2 className="text-xl font-bold text-[#0B1530] mb-4">Terms & Conditions</h2>
            <textarea
              value={settings.termsConditions}
              onChange={(e) => handleChange('termsConditions', e.target.value)}
              rows="20"
              placeholder="Enter your terms & conditions content here..."
              className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm resize-none font-mono"
            />
            <p className="text-xs text-gray-500 mt-2">
              Tip: You can use line breaks and basic formatting. This will be displayed on the Terms & Conditions page.
            </p>
          </div>
        )}

        {activeTab === 'refund' && (
          <div>
            <h2 className="text-xl font-bold text-[#0B1530] mb-4">Refund Policy</h2>
            <textarea
              value={settings.refundPolicy}
              onChange={(e) => handleChange('refundPolicy', e.target.value)}
              rows="20"
              placeholder="Enter your refund policy content here..."
              className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm resize-none font-mono"
            />
            <p className="text-xs text-gray-500 mt-2">
              Tip: You can use line breaks and basic formatting. This will be displayed on the Refund Policy page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
