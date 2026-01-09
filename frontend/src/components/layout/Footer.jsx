import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaWhatsapp, FaPaperPlane } from 'react-icons/fa';
import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  
  // Use global settings context
  const { settings } = useSettings();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await api.post('/newsletter/subscribe', { email });
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch (error) {
      toast.error('Subscription failed');
    }
  };

  const quickLinks = [
    { to: '/about', label: 'About Us' },
    { to: '/services', label: 'Services' },
    // { to: '/portfolio', label: 'Portfolio' },
    { to: '/contact', label: 'Contact' },
    ...(settings?.features?.enableBlog ? [{ to: '/blog', label: 'Blog' }] : [])
  ];

  const legalLinks = [
    { to: '/privacy-policy', label: 'Privacy Policy' },
    { to: '/terms-conditions', label: 'Terms & Conditions' },
    { to: '/refund-policy', label: 'Refund Policy' }
  ];

  const getSocialLinks = () => {
    if (!settings?.socialMedia) return [];
    
    const links = [];
    const iconMap = {
      facebook: FaFacebook,
      twitter: FaTwitter,
      linkedin: FaLinkedin,
      instagram: FaInstagram,
      youtube: FaYoutube,
      whatsapp: FaWhatsapp
    };

    Object.entries(settings.socialMedia).forEach(([platform, url]) => {
      if (url && iconMap[platform]) {
        links.push({ href: url, icon: iconMap[platform], platform });
      }
    });

    return links;
  };

  const socialLinks = getSocialLinks();

  // Get footer colors from settings
  const footerBg = settings?.brandColors?.footerBg || '#000000';
  const footerText = settings?.brandColors?.footerText || '#ffffff';

  return (
    <footer 
      className="text-white font-sans" 
      id="footer"
      style={{ 
        backgroundColor: footerBg,
        color: footerText
      }}
    >
      <div className="container mx-auto px-6 py-6 md:py-8">
        <div className={`grid ${settings?.features?.enableNewsletter ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-8 md:gap-10`}>
          {/* ReturnFilers Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {settings?.logo ? (
                <>
                  <img 
                    src={settings.logo} 
                    alt={settings.companyName || 'Logo'} 
                    className="h-12 md:h-14 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div 
                    className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#C9A227] to-[#C9A832] rounded-tr-xl rounded-bl-xl items-center justify-center text-white font-serif text-base md:text-xl font-bold shadow-md"
                    style={{ display: 'none' }}
                  >
                    {settings?.logoText || 'RF'}
                  </div>
                </>
              ) : (
                <div 
                  className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#C9A227] to-[#C9A832] rounded-tr-xl rounded-bl-xl flex items-center justify-center text-white font-serif text-base md:text-xl font-bold shadow-md"
                >
                  {settings?.logoText || 'RF'}
                </div>
              )}
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#C9A227]">
                {settings?.companyName || 'ReturnFilers'}
              </h3>
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              {settings?.footer?.description || `Professional chartered accountancy services with ${settings?.about?.yearsOfExperience || 3}+ years of experience in taxation, auditing, and financial consulting.`}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex space-x-4 pt-2">
                {socialLinks.map(({ href, icon: Icon, platform }) => {
                  const platformColors = settings?.socialMediaColors?.[platform];
                  const iconColor = platformColors?.color || '#C9A227';
                  const hoverColor = platformColors?.hoverColor || '#FFFFFF';
                  
                  return (
                    <a 
                      key={platform} 
                      href={href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="transition-all duration-300 transform hover:scale-125 hover:-translate-y-1"
                      style={{
                        color: iconColor
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = hoverColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = iconColor;
                      }}
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            )}
            <div className="text-gray-500 text-xs md:text-sm pt-2">
              {settings?.footer?.copyrightText || `© ${new Date().getFullYear()} ${settings?.companyName || 'ReturnFilers'}. All rights reserved.`}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold mb-4 md:mb-6 text-white text-lg md:text-xl">Quick Links</h4>
            <ul className="space-y-3 md:space-y-4 text-sm md:text-base">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link 
                    to={to} 
                    className="inline-block hover:translate-x-1"
                    style={{ 
                      color: 'var(--color-secondary, #C9A227)',
                      transition: 'all 0.3s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--color-secondary, #C9A227)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-serif font-bold mb-4 md:mb-6 text-white text-lg md:text-xl">Legal</h4>
            <ul className="space-y-3 md:space-y-4 text-sm md:text-base">
              {legalLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link 
                    to={to} 
                    className="inline-block hover:translate-x-1"
                    style={{ 
                      color: 'var(--color-secondary, #C9A227)',
                      transition: 'all 0.3s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--color-secondary, #C9A227)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter - Only show if enabled in settings */}
          {settings?.features?.enableNewsletter && (
            <div>
              <h4 className="font-serif font-bold mb-3 md:mb-4 text-white text-lg md:text-xl">Newsletter</h4>
              <p className="text-gray-300 text-xs md:text-sm mb-3 md:mb-4">Get the latest financial updates directly to your inbox.</p>
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full pl-4 pr-12 py-2.5 rounded-full bg-[#1A1A1A] text-white border border-[#333] focus:outline-none focus:border-[#C9A227] transition-all placeholder-gray-500 text-sm"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 w-9 h-9 flex items-center justify-center bg-[#C9A227] text-black rounded-full hover:bg-white transition-colors shadow-lg"
                  aria-label="Subscribe"
                >
                  <FaPaperPlane size={14} className="-ml-0.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;


