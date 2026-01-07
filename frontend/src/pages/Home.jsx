import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ConsultationModal from '../components/common/ConsultationModal'; // Import the Modal
import api from '../api/axios';
import {
  FaChartLine,
  FaFileInvoiceDollar,
  FaBalanceScale,
  FaUsers,
  FaAward,
  FaCheckCircle,
  FaLock,
  FaUserTie,
  FaStar,
  FaArrowRight,
  FaBriefcase,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const Home = () => {
  // State to control the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Carousel navigation
  const nextTestimonial = useCallback(() => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(nextTestimonial, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length, nextTestimonial]);

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await api.get('/testimonials');
        if (data.success && data.data.length > 0) {
          setTestimonials(data.data);
        }
      } catch (error) {
        console.log('No testimonials found');
      }
    };
    fetchTestimonials();
  }, []);

  const services = [
    { icon: <FaFileInvoiceDollar />, title: 'Tax Consulting', desc: 'Expert tax planning and compliance strategies optimized for your business growth.', slug: 'tax-consulting' },
    { icon: <FaBalanceScale />, title: 'Auditing', desc: 'Comprehensive audit services ensuring accuracy, transparency, and regulatory compliance.', slug: 'auditing' },
    { icon: <FaChartLine />, title: 'Financial Advisory', desc: 'Strategic financial guidance to maximize profits and minimize risks.', slug: 'financial-advisory' },
    { icon: <FaUsers />, title: 'Business Setup', desc: 'End-to-end assistance in company formation, registration, and legal structuring.', slug: 'business-setup' },
    { icon: <FaBriefcase />, title: 'Web Development', desc: 'Professional website development to establish your digital presence and grow online.', slug: 'web-development', isDigital: true },
  ];

  const features = [
    { icon: <FaCheckCircle />, title: 'Transparent Pricing', desc: 'Clear fee structure with no hidden charges.' },
    { icon: <FaChartLine />, title: 'Timely Compliance', desc: 'Never miss a deadline with our automated reminders.' },
    { icon: <FaLock />, title: 'Secure Data', desc: 'Bank-grade encryption keeps your financial data safe.' },
    { icon: <FaUserTie />, title: 'Expert Team', desc: 'Certified professionals dedicated to your success.' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <main className="font-sans text-gray-800">
      
      {/* Render the Modal */}
      <ConsultationModal isOpen={isModalOpen} closeModal={closeModal} />

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden pt-28 pb-24">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop" 
            alt="Office Background" 
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1530] via-[#0B1530]/85 to-[#0B1530]/40" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-[#C9A227] font-medium text-sm mb-6 backdrop-blur-sm"
              >
                <FaBriefcase className="text-xs" /> Since 2022
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-6"
              >
                Financial Clarity for <br />
                <span className="text-[#C9A227]">Modern Business</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg lg:text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light"
              >
                We simplify complex tax and audit challenges, allowing you to focus on what you do best—growing your business.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
              >
                {/* UPDATED: Button triggers Modal */}
                <button
                  onClick={openModal}
                  className="px-8 py-3.5 bg-[#C9A227] text-[#0B1530] rounded-full font-semibold text-base shadow-lg hover:bg-white transition-all hover:-translate-y-0.5"
                >
                  Book Consultation
                </button>
                
                <Link
                  to="/services"
                  className="px-8 py-3.5 border border-white/20 bg-white/5 text-white rounded-full font-medium text-base hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  Our Services
                </Link>
              </motion.div>

              {/* Simple Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap justify-center lg:justify-start gap-6 pt-6 border-t border-white/10"
              >
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <FaCheckCircle className="text-[#C9A227]" /> 3+ Years Exp.
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <FaCheckCircle className="text-[#C9A227]" /> 100+ Clients
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <FaCheckCircle className="text-[#C9A227]" /> Certified Experts
                </div>
              </motion.div>
            </div>

            {/* Right Side: Professional Imagery */}
            <motion.div
               initial={{ opacity: 0, x: 30 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.4, duration: 0.8 }}
               className="hidden lg:block relative h-[500px]"
            >
               {/* Main Image */}
               <div className="relative w-full h-full rounded-t-[10rem] rounded-b-[2rem] overflow-hidden border-[6px] border-white/10 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
                    alt="Tax and Finance Professional" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#0B1530]/20 mix-blend-multiply"></div>
               </div>

               {/* Modern Floating Badge */}
               <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute bottom-8 -left-6 bg-white p-5 rounded-xl shadow-xl flex items-center gap-4 max-w-xs"
               >
                  <div className="w-12 h-12 bg-[#0B1530] rounded-full flex items-center justify-center text-[#C9A227] text-xl">
                     <FaUserTie />
                  </div>
                  <div>
                     <p className="text-[#0B1530] font-bold text-lg">Expert Advice</p>
                     <p className="text-gray-500 text-sm">Strategic financial planning.</p>
                  </div>
               </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ==================== ABOUT SECTION ==================== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800" 
                  alt="About Tax Filer" 
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1530]/40 to-transparent"></div>
              </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[#C9A227] font-bold tracking-widest uppercase text-sm mb-4 block">About Us</span>
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#0B1530] mb-6">
                Your Trusted Partner in Financial Success
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                Tax Filer is a professional Chartered Accountancy firm dedicated to providing comprehensive financial solutions. Since 2022, we have been helping businesses and individuals navigate the complex world of taxation, compliance, and financial planning.
              </p>
              <p className="text-gray-600 text-base leading-relaxed mb-8">
                Our team of certified professionals brings expertise in Income Tax, GST, Company Registration, Auditing, and Business Advisory services. We believe in building long-term relationships based on trust, transparency, and excellence.
              </p>

              {/* Key Points */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#C9A227]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaUsers className="text-[#C9A227]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B1530]">100+ Clients</h4>
                    <p className="text-sm text-gray-500">Trusted by businesses</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#C9A227]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaLock className="text-[#C9A227]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B1530]">100% Confidential</h4>
                    <p className="text-sm text-gray-500">Your data is secure</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#C9A227]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaCheckCircle className="text-[#C9A227]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B1530]">Timely Delivery</h4>
                    <p className="text-sm text-gray-500">Never miss deadlines</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#C9A227]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaChartLine className="text-[#C9A227]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B1530]">3+ Years Experience</h4>
                    <p className="text-sm text-gray-500">Since 2022</p>
                  </div>
                </div>
              </div>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-[#0B1530] font-semibold hover:text-[#C9A227] transition-all group"
              >
                Learn More About Us <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== PREMIUM SERVICES SECTION ==================== */}
      <section className="py-12 md:py-16 bg-[#F9FAFB]">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <span className="text-[#C9A227] font-bold tracking-widest uppercase text-sm">Our Expertise</span>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold mt-3 mb-3 text-[#0B1530]">
              Comprehensive Solutions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base font-light">
              Navigating the complexities of finance with precision and integrity.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
          >
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-[#C9A227]/30 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-[#F4F6F9] rounded-xl flex items-center justify-center text-[#0B1530] text-2xl mb-6 group-hover:bg-[#0B1530] group-hover:text-[#C9A227] transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0B1530] mb-3">{service.title}</h3>
                <p className="text-gray-600 text-base leading-relaxed mb-6">
                   {service.desc}
                </p>
                <Link 
                  to={service.isDigital ? '/digital-services' : `/expertise/${service.slug}`} 
                  className="text-base font-bold text-[#0B1530] hover:text-[#C9A227] flex items-center gap-2 transition-colors"
                >
                  Read More <FaArrowRight size={12} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== WHY CHOOSE US ==================== */}
      <section className="relative py-16 md:py-20 flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop" 
             alt="Strategic Meeting" 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-[#0B1530]/90" />
        </div>

        <div className="relative z-10 container mx-auto max-w-5xl">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#C9A227] font-bold tracking-widest uppercase text-sm mb-4 block"
            >
              Why Choose Us
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl lg:text-4xl font-serif font-bold text-white mb-6"
            >
              Excellence in Every Detail
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-base lg:text-lg max-w-3xl mx-auto mb-10 font-light leading-relaxed"
            >
              We combine traditional values of trust and integrity with modern technology to provide efficient solutions. Our commitment goes beyond just numbers; we partner in your growth.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center"
            >
                {features.map((feature, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <div className="text-[#C9A227] text-3xl mb-4 flex justify-center">{feature.icon}</div>
                        <h4 className="text-white font-bold text-lg mb-2">{feature.title}</h4>
                        <p className="text-gray-400 text-sm">{feature.desc}</p>
                    </div>
                ))}
            </motion.div>
        </div>
      </section>

      {/* ==================== STATS STRIP ==================== */}
      <section className="py-8 bg-[#C9A227]">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap justify-around items-center gap-8 text-[#0B1530]">
             <div className="text-center">
                <div className="text-4xl font-serif font-bold">3+</div>
                <div className="text-sm font-bold uppercase tracking-wider opacity-80">Years Experience</div>
             </div>
             <div className="h-10 w-px bg-[#0B1530]/20 hidden md:block"></div>
             <div className="text-center">
                <div className="text-4xl font-serif font-bold">100+</div>
                <div className="text-sm font-bold uppercase tracking-wider opacity-80">Happy Clients</div>
             </div>
             <div className="h-10 w-px bg-[#0B1530]/20 hidden md:block"></div>
             <div className="text-center">
                <div className="text-4xl font-serif font-bold">100%</div>
                <div className="text-sm font-bold uppercase tracking-wider opacity-80">Confidentiality</div>
             </div>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
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
              See what our clients say about their experience working with us
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

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-12 md:py-16 px-6 bg-[#0B1530] text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl lg:text-3xl font-serif font-bold mb-4 text-white">
            Ready to Optimize Your Finances?
          </h2>
          <p className="text-base lg:text-lg mb-8 text-gray-400 font-light">
            Schedule a free 30-minute consultation with our expert chartered accountants.
          </p>
          {/* UPDATED: Button triggers Modal */}
          <button
            onClick={openModal}
            className="inline-block rounded-full bg-[#C9A227] px-10 py-4 text-[#0B1530] font-bold text-base hover:bg-white transition-all duration-300"
          >
            Book Consultation
          </button>
        </div>
      </section>

    </main>
  );
};

export default Home;











