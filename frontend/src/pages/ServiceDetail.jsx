import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import UserAuthContext from '../context/UserAuthContext';
import AuthModal from '../components/common/AuthModal';
import { 
  FaCheck, 
  FaRupeeSign, 
  FaArrowRight, 
  FaArrowLeft,
  FaClock, 
  FaPhoneAlt, 
  FaFileAlt,
  FaShieldAlt,
  FaHeadset,
  FaChartLine
} from 'react-icons/fa';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserAuthContext);
  const [service, setService] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleBookNow = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    navigate(`/booking?service=${encodeURIComponent(service.title)}`);
  };

  useEffect(() => {
    fetchService();
    fetchSettings();
    window.scrollTo(0, 0);
  }, [id]);

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

  const fetchService = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/services/${id}`);
      const serviceData = data.service || data;
      setService(serviceData);

      // Fetch related services from same category
      const allServices = await api.get('/services');
      const servicesArray = Array.isArray(allServices.data) ? allServices.data : (allServices.data.services || []);
      const related = servicesArray
        .filter(s => s.category === serviceData.category && s._id !== id)
        .slice(0, 3);
      setRelatedServices(related);
    } catch (error) {
      console.error('Error fetching service:', error);
      toast.error('Service not found');
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <Loader size="lg" text="Loading service details..." />
      </div>
    );
  }

  if (!service) return null;

  const benefits = [
    { icon: <FaShieldAlt />, title: '100% Compliance', desc: 'Fully compliant with latest regulations' },
    { icon: <FaHeadset />, title: 'Dedicated Support', desc: 'Expert assistance throughout the process' },
    { icon: <FaClock />, title: 'Timely Delivery', desc: 'On-time completion guaranteed' },
    { icon: <FaChartLine />, title: 'Best Practices', desc: 'Industry-standard methodologies' },
  ];

  // Get appropriate background image based on service title
  const getServiceImage = () => {
    if (service.image) return service.image;
    
    // Business Setup / Company Formation specific image - modern office building/business
    if (service.title?.toLowerCase().includes('business setup') || 
        service.title?.toLowerCase().includes('company formation') ||
        service.title?.toLowerCase().includes('company registration') ||
        service.title?.toLowerCase().includes('llp registration')) {
      return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80";
    }
    
    // Default fallback - business documents
    return "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80";
  };

  return (
    <main className="font-sans text-gray-800 bg-gray-50">
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          navigate(`/booking?service=${encodeURIComponent(service.title)}`);
        }}
        message="Please login to book this service"
      />
      
      {/* Updated: Compact hero section without icon */}
      {/* Hero Section */}
      <section className="relative min-h-[32vh] flex items-end pt-20 md:pt-28">
        <div className="absolute inset-0">
          <img
            src={getServiceImage()}
            alt={service.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1530] via-[#0B1530]/80 to-[#0B1530]/40" />
        </div>

        <div className="container mx-auto px-6 max-w-5xl relative z-10 pb-8">
          {/* Breadcrumb */}
          <Link to="/services" className="inline-flex items-center gap-2 text-gray-300 hover:text-[#C9A227] text-sm mb-4 transition-colors">
            <FaArrowLeft size={12} />
            Back to All Services
          </Link>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 bg-[#C9A227] text-[#0B1530] text-xs font-bold uppercase rounded">
                {service.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                {service.title}
              </h1>
              <p className="text-gray-300 text-sm leading-relaxed">
                {service.description?.substring(0, 100)}...
              </p>
            </div>

            {/* Price Card - Price Always Black */}
            {settings?.features?.showPricing && (
            <div className="bg-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
              <div>
                <p className="text-xs text-gray-500 uppercase">Starting From</p>
                <div className="flex items-center gap-0.5 text-black">
                  <FaRupeeSign size={12} />
                  <span className="text-lg font-bold">
                    {service.price && !isNaN(Number(service.price)) 
                      ? Number(service.price).toLocaleString() 
                      : 'Quote'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleBookNow}
                className="px-4 py-2 bg-[#0B1530] text-white rounded-lg font-semibold text-sm hover:bg-[#C9A227] hover:text-[#0B1530] transition-colors"
              >
                Book Now
              </button>
            </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* About Service */}
              <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-100">
                <h2 className="text-base font-bold text-[#0B1530] mb-3 flex items-center gap-2">
                  <FaFileAlt className="text-[#C9A227]" size={14} />
                  About This Service
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {service.description}
                </p>
              </div>

              {/* Features */}
              {service.features && service.features.length > 0 && (
                <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-100">
                  <h2 className="text-base font-bold text-[#0B1530] mb-4 flex items-center gap-2">
                    <FaCheck className="text-[#C9A227]" size={14} />
                    What's Included
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                        <FaCheck className="text-[#C9A227] text-xs" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              <div className="bg-[#0B1530] p-5 md:p-6 rounded-xl">
                <h2 className="text-base font-bold text-white mb-4">Why Choose Us?</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="w-8 h-8 bg-[#C9A227] rounded-lg flex items-center justify-center text-[#0B1530] flex-shrink-0">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm">{benefit.title}</h3>
                        <p className="text-gray-400 text-xs">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4">
              
              {/* Quick Info */}
              <div className="bg-white p-5 rounded-xl border border-gray-100">
                <h3 className="font-bold text-[#0B1530] text-sm mb-3">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <FaClock className="text-[#C9A227]" size={14} />
                    <div>
                      <p className="text-[10px] text-gray-500">Timeline</p>
                      <p className="font-semibold text-[#0B1530] text-sm">{service.timeline || '3-7 Days'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <FaFileAlt className="text-[#C9A227]" size={14} />
                    <div>
                      <p className="text-[10px] text-gray-500">Category</p>
                      <p className="font-semibold text-[#0B1530] text-sm capitalize">{service.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaShieldAlt className="text-[#C9A227]" size={14} />
                    <div>
                      <p className="text-[10px] text-gray-500">Support</p>
                      <p className="font-semibold text-[#0B1530] text-sm">Dedicated Expert</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Card */}
              <div className="bg-[#C9A227] p-5 rounded-xl">
                <h3 className="font-bold text-[#0B1530] mb-1">Ready to Start?</h3>
                <p className="text-sm text-[#0B1530]/70 mb-3">Book your service now</p>
                <button
                  onClick={handleBookNow}
                  className="w-full bg-[#0B1530] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-white hover:text-[#C9A227] transition-all duration-300 hover:shadow-lg"
                >
                  Book Now
                </button>
              </div>

              {/* Contact Card */}
              <div className="bg-white p-5 rounded-xl border border-gray-100">
                <h3 className="font-bold text-[#0B1530] text-sm mb-2">Need Help?</h3>
                <p className="text-xs text-gray-600 mb-3">Call us for immediate assistance</p>
                <a
                  href="tel:+918447127264"
                  className="w-full border-2 border-[#0B1530] text-[#0B1530] py-2.5 rounded-lg font-semibold text-sm hover:bg-[#0B1530] hover:text-[#C9A227] transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg"
                >
                  <FaPhoneAlt size={10} />
                  +91 84471 27264
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-10 bg-gray-50">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-xl font-bold text-[#0B1530] mb-6 flex items-center gap-2">
              <span className="text-[#C9A227]">❓</span>
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {service.faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-[#C9A227] transition-colors"
                >
                  <summary className="flex items-center justify-between cursor-pointer p-4 font-semibold text-[#0B1530] text-sm hover:bg-gray-50 transition-colors">
                    <span className="flex-1 pr-4">{faq.question}</span>
                    <span className="text-[#C9A227] group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="px-4 pb-4 pt-2 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-10 bg-white border-t border-gray-100">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-lg font-bold text-[#0B1530] mb-5">Related Services</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedServices.map((s) => (
                <Link
                  key={s._id}
                  to={`/services/${s._id}`}
                  className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-all border border-gray-100"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={s.image || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80"}
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <h3 className="absolute bottom-2 left-3 right-3 text-white font-semibold text-sm line-clamp-1">{s.title}</h3>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    {settings?.features?.showPricing && (
                    <span className="text-black font-semibold text-sm">
                      ₹{s.price && !isNaN(Number(s.price)) ? Number(s.price).toLocaleString() : 'Quote'}
                    </span>
                    )}
                    <span className="text-xs text-gray-500 group-hover:text-[#C9A227]">View →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default ServiceDetail;
