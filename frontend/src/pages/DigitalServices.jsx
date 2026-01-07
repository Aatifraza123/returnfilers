import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaCode, FaCheckCircle, FaPhone, FaStar, FaQuoteLeft, 
  FaChevronLeft, FaChevronRight, FaLaptopCode, FaMobileAlt, 
  FaPaintBrush, FaRocket 
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
            Web <span className="text-[#C9A227]">Development</span>
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
                            <Link
                              to={`/booking?service=${encodeURIComponent(service.title + ' - ' + pkg.name)}`}
                              className={`
                                block w-full py-4 rounded-xl font-bold text-center transition-all duration-300
                                ${pkg.name === 'Business Website' 
                                  ? 'bg-[#C9A227] text-[#0B1530] hover:bg-white' 
                                  : 'bg-[#0B1530] text-white hover:bg-[#C9A227] hover:text-[#0B1530]'}
                              `}
                            >
                              Get Started
                            </Link>
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

      {/* Testimonials - Glassmorphic Slider */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-[#0B1530] relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
           {/* Decorative Blurs */}
           <div className="absolute -left-20 top-20 w-72 h-72 bg-[#C9A227] rounded-full blur-[100px] opacity-10" />
           
          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Client Success Stories</h2>
            </motion.div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-3xl text-center relative max-w-3xl mx-auto"
                >
                  <FaQuoteLeft className="text-4xl text-[#C9A227]/20 mx-auto mb-8" />
                  
                  <p className="text-xl md:text-2xl text-gray-200 leading-relaxed italic mb-8 font-serif">
                    "{testimonials[currentTestimonial]?.quote}"
                  </p>

                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C9A227] to-[#F0E68C] flex items-center justify-center text-[#0B1530] font-bold text-2xl">
                      {testimonials[currentTestimonial]?.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">{testimonials[currentTestimonial]?.name}</h4>
                      <p className="text-[#C9A227] text-sm">{testimonials[currentTestimonial]?.title}</p>
                    </div>
                    <div className="flex gap-1 text-[#C9A227]">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} size={14} className={i < (testimonials[currentTestimonial]?.rating || 5) ? 'opacity-100' : 'opacity-30'} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-center gap-4 mt-8">
                <button onClick={prevTestimonial} className="p-3 rounded-full bg-white/5 hover:bg-[#C9A227] hover:text-[#0B1530] text-white transition-all border border-white/10">
                  <FaChevronLeft />
                </button>
                <button onClick={nextTestimonial} className="p-3 rounded-full bg-white/5 hover:bg-[#C9A227] hover:text-[#0B1530] text-white transition-all border border-white/10">
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-[#0B1530] mb-6">Ready to Start Your Project?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-lg">
            Let's discuss how we can help you achieve your digital goals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="px-10 py-4 bg-[#0B1530] text-white rounded-xl font-bold hover:bg-[#C9A227] hover:text-[#0B1530] transition-all shadow-xl">
              Start a Project
            </Link>
            <a href="tel:+918447127264" className="px-10 py-4 border-2 border-[#0B1530] text-[#0B1530] rounded-xl font-bold hover:bg-[#0B1530] hover:text-white transition-all flex items-center justify-center gap-2">
              <FaPhone size={16} /> +91 84471 27264
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DigitalServices;

