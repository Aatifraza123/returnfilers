import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaCode, FaCheckCircle, FaStar, 
  FaChevronLeft, FaChevronRight, FaPlus, FaMinus, FaArrowRight,
  FaReact, FaNodeJs, FaPalette, FaRocket,
  FaMobile, FaSearch, FaLock, FaBolt
} from 'react-icons/fa';
import api from '../api/axios';
import Loader from '../components/common/Loader';
import UserAuthContext from '../context/UserAuthContext';
import AuthModal from '../components/common/AuthModal';

const DigitalServices = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserAuthContext);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const [settings, setSettings] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleGetStarted = (service, pkg) => {
    if (!user) {
      setSelectedPackage({ service, pkg });
      setShowAuthModal(true);
      return;
    }
    const serviceName = pkg ? `${service.title} - ${pkg.name}` : service.title;
    navigate(`/booking?service=${encodeURIComponent(serviceName)}`);
  };

  const faqs = [
    {
      question: "How long does it take to build a website?",
      answer: "The timeline depends on the package you choose. Basic websites take 5-7 days, Business websites 7-10 days, E-commerce sites 15-20 days, and Custom applications 20-30 days. We provide regular updates throughout the development process."
    },
    {
      question: "Do you provide website maintenance after launch?",
      answer: "Yes! All our packages include free support ranging from 1 month to 1 year depending on the package. After that, we offer affordable maintenance plans to keep your website updated and secure."
    },
    {
      question: "Will my website be mobile-friendly?",
      answer: "Absolutely! All our websites are fully responsive and optimized for mobile devices, tablets, and desktops. We ensure your site looks great and functions perfectly on all screen sizes."
    },
    {
      question: "Can I update the website content myself?",
      answer: "Yes! We provide an easy-to-use admin panel where you can update content, images, and manage your website without any technical knowledge. We also provide training on how to use it."
    },
    {
      question: "Do you provide hosting and domain services?",
      answer: "We can help you set up hosting and domain registration, or work with your existing providers. We'll guide you through the entire process and recommend the best options for your needs."
    },
    {
      question: "What if I need changes after the website is live?",
      answer: "Minor changes are included in your free support period. For major updates or new features, we offer flexible pricing based on the scope of work. We're always here to help your website grow with your business."
    },
    {
      question: "Will my website be SEO optimized?",
      answer: "Yes! All our packages include basic to advanced SEO optimization. We implement best practices for on-page SEO, meta tags, site speed, and mobile optimization to help your website rank better in search engines."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept bank transfers, UPI, and online payments. For larger projects, we offer flexible payment plans with milestone-based payments to make it easier for you."
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, settingsRes] = await Promise.all([
          api.get('/digital-services'),
          api.get('/settings')
        ]);
        
        setServices(servicesRes.data.services.filter(s => s.active) || []);
        
        // Set settings
        if (settingsRes.data.success) {
          setSettings(settingsRes.data.data);
        }
        
        // Fetch testimonials only if enabled in settings
        if (settingsRes.data.success && settingsRes.data.data?.features?.enableTestimonials) {
          const testimonialsRes = await api.get('/testimonials');
          
          // Filter only Web Development testimonials
          const allTestimonials = testimonialsRes.data.data || [];
          console.log('All testimonials:', allTestimonials.map(t => ({ name: t.name, service: t.service, active: t.isActive })));
          
          const webTestimonials = allTestimonials.filter(t => {
            if (!t.isActive || !t.service) return false;
            const service = t.service.toLowerCase();
            const isWebDev = service.includes('web') || 
                            service.includes('website') || 
                            service.includes('development') ||
                            service.includes('e-commerce') ||
                            service.includes('ecommerce');
            console.log(`${t.name} (${t.service}): ${isWebDev ? 'INCLUDED' : 'EXCLUDED'}`);
            return isWebDev;
          });
          
          console.log('Filtered web testimonials:', webTestimonials.map(t => ({ name: t.name, service: t.service })));
          setTestimonials(webTestimonials);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-slide testimonials
  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 6000); // Increased to 6s for better readability
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const nextTestimonial = () => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size="lg" text="Loading digital services..." />
      </div>
    );
  }

  return (
    <main className="font-sans bg-gray-50">
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          if (selectedPackage) {
            const serviceName = selectedPackage.pkg 
              ? `${selectedPackage.service.title} - ${selectedPackage.pkg.name}` 
              : selectedPackage.service.title;
            navigate(`/booking?service=${encodeURIComponent(serviceName)}`);
          }
        }}
        message="Please login to book this package"
      />
      
      {/* Hero Section - Compact */}
      <section 
        className="relative py-16 text-white overflow-hidden pt-20 md:pt-28"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div 
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[128px] opacity-10 pointer-events-none"
          style={{ backgroundColor: 'var(--color-secondary)' }}
        />
        
        <div className="container mx-auto px-4 text-center relative z-10 max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight"
          >
            Digital <span style={{ color: 'var(--color-secondary)' }}>Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-base md:text-lg max-w-xl mx-auto"
          >
            Professional websites tailored to your business needs
          </motion.p>
        </div>
      </section>

      {/* Why Choose Digital Services */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" style={{ color: 'var(--color-primary)' }}>
              Why Choose Our Digital Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              We combine creativity, technology, and business strategy to deliver exceptional digital solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl mb-4" style={{ backgroundColor: 'var(--color-primary)' }}>
                <FaMobile />
              </div>
              <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-primary)' }}>Mobile Responsive</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                All websites are fully responsive and optimized for mobile, tablet, and desktop devices
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl mb-4" style={{ backgroundColor: 'var(--color-primary)' }}>
                <FaSearch />
              </div>
              <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-primary)' }}>SEO Optimized</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Built with SEO best practices to help your website rank higher in search engines
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl mb-4" style={{ backgroundColor: 'var(--color-primary)' }}>
                <FaBolt />
              </div>
              <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-primary)' }}>Fast Loading</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Optimized for speed with fast loading times to provide the best user experience
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl mb-4" style={{ backgroundColor: 'var(--color-primary)' }}>
                <FaLock />
              </div>
              <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-primary)' }}>Secure & Reliable</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Built with security best practices and reliable hosting for 99.9% uptime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies We Use */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" style={{ color: 'var(--color-primary)' }}>
              Technologies We Use
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              We work with modern, industry-standard technologies to build powerful digital solutions
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Tech 1 */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 flex flex-col items-center">
              <FaReact className="text-4xl mb-3" style={{ color: 'var(--color-primary)' }} />
              <h4 className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>React</h4>
            </div>

            {/* Tech 2 */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 flex flex-col items-center">
              <FaNodeJs className="text-4xl mb-3" style={{ color: 'var(--color-primary)' }} />
              <h4 className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>Node.js</h4>
            </div>

            {/* Tech 3 - MongoDB */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 flex flex-col items-center">
              <FaCode className="text-4xl mb-3" style={{ color: 'var(--color-primary)' }} />
              <h4 className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>MongoDB</h4>
            </div>

            {/* Tech 4 - Tailwind CSS */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 flex flex-col items-center">
              <FaPalette className="text-4xl mb-3" style={{ color: 'var(--color-primary)' }} />
              <h4 className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>Tailwind CSS</h4>
            </div>

            {/* Tech 5 */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 flex flex-col items-center">
              <FaPalette 
                className="text-4xl mb-3"
                style={{ color: 'var(--color-secondary)' }}
              />
              <h4 className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>UI/UX Design</h4>
            </div>

            {/* Tech 6 */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 flex flex-col items-center">
              <FaRocket 
                className="text-4xl mb-3"
                style={{ color: 'var(--color-primary)' }}
              />
              <h4 className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>Deployment</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-7xl">
          {services.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No services available at the moment.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, idx) => {
                const isPopular = idx === 1;
                return (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl"
                  style={{
                    backgroundColor: isPopular ? 'var(--color-primary)' : 'white',
                    color: isPopular ? 'white' : 'inherit',
                    border: isPopular ? '2px solid var(--color-secondary)' : '1px solid #f3f4f6',
                    transform: isPopular ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  {isPopular && (
                    <div 
                      className="absolute top-0 right-0 px-4 py-1 text-xs font-bold rounded-bl-lg"
                      style={{
                        backgroundColor: 'var(--color-secondary)',
                        color: 'var(--color-primary)'
                      }}
                    >
                      POPULAR
                    </div>
                  )}
                  
                  <div className="p-8">
                    <div 
                      className="inline-flex items-center justify-center p-3 rounded-xl text-2xl mb-4"
                      style={{
                        backgroundColor: isPopular ? 'var(--color-secondary)' : 'var(--color-primary)',
                        color: isPopular ? 'var(--color-primary)' : 'var(--color-secondary)'
                      }}
                    >
                      <FaCode />
                    </div>
                    <h3 
                      className="text-2xl font-bold mb-3"
                      style={{ color: isPopular ? 'white' : 'var(--color-primary)' }}
                    >
                      {service.title}
                    </h3>
                    <p 
                      className="mb-6 leading-relaxed"
                      style={{ color: isPopular ? '#d1d5db' : '#4b5563' }}
                    >
                      {service.description}
                    </p>
                    
                    <div className="flex items-baseline gap-2 mb-6">
                      <span 
                        className="text-4xl font-bold"
                        style={{ color: isPopular ? 'var(--color-secondary)' : 'var(--color-primary)' }}
                      >
                        ₹{service.price}
                      </span>
                      <span 
                        className="text-sm"
                        style={{ color: isPopular ? '#9ca3af' : '#6b7280' }}
                      >
                        / {service.timeline}
                      </span>
                    </div>

                    <div className="space-y-3 mb-8">
                      {service.features.slice(0, 6).map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-3 text-sm">
                          <FaCheckCircle 
                            className="mt-1 flex-shrink-0"
                            style={{ color: 'var(--color-secondary)' }}
                          />
                          <span 
                            className="leading-relaxed"
                            style={{ color: isPopular ? '#d1d5db' : '#4b5563' }}
                          >
                            {feature}
                          </span>
                        </div>
                      ))}
                      {service.features.length > 6 && (
                        <div 
                          className="text-sm italic"
                          style={{ color: isPopular ? '#9ca3af' : '#6b7280' }}
                        >
                          +{service.features.length - 6} more features
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 mt-auto">
                      <Link
                        to={`/digital-services/${service.slug}`}
                        className="flex-1 py-3 rounded-lg font-semibold text-center transition-all duration-300 text-sm border-2"
                        style={{
                          borderColor: idx === 1 ? 'var(--color-secondary)' : 'var(--color-primary)',
                          color: idx === 1 ? 'var(--color-secondary)' : 'var(--color-primary)',
                          background: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          if (idx === 1) {
                            e.currentTarget.style.background = 'var(--color-secondary)';
                            e.currentTarget.style.color = 'var(--color-primary)';
                          } else {
                            e.currentTarget.style.background = 'var(--color-primary)';
                            e.currentTarget.style.color = 'white';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = idx === 1 ? 'var(--color-secondary)' : 'var(--color-primary)';
                        }}
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleGetStarted(service, null)}
                        className="flex-1 py-3 rounded-lg font-semibold text-center transition-all duration-300 text-sm"
                        style={{
                          background: idx === 1 ? 'var(--color-secondary)' : 'var(--color-primary)',
                          color: idx === 1 ? 'var(--color-primary)' : 'white'
                        }}
                        onMouseEnter={(e) => {
                          if (idx === 1) {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = 'var(--color-primary)';
                          } else {
                            e.currentTarget.style.background = 'var(--color-secondary)';
                            e.currentTarget.style.color = 'var(--color-primary)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (idx === 1) {
                            e.currentTarget.style.background = 'var(--color-secondary)';
                            e.currentTarget.style.color = 'var(--color-primary)';
                          } else {
                            e.currentTarget.style.background = 'var(--color-primary)';
                            e.currentTarget.style.color = 'white';
                          }
                        }}
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
              })}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span 
              className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full mb-4"
              style={{
                backgroundColor: 'var(--color-secondary-10)',
                color: 'var(--color-secondary)'
              }}
            >
              Got Questions?
            </span>
            <h2 
              className="text-3xl lg:text-4xl font-serif font-bold mb-3"
              style={{ color: 'var(--color-primary)' }}
            >
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Find answers to common questions about our web development services
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden hover:border-secondary/30 transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span 
                    className="font-semibold pr-4"
                    style={{ color: 'var(--color-primary)' }}
                  >{faq.question}</span>
                  <div 
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                    style={{
                      backgroundColor: 'var(--color-secondary-10)',
                      color: 'var(--color-secondary)'
                    }}
                  >
                    {openFaq === index ? <FaMinus size={14} /> : <FaPlus size={14} />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div 
            className="mt-12 text-center p-6 rounded-2xl text-white"
            style={{
              background: `linear-gradient(to bottom right, var(--color-primary), var(--color-primary))`
            }}
          >
            <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
            <p className="text-gray-300 mb-4">We're here to help! Contact us for more information.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/contact"
                className="px-6 py-3 rounded-lg font-semibold transition-all"
                style={{
                  backgroundColor: 'var(--color-secondary)',
                  color: 'var(--color-primary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-secondary)';
                }}
              >
                Contact Us
              </Link>
              <a
                href="tel:+918447127264"
                className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold transition-all"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'white';
                }}
              >
                Call: +91 84471 27264
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {settings?.features?.enableTestimonials && testimonials.length > 0 && (
        <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
          <div className="container mx-auto max-w-7xl px-6">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span 
                className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full mb-4"
                style={{
                  backgroundColor: 'var(--color-secondary-10)',
                  color: 'var(--color-secondary)'
                }}
              >
                Client Reviews
              </span>
              <h2 
                className="text-3xl lg:text-4xl font-serif font-bold mb-3"
                style={{ color: 'var(--color-primary)' }}
              >
                Trusted by Clients
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                See what our clients say about their web development experience
              </p>
            </motion.div>
            
            {/* Carousel Container */}
            <div className="relative max-w-5xl mx-auto">
              {/* Navigation Buttons */}
              {testimonials.length > 1 && (
                <>
                  <button
                    onClick={prevTestimonial}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-14 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-all"
                    aria-label="Previous testimonial"
                  >
                    <FaChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-14 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-all"
                    aria-label="Next testimonial"
                  >
                    <FaChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Testimonial Card */}
              <div className="overflow-hidden px-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-6 md:p-8 rounded-2xl shadow-xl relative flex flex-col md:flex-row items-center gap-6"
                  >
                    {/* Left: Author */}
                    <div className="flex flex-col items-center md:w-48 flex-shrink-0">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary flex items-center justify-center text-white font-bold text-2xl shadow-md mb-3">
                        {testimonials[currentTestimonial]?.image ? (
                          <img 
                            src={testimonials[currentTestimonial].image} 
                            alt={testimonials[currentTestimonial]?.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <span className={testimonials[currentTestimonial]?.image ? 'hidden' : 'flex'}>
                          {testimonials[currentTestimonial]?.name?.charAt(0)}
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-primary">{testimonials[currentTestimonial]?.name}</div>
                        <div className="text-xs text-gray-500">{testimonials[currentTestimonial]?.title}</div>
                      </div>
                      {/* Stars - Always Gold Color */}
                      <div className="flex gap-0.5 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            size={14} 
                            style={{ color: i < (testimonials[currentTestimonial]?.rating || 5) ? '#C9A227' : '#e5e7eb' }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Right: Quote */}
                    <div className="flex-1 relative md:pl-6 md:border-l border-gray-100">
                      {/* Quote Icon */}
                      <div className="absolute -top-2 -left-2 md:top-0 md:-left-3 w-10 h-10 bg-secondary rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                        </svg>
                      </div>
                      <p className="text-gray-600 text-base md:text-lg leading-relaxed italic pt-8 md:pt-0 md:pl-4">
                        "{testimonials[currentTestimonial]?.quote}"
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dots Navigation */}
              {testimonials.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentTestimonial(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        idx === currentTestimonial 
                          ? 'bg-secondary w-6' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to testimonial ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-12 md:py-16 bg-primary text-center">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
            Need a Custom Digital Solution?
          </h2>
          <p className="text-gray-400 text-sm md:text-base mb-8">
            Get a personalized quote for your unique project requirements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/quote"
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
            
            <Link
              to="/contact"
              className="inline-block px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 border-2 border-white/20 text-white hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DigitalServices;


