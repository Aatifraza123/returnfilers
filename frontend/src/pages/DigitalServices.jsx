import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaCode, FaCheckCircle, FaStar, 
  FaChevronLeft, FaChevronRight, FaPlus, FaMinus 
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
    navigate(`/booking?service=${encodeURIComponent(service.title + ' - ' + pkg.name)}`);
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
        <Loader size="lg" text="Loading..." />
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
            navigate(`/booking?service=${encodeURIComponent(selectedPackage.service.title + ' - ' + selectedPackage.pkg.name)}`);
          }
        }}
        message="Please login to book this package"
      />
      
      {/* Hero Section - Compact */}
      <section className="relative py-16 bg-[#0B1530] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A227] rounded-full blur-[128px] opacity-10 pointer-events-none" />
        
        <div className="container mx-auto px-4 text-center relative z-10 max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight"
          >
            Digital <span className="text-[#C9A227]">Services</span>
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

      {/* Services Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-7xl">
          {services.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No services available at the moment.</div>
          ) : (
            <div className="space-y-32">
              {services.map((service) => (
                <div key={service._id}>
                  {/* Service Header */}
                  <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-[#0B1530] text-[#C9A227] text-3xl mb-6 shadow-xl shadow-[#0B1530]/20">
                      <FaCode />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#0B1530] mb-4 font-serif">{service.title}</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">{service.description}</p>
                  </div>

                  {/* 3. Modern Package Cards */}
                  {settings?.features?.showPricing && service.packages?.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {service.packages.map((pkg, pIdx) => (
                        <motion.div
                          key={pIdx}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: pIdx * 0.1 }}
                          className={`
                            relative flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300
                            ${pkg.name === 'Business Website' 
                              ? 'bg-[#0B1530] text-white shadow-2xl scale-105 border border-[#C9A227]/30 ring-4 ring-[#C9A227]/10 z-10' 
                              : 'bg-white text-gray-800 border border-gray-100 hover:border-[#C9A227]/50 shadow-lg hover:shadow-xl'}
                          `}
                        >
                          {pkg.name === 'Business Website' && (
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#C9A227] to-[#F0E68C]" />
                          )}

                          <div className="p-8 pb-0">
                            <h3 className={`text-xl font-bold mb-2 ${pkg.name === 'Business Website' ? 'text-white' : 'text-[#0B1530]'}`}>
                              {pkg.name}
                            </h3>
                            <div className="flex items-baseline gap-1 mb-6">
                              <span className={`text-3xl font-bold ${pkg.name === 'Business Website' ? 'text-white' : 'text-black'}`}>
                                ₹{pkg.price}
                              </span>
                            </div>
                            <div className={`text-xs font-semibold uppercase tracking-wider mb-6 ${pkg.name === 'Business Website' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {pkg.timeline} Delivery
                            </div>
                          </div>

                          <div className="p-8 pt-0 flex-grow">
                            <ul className="space-y-4">
                              {pkg.features.map((feature, fIdx) => (
                                <li key={fIdx} className="flex items-start gap-3 text-sm">
                                  <FaCheckCircle className={`mt-1 flex-shrink-0 ${pkg.name === 'Business Website' ? 'text-[#C9A227]' : 'text-[#0B1530]'}`} />
                                  <span className={`leading-relaxed ${pkg.name === 'Business Website' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {feature}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-8 mt-auto">
                            <div className="flex gap-3">
                              <Link
                                to={`/digital-services/${service.slug}/${pkg.name.toLowerCase().replace(/\s+/g, '-')}`}
                                className={`
                                  flex-1 py-3 rounded-lg font-semibold text-center transition-all duration-300 text-sm
                                  ${pkg.name === 'Business Website' 
                                    ? 'border-2 border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-[#0B1530]' 
                                    : 'border-2 border-[#0B1530] text-[#0B1530] hover:bg-[#0B1530] hover:text-white'}
                                `}
                              >
                                Details
                              </Link>
                              <button
                                onClick={() => handleGetStarted(service, pkg)}
                                className={`
                                  flex-1 py-3 rounded-lg font-semibold text-center transition-all duration-300 text-sm
                                  ${pkg.name === 'Business Website' 
                                    ? 'bg-[#C9A227] text-[#0B1530] hover:bg-white' 
                                    : 'bg-[#0B1530] text-white hover:bg-[#C9A227] hover:text-[#0B1530]'}
                                `}
                              >
                                Get Started
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
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
            <span className="inline-block px-4 py-1.5 bg-[#C9A227]/10 text-[#C9A227] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
              Got Questions?
            </span>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#0B1530] mb-3">
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
                className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden hover:border-[#C9A227]/30 transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-[#0B1530] pr-4">{faq.question}</span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-[#C9A227]/10 flex items-center justify-center text-[#C9A227] transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center p-6 bg-gradient-to-br from-[#0B1530] to-[#1a2b5c] rounded-2xl text-white"
          >
            <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
            <p className="text-gray-300 mb-4">We're here to help! Contact us for more information.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/contact"
                className="px-6 py-3 bg-[#C9A227] text-[#0B1530] rounded-lg font-semibold hover:bg-white transition-all"
              >
                Contact Us
              </Link>
              <a
                href="tel:+918447127264"
                className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#0B1530] transition-all"
              >
                Call: +91 84471 27264
              </a>
            </div>
          </motion.div>
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
              <span className="inline-block px-4 py-1.5 bg-[#C9A227]/10 text-[#C9A227] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                Client Reviews
              </span>
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#0B1530] mb-3">
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
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-14 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#0B1530] hover:bg-[#C9A227] hover:text-white transition-all"
                    aria-label="Previous testimonial"
                  >
                    <FaChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-14 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#0B1530] hover:bg-[#C9A227] hover:text-white transition-all"
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
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-[#0B1530] to-[#1a2b5c] flex items-center justify-center text-white font-bold text-2xl shadow-md mb-3">
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
                        <div className="font-bold text-[#0B1530]">{testimonials[currentTestimonial]?.name}</div>
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
                      <div className="absolute -top-2 -left-2 md:top-0 md:-left-3 w-10 h-10 bg-[#C9A227] rounded-full flex items-center justify-center shadow-lg">
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
                          ? 'bg-[#C9A227] w-6' 
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
    </main>
  );
};

export default DigitalServices;

