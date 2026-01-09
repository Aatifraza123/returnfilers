import { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
// Updated icons for admin settings tabs
import { FaSave, FaBuilding, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFileAlt, FaShareAlt, FaClock, FaSearch, FaInfoCircle, FaPaintBrush, FaStar, FaAlignLeft, FaCog, FaCalendarAlt, FaBullhorn } from 'react-icons/fa';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('company'); // tabs: company, contact, brand, hero, footer, social, hours, seo, about, features, booking, promotional, policies
  
  // Use global settings context
  const { refreshSettings } = useSettings();
  
  const [settings, setSettings] = useState({
    companyName: '',
    email: '',
    phone: '',
    whatsapp: '',
    supportEmail: '',
    address: '',
    businessDetails: {
      gstNumber: '',
      panNumber: '',
      registrationNumber: '',
      certifications: '',
      workingDays: 'Monday - Saturday'
    },
    brandColors: {
      primary: '#0B1530',
      secondary: '#C9A227',
      accent: '#1a2b5c'
    },
    hero: {
      title: 'Professional Tax & Financial Services',
      subtitle: 'Expert Chartered Accountants for Your Business Growth',
      ctaText: 'Get Started',
      ctaLink: '/quote',
      backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop'
    },
    footer: {
      description: 'Professional chartered accountancy services with expertise in taxation, auditing, and financial consulting.',
      copyrightText: '© 2024 ReturnFilers. All rights reserved.',
      quickLinks: []
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: '',
      youtube: '',
      whatsapp: ''
    },
    socialMediaColors: {
      iconColor: '#C9A227',
      iconHoverColor: '#FFFFFF'
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
      faviconUrl: '/favicon.svg',
      ogImage: '',
      googleAnalyticsId: '',
      googleTagManagerId: '',
      facebookPixelId: ''
    },
    about: {
      yearEstablished: 2022,
      yearsOfExperience: 3,
      clientsServed: 100,
      projectsCompleted: 200,
      successRate: 98,
      teamSize: 5,
      missionStatement: '',
      visionStatement: ''
    },
    features: {
      enableChatbot: true,
      enableTestimonials: true,
      enableBlog: true,
      enableNewsletter: true,
      showPricing: true
    },
    testimonialsSettings: {
      autoRotate: true,
      rotateSpeed: 5000,
      showCount: 5
    },
    bookingSettings: {
      confirmationMessage: 'Thank you for booking! We will contact you within 24 hours.',
      termsAndConditions: '',
      maxFileSize: 5,
      allowedFileTypes: '.pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx'
    },
    promotional: {
      bannerEnabled: false,
      bannerText: '',
      bannerLink: '',
      discountText: ''
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
      console.log('📸 Logo URL:', settings.logo);
      console.log('📝 Logo Text:', settings.logoText);
      
      const { data } = await api.put('/settings', settings);
      console.log('✅ Save response:', data);
      
      if (data.success) {
        toast.success('Settings updated successfully!');
        setSettings(data.data);
        console.log('✅ Updated settings state:', data.data);
        console.log('📸 Logo after save:', data.data.logo);
        
        // Refresh global settings context
        setTimeout(() => {
          refreshSettings();
          console.log('🔄 Global settings refreshed');
        }, 500);
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
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-3 font-semibold text-sm transition-colors whitespace-nowrap ${
            activeTab === 'contact'
              ? 'text-[#C9A227] border-b-2 border-[#C9A227]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaPhone className="inline mr-2" size={14} />
          Contact
        </button>
        <button
          onClick={() => setActiveTab('brand')}
          className={`px-4 py-3 font-semibold text-sm transition-colors whitespace-nowrap ${
            activeTab === 'brand'
              ? 'text-[#C9A227] border-b-2 border-[#C9A227]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaPaintBrush className="inline mr-2" size={14} />
          Brand
        </button>
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-3 font-semibold text-sm transition-colors whitespace-nowrap ${
            activeTab === 'hero'
              ? 'text-[#C9A227] border-b-2 border-[#C9A227]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaStar className="inline mr-2" size={14} />
          Hero
        </button>
        <button
          onClick={() => setActiveTab('footer')}
          className={`px-4 py-3 font-semibold text-sm transition-colors whitespace-nowrap ${
            activeTab === 'footer'
              ? 'text-[#C9A227] border-b-2 border-[#C9A227]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaAlignLeft className="inline mr-2" size={14} />
          Footer
        </button>
        <button
          onClick={() => setActiveTab('features')}
          className={`px-4 py-3 font-semibold text-sm transition-colors whitespace-nowrap ${
            activeTab === 'features'
              ? 'text-[#C9A227] border-b-2 border-[#C9A227]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaCog className="inline mr-2" size={14} />
          Features
        </button>
        <button
          onClick={() => setActiveTab('booking')}
          className={`px-4 py-3 font-semibold text-sm transition-colors whitespace-nowrap ${
            activeTab === 'booking'
              ? 'text-[#C9A227] border-b-2 border-[#C9A227]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaCalendarAlt className="inline mr-2" size={14} />
          Booking
        </button>
        <button
          onClick={() => setActiveTab('promotional')}
          className={`px-4 py-3 font-semibold text-sm transition-colors whitespace-nowrap ${
            activeTab === 'promotional'
              ? 'text-[#C9A227] border-b-2 border-[#C9A227]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaBullhorn className="inline mr-2" size={14} />
          Promo
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
                Logo Image URL
              </label>
              <input
                type="url"
                value={settings.logo || ''}
                onChange={(e) => handleChange('logo', e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Enter logo image URL (PNG, SVG, or JPG)</p>
              {settings.logo && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">Preview:</p>
                  <img src={settings.logo} alt="Logo Preview" className="h-12 object-contain" onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Logo Text (Fallback)
              </label>
              <input
                type="text"
                value={settings.logoText || 'RF'}
                onChange={(e) => handleChange('logoText', e.target.value)}
                placeholder="RF"
                maxLength="3"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Text to show if logo image is not available (max 3 characters)</p>
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
          <div className="space-y-6">
            <div>
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

            {/* Social Media Icon Colors */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-[#0B1530] mb-4">Social Media Icon Colors</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon Color (Default)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.socialMediaColors?.iconColor || '#C9A227'}
                      onChange={(e) => handleChange('socialMediaColors.iconColor', e.target.value)}
                      className="w-16 h-12 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.socialMediaColors?.iconColor || '#C9A227'}
                      onChange={(e) => handleChange('socialMediaColors.iconColor', e.target.value)}
                      placeholder="#C9A227"
                      className="flex-1 border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm font-mono"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Default color for social media icons</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon Hover Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.socialMediaColors?.iconHoverColor || '#FFFFFF'}
                      onChange={(e) => handleChange('socialMediaColors.iconHoverColor', e.target.value)}
                      className="w-16 h-12 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.socialMediaColors?.iconHoverColor || '#FFFFFF'}
                      onChange={(e) => handleChange('socialMediaColors.iconHoverColor', e.target.value)}
                      placeholder="#FFFFFF"
                      className="flex-1 border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm font-mono"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Color when hovering over icons</p>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-700 mb-3">Preview:</p>
                <div className="flex gap-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer"
                    style={{ 
                      backgroundColor: '#000',
                      color: settings.socialMediaColors?.iconColor || '#C9A227'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = settings.socialMediaColors?.iconHoverColor || '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = settings.socialMediaColors?.iconColor || '#C9A227';
                    }}
                  >
                    <FaShareAlt size={18} />
                  </div>
                  <p className="text-sm text-gray-600 flex items-center">Hover to see color change</p>
                </div>
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
                placeholder="Weekdays: 9:00 AM - 6:00 PM"
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Projects Completed</label>
                <input
                  type="number"
                  value={settings.about?.projectsCompleted || 200}
                  onChange={(e) => handleChange('about.projectsCompleted', parseInt(e.target.value))}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Success Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.about?.successRate || 98}
                  onChange={(e) => handleChange('about.successRate', parseInt(e.target.value))}
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

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#0B1530] mb-4">Contact Information</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp Number</label>
                <input
                  type="text"
                  value={settings.whatsapp || ''}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Support Email</label>
                <input
                  type="email"
                  value={settings.supportEmail || ''}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                  placeholder="support@example.com"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-[#0B1530] mt-6 mb-4">Business Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">GST Number</label>
                <input
                  type="text"
                  value={settings.businessDetails?.gstNumber || ''}
                  onChange={(e) => handleChange('businessDetails.gstNumber', e.target.value)}
                  placeholder="22AAAAA0000A1Z5"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">PAN Number</label>
                <input
                  type="text"
                  value={settings.businessDetails?.panNumber || ''}
                  onChange={(e) => handleChange('businessDetails.panNumber', e.target.value)}
                  placeholder="AAAAA0000A"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Registration Number</label>
                <input
                  type="text"
                  value={settings.businessDetails?.registrationNumber || ''}
                  onChange={(e) => handleChange('businessDetails.registrationNumber', e.target.value)}
                  placeholder="Company Registration Number"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Working Days</label>
                <input
                  type="text"
                  value={settings.businessDetails?.workingDays || ''}
                  onChange={(e) => handleChange('businessDetails.workingDays', e.target.value)}
                  placeholder="Monday - Saturday"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Certifications/Licenses</label>
              <textarea
                value={settings.businessDetails?.certifications || ''}
                onChange={(e) => handleChange('businessDetails.certifications', e.target.value)}
                placeholder="List your certifications and licenses"
                rows="3"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm resize-none"
              />
            </div>
          </div>
        )}

        {/* Brand Colors Tab */}
        {activeTab === 'brand' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#0B1530] mb-4">Brand Colors</h2>
            <p className="text-sm text-gray-600 mb-6">Customize your website's color scheme. Changes will apply across the entire website.</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={settings.brandColors?.primary || '#0B1530'}
                    onChange={(e) => handleChange('brandColors.primary', e.target.value)}
                    className="w-16 h-16 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.brandColors?.primary || '#0B1530'}
                    onChange={(e) => handleChange('brandColors.primary', e.target.value)}
                    placeholder="#0B1530"
                    className="flex-1 border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm font-mono"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Used for headers, buttons, and main elements</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={settings.brandColors?.secondary || '#C9A227'}
                    onChange={(e) => handleChange('brandColors.secondary', e.target.value)}
                    className="w-16 h-16 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.brandColors?.secondary || '#C9A227'}
                    onChange={(e) => handleChange('brandColors.secondary', e.target.value)}
                    placeholder="#C9A227"
                    className="flex-1 border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm font-mono"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Used for accents, highlights, and CTAs</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={settings.brandColors?.accent || '#1a2b5c'}
                    onChange={(e) => handleChange('brandColors.accent', e.target.value)}
                    className="w-16 h-16 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.brandColors?.accent || '#1a2b5c'}
                    onChange={(e) => handleChange('brandColors.accent', e.target.value)}
                    placeholder="#1a2b5c"
                    className="flex-1 border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm font-mono"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Used for gradients and secondary elements</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Color changes require page refresh to take full effect. Make sure to save changes before refreshing.
              </p>
            </div>
          </div>
        )}

        {/* Hero Section Tab */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#0B1530] mb-4">Hero Section</h2>
            <p className="text-sm text-gray-600 mb-6">Customize the main hero section on your homepage.</p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Hero Title</label>
              <input
                type="text"
                value={settings.hero?.title || ''}
                onChange={(e) => handleChange('hero.title', e.target.value)}
                placeholder="Professional Tax & Financial Services"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Hero Subtitle</label>
              <textarea
                value={settings.hero?.subtitle || ''}
                onChange={(e) => handleChange('hero.subtitle', e.target.value)}
                placeholder="Expert Chartered Accountants for Your Business Growth"
                rows="2"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm resize-none"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">CTA Button Text</label>
                <input
                  type="text"
                  value={settings.hero?.ctaText || ''}
                  onChange={(e) => handleChange('hero.ctaText', e.target.value)}
                  placeholder="Get Started"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">CTA Button Link</label>
                <input
                  type="text"
                  value={settings.hero?.ctaLink || ''}
                  onChange={(e) => handleChange('hero.ctaLink', e.target.value)}
                  placeholder="/quote"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Background Image URL</label>
              <input
                type="url"
                value={settings.hero?.backgroundImage || ''}
                onChange={(e) => handleChange('hero.backgroundImage', e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">Use high-quality images (1920x1080 or larger recommended)</p>
            </div>
          </div>
        )}

        {/* Footer Tab */}
        {activeTab === 'footer' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#0B1530] mb-4">Footer Content</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Footer Description</label>
              <textarea
                value={settings.footer?.description || ''}
                onChange={(e) => handleChange('footer.description', e.target.value)}
                placeholder="Professional chartered accountancy services..."
                rows="3"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Copyright Text</label>
              <input
                type="text"
                value={settings.footer?.copyrightText || ''}
                onChange={(e) => handleChange('footer.copyrightText', e.target.value)}
                placeholder="© 2024 ReturnFilers. All rights reserved."
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
              />
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#0B1530] mb-4">Feature Toggles</h2>
            <p className="text-sm text-gray-600 mb-6">Enable or disable website features.</p>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                <div>
                  <div className="font-medium text-gray-900">AI Chatbot</div>
                  <div className="text-sm text-gray-500">Show AI assistant chatbot on website</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.features?.enableChatbot || false}
                  onChange={(e) => handleChange('features.enableChatbot', e.target.checked)}
                  className="w-5 h-5 text-[#C9A227] rounded focus:ring-[#C9A227]"
                />
              </label>
              
              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                <div>
                  <div className="font-medium text-gray-900">Testimonials Section</div>
                  <div className="text-sm text-gray-500">Display client testimonials</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.features?.enableTestimonials || false}
                  onChange={(e) => handleChange('features.enableTestimonials', e.target.checked)}
                  className="w-5 h-5 text-[#C9A227] rounded focus:ring-[#C9A227]"
                />
              </label>
              
              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                <div>
                  <div className="font-medium text-gray-900">Blog Section</div>
                  <div className="text-sm text-gray-500">Show blog posts and articles</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.features?.enableBlog || false}
                  onChange={(e) => handleChange('features.enableBlog', e.target.checked)}
                  className="w-5 h-5 text-[#C9A227] rounded focus:ring-[#C9A227]"
                />
              </label>
              
              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                <div>
                  <div className="font-medium text-gray-900">Newsletter Subscription</div>
                  <div className="text-sm text-gray-500">Allow users to subscribe to newsletter</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.features?.enableNewsletter || false}
                  onChange={(e) => handleChange('features.enableNewsletter', e.target.checked)}
                  className="w-5 h-5 text-[#C9A227] rounded focus:ring-[#C9A227]"
                />
              </label>
              
              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                <div>
                  <div className="font-medium text-gray-900">Show Pricing</div>
                  <div className="text-sm text-gray-500">Display prices on service pages</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.features?.showPricing || false}
                  onChange={(e) => handleChange('features.showPricing', e.target.checked)}
                  className="w-5 h-5 text-[#C9A227] rounded focus:ring-[#C9A227]"
                />
              </label>
            </div>
            
            <h3 className="text-lg font-semibold text-[#0B1530] mt-8 mb-4">Testimonials Settings</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <label className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.testimonialsSettings?.autoRotate || false}
                  onChange={(e) => handleChange('testimonialsSettings.autoRotate', e.target.checked)}
                  className="w-5 h-5 text-[#C9A227] rounded focus:ring-[#C9A227] mr-3"
                />
                <div className="text-sm font-medium text-gray-900">Auto-rotate</div>
              </label>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Rotate Speed (ms)</label>
                <input
                  type="number"
                  value={settings.testimonialsSettings?.rotateSpeed || 5000}
                  onChange={(e) => handleChange('testimonialsSettings.rotateSpeed', parseInt(e.target.value))}
                  min="1000"
                  step="1000"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Show Count</label>
                <input
                  type="number"
                  value={settings.testimonialsSettings?.showCount || 5}
                  onChange={(e) => handleChange('testimonialsSettings.showCount', parseInt(e.target.value))}
                  min="1"
                  max="20"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Booking Tab */}
        {activeTab === 'booking' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#0B1530] mb-4">Booking Settings</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmation Message</label>
              <textarea
                value={settings.bookingSettings?.confirmationMessage || ''}
                onChange={(e) => handleChange('bookingSettings.confirmationMessage', e.target.value)}
                placeholder="Thank you for booking! We will contact you within 24 hours."
                rows="3"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm resize-none"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Max File Size (MB)</label>
                <input
                  type="number"
                  value={settings.bookingSettings?.maxFileSize || 5}
                  onChange={(e) => handleChange('bookingSettings.maxFileSize', parseInt(e.target.value))}
                  min="1"
                  max="50"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Allowed File Types</label>
                <input
                  type="text"
                  value={settings.bookingSettings?.allowedFileTypes || ''}
                  onChange={(e) => handleChange('bookingSettings.allowedFileTypes', e.target.value)}
                  placeholder=".pdf,.doc,.docx,.jpg,.png"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Terms & Conditions</label>
              <textarea
                value={settings.bookingSettings?.termsAndConditions || ''}
                onChange={(e) => handleChange('bookingSettings.termsAndConditions', e.target.value)}
                placeholder="Enter booking terms and conditions..."
                rows="6"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm resize-none"
              />
            </div>
          </div>
        )}

        {/* Promotional Tab */}
        {activeTab === 'promotional' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#0B1530] mb-4">Promotional Settings</h2>
            
            <label className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.promotional?.bannerEnabled || false}
                onChange={(e) => handleChange('promotional.bannerEnabled', e.target.checked)}
                className="w-5 h-5 text-[#C9A227] rounded focus:ring-[#C9A227] mr-3"
              />
              <div>
                <div className="font-medium text-gray-900">Enable Promotional Banner</div>
                <div className="text-sm text-gray-500">Show banner at top of website</div>
              </div>
            </label>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Banner Text</label>
              <input
                type="text"
                value={settings.promotional?.bannerText || ''}
                onChange={(e) => handleChange('promotional.bannerText', e.target.value)}
                placeholder="🎉 Special Offer: Get 20% off on all services!"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Banner Link (Optional)</label>
              <input
                type="text"
                value={settings.promotional?.bannerLink || ''}
                onChange={(e) => handleChange('promotional.bannerLink', e.target.value)}
                placeholder="/quote"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Text</label>
              <input
                type="text"
                value={settings.promotional?.discountText || ''}
                onChange={(e) => handleChange('promotional.discountText', e.target.value)}
                placeholder="Limited Time Offer - 20% OFF"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
