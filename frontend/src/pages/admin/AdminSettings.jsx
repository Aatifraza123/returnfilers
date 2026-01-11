import { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  FaSave, FaBuilding, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaPaintBrush, FaShareAlt, FaClock, FaSearch, FaInfoCircle, 
  FaCog, FaFileAlt, FaStar, FaAlignLeft, FaBullhorn, FaCalendarAlt 
} from 'react-icons/fa';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('company');
  const { refreshSettings } = useSettings();
  
  const [settings, setSettings] = useState({
    companyName: '',
    email: '',
    phone: '',
    whatsapp: '',
    supportEmail: '',
    address: '',
    logo: '',
    logoText: 'RF',
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
      accent: '#1E3A8A',
      footerBg: '#0B1530',
      footerText: '#ffffff',
      footerLink: '#C9A227',
      footerCompanyName: '#C9A227'
    },
    hero: {
      title: 'Professional Tax & Financial Services',
      subtitle: 'Expert Chartered Accountants for Your Business Growth',
      ctaText: 'Get Started',
      ctaLink: '/quote',
      backgroundImage: ''
    },
    footer: {
      description: '',
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
      facebook: { color: '#1877F2', hoverColor: '#FFFFFF' },
      instagram: { color: '#E4405F', hoverColor: '#FFFFFF' },
      linkedin: { color: '#0A66C2', hoverColor: '#FFFFFF' },
      twitter: { color: '#1DA1F2', hoverColor: '#FFFFFF' },
      youtube: { color: '#FF0000', hoverColor: '#FFFFFF' },
      whatsapp: { color: '#25D366', hoverColor: '#FFFFFF' }
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
      confirmationMessage: '',
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

  const tabs = [
    { id: 'company', label: 'Company', icon: <FaBuilding /> },
    { id: 'brand', label: 'Brand', icon: <FaPaintBrush /> },
    { id: 'hero', label: 'Hero', icon: <FaStar /> },
    { id: 'footer', label: 'Footer', icon: <FaAlignLeft /> },
    { id: 'social', label: 'Social', icon: <FaShareAlt /> },
    { id: 'hours', label: 'Hours', icon: <FaClock /> },
    { id: 'seo', label: 'SEO', icon: <FaSearch /> },
    { id: 'about', label: 'About', icon: <FaInfoCircle /> },
    { id: 'features', label: 'Features', icon: <FaCog /> },
    { id: 'testimonials', label: 'Testimonials', icon: <FaStar /> },
    { id: 'booking', label: 'Booking', icon: <FaCalendarAlt /> },
    { id: 'promotional', label: 'Promotional', icon: <FaBullhorn /> },
    { id: 'policies', label: 'Policies', icon: <FaFileAlt /> }
  ];

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
        toast.success('Settings saved!');
        setSettings(data.data);
        refreshSettings();
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const parts = field.split('.');
      if (parts.length === 2) {
        const [parent, child] = parts;
        setSettings(prev => ({
          ...prev,
          [parent]: { ...prev[parent], [child]: value }
        }));
      } else if (parts.length === 3) {
        const [parent, child, grandchild] = parts;
        setSettings(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: { ...(prev[parent]?.[child] || {}), [grandchild]: value }
          }
        }));
      }
    } else {
      setSettings(prev => ({ ...prev, [field]: value }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage website settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <FaSave />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeTab === 'company' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Company Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input type="text" value={settings.companyName} onChange={(e) => handleChange('companyName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo Text</label>
                <input type="text" value={settings.logoText || 'RF'} onChange={(e) => handleChange('logoText', e.target.value)} maxLength="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={settings.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                <input type="email" value={settings.supportEmail} onChange={(e) => handleChange('supportEmail', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" value={settings.phone} onChange={(e) => handleChange('phone', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input type="text" value={settings.whatsapp} onChange={(e) => handleChange('whatsapp', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input type="url" value={settings.logo || ''} onChange={(e) => handleChange('logo', e.target.value)} placeholder="https://example.com/logo.png" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              {settings.logo && <div className="mt-2 p-3 bg-gray-50 rounded-lg"><img src={settings.logo} alt="Logo" className="h-12 object-contain" onError={(e) => e.target.style.display = 'none'} /></div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea value={settings.address} onChange={(e) => handleChange('address', e.target.value)} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 resize-none" />
            </div>
            <div className="border-t pt-4 mt-4">
              <h3 className="text-md font-bold text-gray-900 mb-3">Business Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                  <input type="text" value={settings.businessDetails?.gstNumber || ''} onChange={(e) => handleChange('businessDetails.gstNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                  <input type="text" value={settings.businessDetails?.panNumber || ''} onChange={(e) => handleChange('businessDetails.panNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                  <input type="text" value={settings.businessDetails?.registrationNumber || ''} onChange={(e) => handleChange('businessDetails.registrationNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Working Days</label>
                  <input type="text" value={settings.businessDetails?.workingDays || ''} onChange={(e) => handleChange('businessDetails.workingDays', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
                <textarea value={settings.businessDetails?.certifications || ''} onChange={(e) => handleChange('businessDetails.certifications', e.target.value)} rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 resize-none" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'brand' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Brand Colors</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {['primary', 'secondary', 'accent', 'footerBg', 'footerText', 'footerLink', 'footerCompanyName'].map((color) => (
                <div key={color}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{color.replace(/([A-Z])/g, ' $1')}</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={settings.brandColors?.[color] || '#000000'} onChange={(e) => handleChange(`brandColors.${color}`, e.target.value)} className="w-12 h-10 rounded border cursor-pointer" />
                    <input type="text" value={settings.brandColors?.[color] || '#000000'} onChange={(e) => handleChange(`brandColors.${color}`, e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 font-mono" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Hero Section</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" value={settings.hero?.title || ''} onChange={(e) => handleChange('hero.title', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input type="text" value={settings.hero?.subtitle || ''} onChange={(e) => handleChange('hero.subtitle', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
                <input type="text" value={settings.hero?.ctaText || ''} onChange={(e) => handleChange('hero.ctaText', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
                <input type="text" value={settings.hero?.ctaLink || ''} onChange={(e) => handleChange('hero.ctaLink', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Image URL</label>
              <input type="url" value={settings.hero?.backgroundImage || ''} onChange={(e) => handleChange('hero.backgroundImage', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
            </div>
          </div>
        )}

        {activeTab === 'footer' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Footer Settings</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={settings.footer?.description || ''} onChange={(e) => handleChange('footer.description', e.target.value)} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
              <input type="text" value={settings.footer?.copyrightText || ''} onChange={(e) => handleChange('footer.copyrightText', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Social Media</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {['facebook', 'instagram', 'linkedin', 'twitter', 'youtube', 'whatsapp'].map((platform) => (
                <div key={platform}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{platform}</label>
                  <input type="url" value={settings.socialMedia?.[platform] || ''} onChange={(e) => handleChange(`socialMedia.${platform}`, e.target.value)} placeholder={`https://${platform}.com/...`} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mt-4">
              <h3 className="text-md font-bold text-gray-900 mb-3">Social Media Colors</h3>
              {['facebook', 'instagram', 'linkedin', 'twitter', 'youtube', 'whatsapp'].map((platform) => (
                <div key={platform} className="grid md:grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{platform} Color</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={settings.socialMediaColors?.[platform]?.color || '#000000'} onChange={(e) => handleChange(`socialMediaColors.${platform}.color`, e.target.value)} className="w-12 h-10 rounded border cursor-pointer" />
                      <input type="text" value={settings.socialMediaColors?.[platform]?.color || '#000000'} onChange={(e) => handleChange(`socialMediaColors.${platform}.color`, e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hover Color</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={settings.socialMediaColors?.[platform]?.hoverColor || '#FFFFFF'} onChange={(e) => handleChange(`socialMediaColors.${platform}.hoverColor`, e.target.value)} className="w-12 h-10 rounded border cursor-pointer" />
                      <input type="text" value={settings.socialMediaColors?.[platform]?.hoverColor || '#FFFFFF'} onChange={(e) => handleChange(`socialMediaColors.${platform}.hoverColor`, e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hours' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Business Hours</h2>
            {['weekdays', 'saturday', 'sunday', 'holidays'].map((day) => (
              <div key={day}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{day}</label>
                <input type="text" value={settings.businessHours?.[day] || ''} onChange={(e) => handleChange(`businessHours.${day}`, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">SEO Settings</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
              <input type="text" value={settings.seo?.metaTitle || ''} onChange={(e) => handleChange('seo.metaTitle', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea value={settings.seo?.metaDescription || ''} onChange={(e) => handleChange('seo.metaDescription', e.target.value)} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
              <input type="text" value={settings.seo?.metaKeywords || ''} onChange={(e) => handleChange('seo.metaKeywords', e.target.value)} placeholder="keyword1, keyword2, keyword3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Favicon URL</label>
                <input type="text" value={settings.seo?.faviconUrl || ''} onChange={(e) => handleChange('seo.faviconUrl', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL</label>
                <input type="url" value={settings.seo?.ogImage || ''} onChange={(e) => handleChange('seo.ogImage', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID</label>
                <input type="text" value={settings.seo?.googleAnalyticsId || ''} onChange={(e) => handleChange('seo.googleAnalyticsId', e.target.value)} placeholder="G-XXXXXXXXXX" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Tag Manager ID</label>
                <input type="text" value={settings.seo?.googleTagManagerId || ''} onChange={(e) => handleChange('seo.googleTagManagerId', e.target.value)} placeholder="GTM-XXXXXXX" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Pixel ID</label>
                <input type="text" value={settings.seo?.facebookPixelId || ''} onChange={(e) => handleChange('seo.facebookPixelId', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">About Company</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year Established</label>
                <input type="number" value={settings.about?.yearEstablished || 2022} onChange={(e) => handleChange('about.yearEstablished', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <input type="number" value={settings.about?.yearsOfExperience || 3} onChange={(e) => handleChange('about.yearsOfExperience', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clients Served</label>
                <input type="number" value={settings.about?.clientsServed || 100} onChange={(e) => handleChange('about.clientsServed', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Projects Completed</label>
                <input type="number" value={settings.about?.projectsCompleted || 200} onChange={(e) => handleChange('about.projectsCompleted', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Success Rate (%)</label>
                <input type="number" value={settings.about?.successRate || 98} onChange={(e) => handleChange('about.successRate', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                <input type="number" value={settings.about?.teamSize || 5} onChange={(e) => handleChange('about.teamSize', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mission Statement</label>
              <textarea value={settings.about?.missionStatement || ''} onChange={(e) => handleChange('about.missionStatement', e.target.value)} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vision Statement</label>
              <textarea value={settings.about?.visionStatement || ''} onChange={(e) => handleChange('about.visionStatement', e.target.value)} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 resize-none" />
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Site Features</h2>
            <div className="space-y-3">
              {[
                { key: 'enableChatbot', label: 'Enable AI Chatbot' },
                { key: 'enableTestimonials', label: 'Enable Testimonials' },
                { key: 'enableBlog', label: 'Enable Blog' },
                { key: 'enableNewsletter', label: 'Enable Newsletter' },
                { key: 'showPricing', label: 'Show Pricing' }
              ].map((feature) => (
                <label key={feature.key} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" checked={settings.features?.[feature.key] || false} onChange={(e) => handleChange(`features.${feature.key}`, e.target.checked)} className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-900">{feature.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Testimonials Settings</h2>
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" checked={settings.testimonialsSettings?.autoRotate || false} onChange={(e) => handleChange('testimonialsSettings.autoRotate', e.target.checked)} className="w-4 h-4" />
              <span className="text-sm font-medium text-gray-900">Auto Rotate</span>
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rotate Speed (ms)</label>
                <input type="number" value={settings.testimonialsSettings?.rotateSpeed || 5000} onChange={(e) => handleChange('testimonialsSettings.rotateSpeed', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Show Count</label>
                <input type="number" value={settings.testimonialsSettings?.showCount || 5} onChange={(e) => handleChange('testimonialsSettings.showCount', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'booking' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Booking Settings</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation Message</label>
              <textarea value={settings.bookingSettings?.confirmationMessage || ''} onChange={(e) => handleChange('bookingSettings.confirmationMessage', e.target.value)} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
              <textarea value={settings.bookingSettings?.termsAndConditions || ''} onChange={(e) => handleChange('bookingSettings.termsAndConditions', e.target.value)} rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 resize-none" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max File Size (MB)</label>
                <input type="number" value={settings.bookingSettings?.maxFileSize || 5} onChange={(e) => handleChange('bookingSettings.maxFileSize', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allowed File Types</label>
                <input type="text" value={settings.bookingSettings?.allowedFileTypes || ''} onChange={(e) => handleChange('bookingSettings.allowedFileTypes', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'promotional' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Promotional Settings</h2>
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" checked={settings.promotional?.bannerEnabled || false} onChange={(e) => handleChange('promotional.bannerEnabled', e.target.checked)} className="w-4 h-4" />
              <span className="text-sm font-medium text-gray-900">Enable Banner</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banner Text</label>
              <input type="text" value={settings.promotional?.bannerText || ''} onChange={(e) => handleChange('promotional.bannerText', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banner Link</label>
              <input type="url" value={settings.promotional?.bannerLink || ''} onChange={(e) => handleChange('promotional.bannerLink', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Text</label>
              <input type="text" value={settings.promotional?.discountText || ''} onChange={(e) => handleChange('promotional.discountText', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900" />
            </div>
          </div>
        )}

        {activeTab === 'policies' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Legal Policies</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Privacy Policy</label>
              <textarea value={settings.privacyPolicy || ''} onChange={(e) => handleChange('privacyPolicy', e.target.value)} rows="6" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
              <textarea value={settings.termsConditions || ''} onChange={(e) => handleChange('termsConditions', e.target.value)} rows="6" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Refund Policy</label>
              <textarea value={settings.refundPolicy || ''} onChange={(e) => handleChange('refundPolicy', e.target.value)} rows="6" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 resize-none" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
