import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCode, FaCheckCircle, FaPhone, FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import api from '../api/axios';

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
        
        // Filter testimonials for web development
        const webTestimonials = testimonialsRes.data.data?.filter(t => 
          t.isActive && (
            t.service?.toLowerCase().includes('web') || 
            t.service?.toLowerCase().includes('website') ||
            t.service?.toLowerCase().includes('development')
          )
        ) || [];
        setTestimonials(webTestimonials);
      } catch (error) {
        console.log('Failed to fetch data');
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
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getIcon = (iconName) => {
    return <FaCode />;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="font-sans bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#0B1530] via-[#1a2b5c] to-[#0B1530] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#C9A227] font-semibold tracking-widest uppercase text-sm mb-3 block"
          >
            Professional Web Solutions
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6"
          >
            Web <span className="text-[#C9A227]">Development</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Transform your business with a professional website. Choose the perfect package for your needs.
          </motion.p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          {services.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No services available at the moment.
            </div>
          ) : (
            <div className="space-y-20">
              {services.map((service, idx) => (
                <div key={service._id}>
                  {/* Service Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                  >
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#0B1530] to-[#1a2b5c] rounded-xl flex items-center justify-center text-[#C9A227] text-2xl shadow-lg">
                        {getIcon(service.icon)}
                      </div>
                      <h2 className="text-4xl font-bold text-[#0B1530]">{service.title}</h2>
                    </div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">{service.description}</p>
                  </motion.div>

                  {/* Packages Grid */}
                  {service.packages && service.packages.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {service.packages.map((pkg, pIdx) => (
                        <motion.div
                          key={pIdx}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: pIdx * 0.1 }}
                          className="group relative bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-[#C9A227] hover:shadow-2xl transition-all duration-300"
                        >
                          {/* Popular Badge for Business package */}
                          {pkg.name === 'Business Website' && (
                            <div className="absolute top-4 right-4 bg-[#C9A227] text-[#0B1530] text-xs font-bold px-3 py-1 rounded-full">
                              POPULAR
                            </div>
                          )}

                          {/* Header */}
                          <div className="bg-gradient-to-br from-[#0B1530] to-[#1a2b5c] p-8 text-white text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <div className="relative z-10">
                              <h3 className="text-2xl font-bold mb-3">{pkg.name}</h3>
                              <div className="flex items-baseline justify-center gap-1 mb-2">
                                <span className="text-5xl font-bold text-[#C9A227]">₹{pkg.price}</span>
                              </div>
                              <p className="text-gray-300 text-sm font-medium">{pkg.timeline}</p>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="p-8">
                            <ul className="space-y-4 mb-8">
                              {pkg.features.map((feature, fIdx) => (
                                <li key={fIdx} className="flex items-start gap-3">
                                  <div className="w-5 h-5 rounded-full bg-[#C9A227]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <FaCheckCircle className="text-[#C9A227] text-xs" />
                                  </div>
                                  <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                                </li>
                              ))}
                            </ul>

                            {/* CTA Button */}
                            <Link
                              to={`/booking?service=${encodeURIComponent(service.title + ' - ' + pkg.name)}`}
                              className="block w-full bg-[#0B1530] text-white py-4 rounded-xl font-bold text-center hover:bg-[#C9A227] hover:text-[#0B1530] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-[#C9A227] font-bold tracking-widest uppercase text-sm mb-3 block">
                Client Reviews
              </span>
              <h2 className="text-4xl font-bold text-[#0B1530] mb-4">
                What Our Clients Say
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                See what our clients say about their web development experience
              </p>
            </motion.div>

            <div className="relative max-w-4xl mx-auto">
              {testimonials.length > 1 && (
                <>
                  <button
                    onClick={prevTestimonial}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-[#0B1530] hover:bg-[#C9A227] hover:text-white transition-all"
                  >
                    <FaChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-[#0B1530] hover:bg-[#C9A227] hover:text-white transition-all"
                  >
                    <FaChevronRight size={18} />
                  </button>
                </>
              )}

              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl relative"
                  >
                    <FaQuoteLeft className="absolute top-8 left-8 text-6xl text-[#C9A227]/10" />
                    
                    <div className="relative z-10">
                      <div className="flex gap-1 mb-6 justify-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={i < testimonials[currentTestimonial]?.rating ? 'text-[#C9A227]' : 'text-gray-200'} 
                            size={20}
                          />
                        ))}
                      </div>

                      <p className="text-gray-700 text-lg md:text-xl leading-relaxed italic mb-8 text-center">
                        "{testimonials[currentTestimonial]?.quote}"
                      </p>

                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0B1530] to-[#1a2b5c] flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                          {testimonials[currentTestimonial]?.name?.charAt(0)}
                        </div>
                        <div className="font-bold text-[#0B1530] text-lg">
                          {testimonials[currentTestimonial]?.name}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {testimonials[currentTestimonial]?.title}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {testimonials.length > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentTestimonial(idx)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        idx === currentTestimonial 
                          ? 'bg-[#C9A227] w-8' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#0B1530] to-[#1a2b5c] text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Ready to Build Your Website?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Get in touch with us for a free consultation and custom quote
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 bg-[#C9A227] text-[#0B1530] rounded-xl font-bold hover:bg-white transition-all shadow-lg hover:shadow-xl"
            >
              Contact Us
            </Link>
            <a
              href="tel:+918447127264"
              className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-[#0B1530] transition-all flex items-center gap-2"
            >
              <FaPhone size={16} /> +91 84471 27264
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DigitalServices;
