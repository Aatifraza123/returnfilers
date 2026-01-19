import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import UserAuthContext from '../context/UserAuthContext';
import AuthModal from '../components/common/AuthModal';
import { FaCheck, FaSearch, FaArrowRight, FaRupeeSign, FaClock, FaUserTie, FaMoneyBillWave, FaBolt, FaShieldAlt, FaClipboardList, FaFileAlt, FaCheckCircle, FaHeadset, FaChevronDown } from 'react-icons/fa';

const Services = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserAuthContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
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
      setServices(serviceData);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
      setServices([]); 
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(services.map(s => s.category?.toLowerCase()).filter(Boolean))];

  const filteredServices = filter === 'all' 
    ? services 
    : services.filter(s => s.category?.toLowerCase() === filter);

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
      <section className="py-12 md:py-16 pt-20 md:pt-28" style={{ backgroundColor: 'var(--color-primary)' }}>
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ backgroundColor: 'var(--color-secondary-10)', color: 'var(--color-secondary)' }}>
            Our Services
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
            Professional Financial Solutions
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Expert tax, accounting, and business registration services for individuals and businesses
          </p>
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-serif font-bold mb-4"
              style={{ color: 'var(--color-primary)' }}
            >
              Why Choose Our Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              We deliver excellence through expertise, efficiency, and unwavering commitment to your success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div 
              className="p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
              style={{ borderColor: '#e5e7eb', backgroundColor: '#e9f5f9' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl mb-4"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <FaUserTie />
              </div>
              <h3 
                className="text-lg font-bold mb-3"
                style={{ color: 'var(--color-primary)' }}
              >Expert Professionals</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Qualified tax consultants and business advisors with years of industry experience
              </p>
            </div>

            {/* Feature 2 */}
            <div 
              className="p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
              style={{ borderColor: '#e5e7eb', backgroundColor: '#e9f5f9' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl mb-4"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <FaMoneyBillWave />
              </div>
              <h3 
                className="text-lg font-bold mb-3"
                style={{ color: 'var(--color-primary)' }}
              >Affordable Pricing</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Transparent pricing with no hidden charges. Get quality services at competitive rates
              </p>
            </div>

            {/* Feature 3 */}
            <div 
              className="p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
              style={{ borderColor: '#e5e7eb', backgroundColor: '#e9f5f9' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl mb-4"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <FaBolt />
              </div>
              <h3 
                className="text-lg font-bold mb-3"
                style={{ color: 'var(--color-primary)' }}
              >Quick Turnaround</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Fast processing and timely delivery. We understand deadlines matter for your business
              </p>
            </div>

            {/* Feature 4 */}
            <div 
              className="p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
              style={{ borderColor: '#e5e7eb', backgroundColor: '#e9f5f9' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl mb-4"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <FaShieldAlt />
              </div>
              <h3 
                className="text-lg font-bold mb-3"
                style={{ color: 'var(--color-primary)' }}
              >100% Compliance</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Stay fully compliant with all regulations. We ensure error-free filings every time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center gap-2 py-4 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filter === cat
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={filter === cat ? { backgroundColor: 'var(--color-primary)' } : {}}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {filteredServices.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredServices.map((service, index) => (
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
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 text-[10px] font-bold uppercase tracking-wide rounded-md" style={{ color: 'var(--color-primary)' }}>
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
                    {/* Price & Timeline Row - Price Always Black */}
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
                            <FaCheck size={8} style={{ color: 'var(--color-secondary)' }} />
                            <span className="text-xs text-gray-600 line-clamp-1">{feature}</span>
                          </div>
                        ))}
                        {service.features.length > 2 && (
                          <p className="text-[10px] font-medium" style={{ color: 'var(--color-secondary)' }}>
                            +{service.features.length - 2} more
                          </p>
                        )}
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <Link
                        to={`/services/${service._id}`}
                        className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleBookNow(service)}
                        className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-white rounded-lg transition-all"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--color-secondary)';
                          e.currentTarget.style.color = 'var(--color-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                          e.currentTarget.style.color = 'white';
                        }}
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
              <p className="text-gray-500 text-sm mb-5">Try selecting a different category</p>
              <button 
                onClick={() => setFilter('all')}
                className="font-semibold text-sm hover:underline"
                style={{ color: 'var(--color-secondary)' }}
              >
                View All Services
              </button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-serif font-bold mb-4"
              style={{ color: 'var(--color-primary)' }}
            >
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              Simple 4-step process to get your service delivered hassle-free
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div 
              className="rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all duration-300"
              style={{ borderColor: '#e5e7eb', backgroundColor: '#e9f5f9' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-10 h-10 text-white rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  01
                </div>
                <h3 
                  className="text-lg font-bold"
                  style={{ color: 'var(--color-primary)' }}
                >Choose Service</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Browse our services and select the one that fits your needs. Filter by category for quick access
              </p>
            </div>

            {/* Step 2 */}
            <div 
              className="rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all duration-300"
              style={{ borderColor: '#e5e7eb', backgroundColor: '#e9f5f9' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-10 h-10 text-white rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  02
                </div>
                <h3 
                  className="text-lg font-bold"
                  style={{ color: 'var(--color-primary)' }}
                >Share Requirements</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Book the service and share your requirements. Upload documents securely through our portal
              </p>
            </div>

            {/* Step 3 */}
            <div 
              className="rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all duration-300"
              style={{ borderColor: '#e5e7eb', backgroundColor: '#e9f5f9' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-10 h-10 text-white rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  03
                </div>
                <h3 
                  className="text-lg font-bold"
                  style={{ color: 'var(--color-primary)' }}
                >We Process</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our experts review and process your request. Track real-time status updates on your dashboard
              </p>
            </div>

            {/* Step 4 */}
            <div 
              className="rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all duration-300"
              style={{ borderColor: '#e5e7eb', backgroundColor: '#e9f5f9' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-10 h-10 text-white rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  04
                </div>
                <h3 
                  className="text-lg font-bold"
                  style={{ color: 'var(--color-primary)' }}
                >Get Delivered</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Receive completed documents and certificates. Enjoy ongoing support for any queries
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              Quick answers to common questions about our services
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How long does it take to complete a service?',
                a: 'Service delivery time varies by type. Most services are completed within 3-7 business days. Complex services may take longer. Check individual service pages for specific timelines.'
              },
              {
                q: 'What documents do I need to provide?',
                a: 'Required documents vary by service. After booking, we provide a detailed checklist. Common documents include PAN card, Aadhaar, business registration proof, and relevant financial documents.'
              },
              {
                q: 'How is pricing determined?',
                a: 'Pricing is transparent and displayed on each service card. Some services have fixed pricing while others are quoted based on complexity. No hidden charges - what you see is what you pay.'
              },
              {
                q: 'Do you provide support after service delivery?',
                a: 'Yes! We provide ongoing support for all services. If you face any issues or have questions after delivery, our team is available via phone, email, and chat.'
              },
              {
                q: 'Can I track my service status?',
                a: 'Absolutely! Once you book a service, you can track real-time status updates through your dashboard. You will also receive email and SMS notifications at each stage.'
              },
              {
                q: 'What if I need a service not listed here?',
                a: 'We offer custom solutions for unique requirements. Click "Get Custom Quote" to share your needs, and our team will provide a personalized solution and pricing.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-start gap-2">
                  <FaCheckCircle className="mt-1 flex-shrink-0" size={16} style={{ color: 'var(--color-secondary)' }} />
                  {faq.q}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed ml-6">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-gray-900 font-semibold transition-all"
              style={{ color: 'var(--color-primary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
            >
              Have more questions? Contact us <FaArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12" style={{ backgroundColor: 'var(--color-primary)' }}>
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

export default Services;

