import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaSave, FaBuilding, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFileAlt, FaShareAlt, FaClock, FaSearch, FaInfoCircle } from 'react-icons/fa';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('company'); // 'company', 'social', 'hours', 'seo', 'about', 'privacy', 'terms', 'refund'
  const [settings, setSettings] = useState({
    companyName: '',
    email: '',
    phone: '',
    address: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: '',
      youtube: '',
      whatsapp: ''
    },
    businessHours: {
      weekdays: '',
      saturday: '',
      sunday: '',
      holidays: ''
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      googleAnalyticsId: '',
      googleTagManagerId: '',
      facebookPixelId: ''
    },
    about: {
      yearEstablished: 2022,
      yearsOfExperience: 3,
      clientsServed: 100,
      teamSize: 5,
      missionStatement: '',
      visionStatement: ''
    },
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
      console.log('💾 Saving settings:', settings);
      const { data } = await api.put('/settings', settings);
      console.log('✅ Save response:', data);
      if (data.success) {
        toast.success('Settings updated successfully!');
        setSettings(data.data);
        console.log('✅ Updated settings state:', data.data);
      }
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      console.error('Error response:', error.response?.data);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setSettings(prev => ({ ...prev, [field]: value }));
    }
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
          Company
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-3 font-semibold text-sm transition-colors whitespace-nowrap ${
            activeTab === 'social'
              ? 'text-[#C9A227] border-b-2 border-[#C9A227]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaShareAlt className="inline mr-2" size={14} />
          Social Media
        </button>
        <button
          onClick={() => setActiveTab('hours')}
          className={`px-4 py-3 font-semibold text-sm transition-colors whitespace-nowrap ${
            activeTab === 'hours'
              ? 'text-[#C9A227] border-b-2 border-[#C9A227]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaClock className="inline mr-2" size={14} />
          Business Hours
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-3 font-semibold text-sm transition-colors whitespace-nowrap ${
            activeTab === 'seo'
              ? 'text-[#C9A227] border-b-2 border-[#C9A227]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaSearch className="inline mr-2" size={14} />
          SEO
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-4 py-3 font-semibold text-sm transition-colors whitespace-nowrap ${
            activeTab === 'about'
              ? 'text-[#C9A227] border-b-2 border-[#C9A227]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaInfoCircle className="inline mr-2" size={14} />
          About
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
          Privacy
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
          Terms
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
          Refund
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

        {activeTab === 'social' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#0B1530] mb-4">Social Media Links</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Facebook</label>
                <input
                  type="url"
                  value={settings.socialMedia?.facebook || ''}
                  onChange={(e) => handleChange('socialMedia.facebook', e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Instagram</label>
                <input
                  type="url"
                  value={settings.socialMedia?.instagram || ''}
                  onChange={(e) => handleChange('socialMedia.instagram', e.target.value)}
                  placeholder="https://instagram.com/yourprofile"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">LinkedIn</label>
                <input
                  type="url"
                  value={settings.socialMedia?.linkedin || ''}
                  onChange={(e) => handleChange('socialMedia.linkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/yourcompany"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Twitter/X</label>
                <input
                  type="url"
                  value={settings.socialMedia?.twitter || ''}
                  onChange={(e) => handleChange('socialMedia.twitter', e.target.value)}
                  placeholder="https://twitter.com/yourhandle"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">YouTube</label>
                <input
                  type="url"
                  value={settings.socialMedia?.youtube || ''}
                  onChange={(e) => handleChange('socialMedia.youtube', e.target.value)}
                  placeholder="https://youtube.com/@yourchannel"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp Business</label>
                <input
                  type="url"
                  value={settings.socialMedia?.whatsapp || ''}
                  onChange={(e) => handleChange('socialMedia.whatsapp', e.target.value)}
                  placeholder="https://wa.me/918447127264"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hours' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#0B1530] mb-4">Business Hours</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Weekdays (Mon-Fri)</label>
              <input
                type="text"
                value={settings.businessHours?.weekdays || ''}
                onChange={(e) => handleChange('businessHours.weekdays', e.target.value)}
                placeholder="Monday - Friday: 9:00 AM - 6:00 PM"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Saturday</label>
              <input
                type="text"
                value={settings.businessHours?.saturday || ''}
                onChange={(e) => handleChange('businessHours.saturday', e.target.value)}
                placeholder="Saturday: 10:00 AM - 2:00 PM"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Sunday</label>
              <input
                type="text"
                value={settings.businessHours?.sunday || ''}
                onChange={(e) => handleChange('businessHours.sunday', e.target.value)}
                placeholder="Sunday: Closed"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Holidays</label>
              <input
                type="text"
                value={settings.businessHours?.holidays || ''}
                onChange={(e) => handleChange('businessHours.holidays', e.target.value)}
                placeholder="Closed on public holidays"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
              />
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#0B1530] mb-4">SEO Settings</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Title</label>
              <input
                type="text"
                value={settings.seo?.metaTitle || ''}
                onChange={(e) => handleChange('seo.metaTitle', e.target.value)}
                placeholder="ReturnFilers - Professional CA Services"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Description</label>
              <textarea
                value={settings.seo?.metaDescription || ''}
                onChange={(e) => handleChange('seo.metaDescription', e.target.value)}
                placeholder="Expert Chartered Accountant services for tax filing, GST, auditing, and business registration."
                rows="3"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Keywords</label>
              <input
                type="text"
                value={settings.seo?.metaKeywords || ''}
                onChange={(e) => handleChange('seo.metaKeywords', e.target.value)}
                placeholder="CA, Chartered Accountant, Tax Filing, GST, Audit"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Comma-separated keywords</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Analytics ID</label>
                <input
                  type="text"
                  value={settings.seo?.googleAnalyticsId || ''}
                  onChange={(e) => handleChange('seo.googleAnalyticsId', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Tag Manager ID</label>
                <input
                  type="text"
                  value={settings.seo?.googleTagManagerId || ''}
                  onChange={(e) => handleChange('seo.googleTagManagerId', e.target.value)}
                  placeholder="GTM-XXXXXXX"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Facebook Pixel ID</label>
                <input
                  type="text"
                  value={settings.seo?.facebookPixelId || ''}
                  onChange={(e) => handleChange('seo.facebookPixelId', e.target.value)}
                  placeholder="XXXXXXXXXXXXXXX"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#0B1530] mb-4">About Company</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Year Established</label>
                <input
                  type="number"
                  value={settings.about?.yearEstablished || 2022}
                  onChange={(e) => handleChange('about.yearEstablished', parseInt(e.target.value))}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Years of Experience</label>
                <input
                  type="number"
                  value={settings.about?.yearsOfExperience || 3}
                  onChange={(e) => handleChange('about.yearsOfExperience', parseInt(e.target.value))}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Clients Served</label>
                <input
                  type="number"
                  value={settings.about?.clientsServed || 100}
                  onChange={(e) => handleChange('about.clientsServed', parseInt(e.target.value))}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Team Size</label>
                <input
                  type="number"
                  value={settings.about?.teamSize || 5}
                  onChange={(e) => handleChange('about.teamSize', parseInt(e.target.value))}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mission Statement</label>
              <textarea
                value={settings.about?.missionStatement || ''}
                onChange={(e) => handleChange('about.missionStatement', e.target.value)}
                placeholder="Our mission is to..."
                rows="3"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Vision Statement</label>
              <textarea
                value={settings.about?.visionStatement || ''}
                onChange={(e) => handleChange('about.visionStatement', e.target.value)}
                placeholder="Our vision is to..."
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
