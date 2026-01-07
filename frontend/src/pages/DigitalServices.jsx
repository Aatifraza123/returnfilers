import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaCode, FaCheckCircle, FaStar, 
  FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';
import api from '../api/axios';

// 1. Icon Mapping for Dynamic Service Icons
const iconMap = {
  'web': <FaLaptopCode />,
  'app': <FaMobileAlt />,
  'design': <FaPaintBrush />,
  'seo': <FaRocket />,
  'default': <FaCode />
};

const getIcon = (iconName) => {
  const key = iconName?.toLowerCase() || 'default';
  return iconMap[Object.keys(iconMap).find(k => key.includes(k))] || iconMap.default;
};

const DigitalServices = () => {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, testimonialsRes] = await Promise.all([
          api.get('/digital-services'),
          api.get('/testimonials')
        ]);
        
        setServices(servicesRes.data.services.filter(s => s.active) || []);
        
        // Refined Filter Logic
        const webTestimonials = testimonialsRes.data.data?.filter(t => 
          t.isActive && (
            t.service?.toLowerCase().includes('web') || 
            t.service?.toLowerCase().includes('website') ||
            t.service?.toLowerCase().includes('development')
          )
        ) || [];
        setTestimonials(webTestimonials);
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

  // 2. Custom Skeleton Loader
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1530] flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#C9A227] font-serif tracking-widest animate-pulse">LOADING EXPERIENCE...</p>
      </div>
    );
  }

  return (
    <main className="font-sans bg-gray-50">
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
                      {getIcon(service.icon || service.title)}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#0B1530] mb-4 font-serif">{service.title}</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">{service.description}</p>
                  </div>

                  {/* 3. Modern Package Cards */}
                  {service.packages?.length > 0 && (
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
                              <span className={`text-3xl font-bold ${pkg.name === 'Business Website' ? 'text-[#C9A227]' : 'text-[#0B1530]'}`}>
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
                              <Link
                                to={`/booking?service=${encodeURIComponent(service.title + ' - ' + pkg.name)}`}
                                className={`
                                  flex-1 py-3 rounded-lg font-semibold text-center transition-all duration-300 text-sm
                                  ${pkg.name === 'Business Website' 
                                    ? 'bg-[#C9A227] text-[#0B1530] hover:bg-white' 
                                    : 'bg-[#0B1530] text-white hover:bg-[#C9A227] hover:text-[#0B1530]'}
                                `}
                              >
                                Get Started
                              </Link>
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

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
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
                      {/* Stars */}
                      <div className="flex gap-0.5 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            size={14} 
                            className={i < testimonials[currentTestimonial]?.rating ? 'text-[#C9A227]' : 'text-gray-200'} 
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

