import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import UserAuthContext from '../context/UserAuthContext';
import AuthModal from '../components/common/AuthModal';
import { FaCheck, FaSearch, FaArrowRight, FaRupeeSign, FaClock, FaShieldAlt, FaFileAlt, FaUserTie, FaCheckCircle } from 'react-icons/fa';

const OtherServices = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserAuthContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleBookNow = (service) => {
    if (!user) {
      setSelectedService(service);
      setShowAuthModal(true);
      return;
    }
    navigate(`/booking?service=${encodeURIComponent(service.title)}`);
  };

  useEffect(() => {
    fetchServices();
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
    }
  };

  const fetchServices = async () => {
    try {
      const { data } = await api.get(`/services?t=${Date.now()}`);
      const serviceData = Array.isArray(data) ? data : (data.services || []);
      // Filter only "Other Services" category
      const otherServices = serviceData.filter(s => s.category?.toLowerCase() === 'other services');
      setServices(otherServices);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
      setServices([]); 
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size="lg" text="Loading services..." />
      </div>
    );
  }

  return (
    <main className="font-sans text-gray-800 bg-white">
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          if (selectedService) {
            navigate(`/booking?service=${encodeURIComponent(selectedService.title)}`);
          }
        }}
        message="Please login to book this service"
      />
      
      {/* Hero Section */}
      <section className="bg-primary py-12 md:py-16 pt-20 md:pt-28">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold uppercase tracking-wider mb-4">
            Other Services
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
            Additional Business Solutions
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Comprehensive services for trademark protection, legal compliance, and business growth
          </p>
        </div>
      </section>

      {/* Why These Services Matter */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Why These Services Matter
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              Protect your brand, ensure compliance, and secure your business future
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Benefit 1 */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white text-xl mb-4">
                <FaShieldAlt />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Brand Protection</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Secure your brand identity with trademark registration and protect your intellectual property from infringement
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white text-xl mb-4">
                <FaFileAlt />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Legal Compliance</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Stay compliant with all legal requirements and avoid penalties with proper documentation and registrations
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white text-xl mb-4">
                <FaUserTie />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Expert Guidance</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get professional advice from experienced consultants who understand the complexities of business compliance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {services.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <div
                  key={service._id || index}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-secondary/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Image */}
                  <Link to={`/services/${service._id}`} className="block relative h-48 overflow-hidden">
                    <img
                      src={service.image || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80"} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80"; }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Category Badge */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 text-primary text-[10px] font-bold uppercase tracking-wide rounded-md">
                      {service.category}
                    </span>

                    {/* Title on Image */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-lg font-bold text-white line-clamp-2 drop-shadow-lg">
                        {service.title}
                      </h3>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    {/* Price & Timeline Row */}
                    {settings?.features?.showPricing && (
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-1 text-black">
                        <FaRupeeSign size={14} />
                        <span className="text-xl font-bold">
                          {service.price && !isNaN(Number(service.price)) 
                            ? Number(service.price).toLocaleString() 
                            : 'Quote'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                        <FaClock size={10} />
                        <span>{service.timeline || '3-7 Days'}</span>
                      </div>
                    </div>
                    )}

                    {/* Description */}
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-grow">
                      {service.description}
                    </p>

                    {/* Features */}
                    {service.features && service.features.length > 0 && (
                      <div className="space-y-1.5 mb-4">
                        {service.features.slice(0, 2).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <FaCheck size={8} className="text-secondary" />
                            <span className="text-xs text-gray-600 line-clamp-1">{feature}</span>
                          </div>
                        ))}
                        {service.features.length > 2 && (
                          <p className="text-[10px] text-secondary font-medium">
                            +{service.features.length - 2} more
                          </p>
                        )}
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <Link
                        to={`/services/${service._id}`}
                        className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-primary bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleBookNow(service)}
                        className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-secondary hover:text-primary transition-all"
                      >
                        Book Now <FaArrowRight size={9} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <FaSearch className="text-gray-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No services found</h3>
              <p className="text-gray-500 text-sm mb-5">Check back later for new services</p>
              <Link 
                to="/services"
                className="text-secondary font-semibold text-sm hover:underline"
              >
                View All Services
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              Common questions about trademark and other business services
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Why do I need trademark registration?',
                a: 'Trademark registration protects your brand name, logo, and identity from being used by others. It gives you exclusive rights to use your mark and legal protection against infringement.'
              },
              {
                q: 'How long does trademark registration take?',
                a: 'The trademark registration process typically takes 12-18 months in India. We handle the entire process including application filing, objection handling, and final registration.'
              },
              {
                q: 'What documents are required for trademark registration?',
                a: 'You need business registration proof, applicant ID proof (PAN, Aadhaar), logo/wordmark details, and business address proof. We provide a complete checklist after consultation.'
              },
              {
                q: 'Can I register a trademark for multiple classes?',
                a: 'Yes, you can register your trademark in multiple classes based on your business activities. Each class requires separate fees and covers different types of goods or services.'
              },
              {
                q: 'What happens if my trademark application is objected?',
                a: 'If there is an objection, we handle the response and represent you before the trademark office. Most objections can be resolved with proper documentation and legal arguments.'
              },
              {
                q: 'Do you provide post-registration support?',
                a: 'Yes, we provide ongoing support including trademark renewal reminders, infringement monitoring, and legal assistance if someone tries to use your trademark without permission.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-start gap-2">
                  <FaCheckCircle className="text-secondary mt-1 flex-shrink-0" size={16} />
                  {faq.q}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed ml-6">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:text-secondary transition-all"
            >
              Have more questions? Contact us <FaArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-gray-400 text-sm md:text-base mb-8">
            Get a personalized quote for your specific requirements
          </p>
          <Link
            to="/booking?service=Custom%20Service"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg"
            style={{
              background: 'var(--color-secondary)',
              color: 'var(--color-primary)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-primary)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-secondary)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
          >
            Get Custom Quote <FaArrowRight size={12} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default OtherServices;
