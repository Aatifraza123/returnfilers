import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  FaBriefcase
} from 'react-icons/fa';

const Home = () => {
  // State to control the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testimonials, setTestimonials] = useState([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
    { icon: <FaFileInvoiceDollar />, title: 'Tax Consulting', desc: 'Expert tax planning and compliance strategies optimized for your business growth.' },
    { icon: <FaBalanceScale />, title: 'Auditing', desc: 'Comprehensive audit services ensuring accuracy, transparency, and regulatory compliance.' },
    { icon: <FaChartLine />, title: 'Financial Advisory', desc: 'Strategic financial guidance to maximize profits and minimize risks.' },
    { icon: <FaUsers />, title: 'Business Setup', desc: 'End-to-end assistance in company formation, registration, and legal structuring.' },
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
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-[#D4AF37] font-medium text-sm mb-6 backdrop-blur-sm"
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
                <span className="text-[#D4AF37]">Modern Business</span>
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
                  className="px-8 py-3.5 bg-[#D4AF37] text-[#0B1530] rounded-full font-semibold text-base shadow-lg hover:bg-white transition-all hover:-translate-y-0.5"
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
                  <FaCheckCircle className="text-[#D4AF37]" /> 3+ Years Exp.
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <FaCheckCircle className="text-[#D4AF37]" /> 100+ Clients
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <FaCheckCircle className="text-[#D4AF37]" /> Certified Experts
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
                  <div className="w-12 h-12 bg-[#0B1530] rounded-full flex items-center justify-center text-[#D4AF37] text-xl">
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
            <span className="text-[#D4AF37] font-bold tracking-widest uppercase text-base">Our Expertise</span>
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-[#D4AF37]/30 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-[#F4F6F9] rounded-xl flex items-center justify-center text-[#0B1530] text-2xl mb-6 group-hover:bg-[#0B1530] group-hover:text-[#D4AF37] transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0B1530] mb-3">{service.title}</h3>
                <p className="text-gray-600 text-base leading-relaxed mb-6">
                   {service.desc}
                </p>
                <Link to="/expertise" className="text-base font-bold text-[#0B1530] hover:text-[#D4AF37] flex items-center gap-2 transition-colors">
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
              className="text-[#D4AF37] font-bold tracking-widest uppercase text-sm mb-4 block"
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
                        <div className="text-[#D4AF37] text-3xl mb-4 flex justify-center">{feature.icon}</div>
                        <h4 className="text-white font-bold text-lg mb-2">{feature.title}</h4>
                        <p className="text-gray-400 text-sm">{feature.desc}</p>
                    </div>
                ))}
            </motion.div>
        </div>
      </section>

      {/* ==================== STATS STRIP ==================== */}
      <section className="py-8 bg-[#D4AF37]">
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
            <span className="inline-block px-4 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
              Client Reviews
            </span>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#0B1530] mb-3">
              Trusted by Clients
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              See what our clients say about their experience working with us
            </p>
          </motion.div>
          
          {/* Marquee Container */}
          <div className="relative">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>
            
            {/* Marquee */}
            <div className="overflow-hidden py-4">
              <motion.div
                className="flex gap-6"
                animate={{
                  x: [0, '-50%'],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 25,
                    ease: "linear",
                  },
                }}
              >
                {/* First set of testimonials */}
                {testimonials.map((t, idx) => (
                  <div
                    key={`first-${idx}`}
                    className="flex-shrink-0 w-[380px] md:w-[420px] bg-transparent p-7 rounded-2xl relative group"
                  >
                    {/* Quote Icon */}
                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                      </svg>
                    </div>
                    
                    {/* Stars */}
                    <div className="flex gap-1 mb-4 pt-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          size={16} 
                          className={i < t.rating ? 'text-[#D4AF37]' : 'text-gray-200'} 
                        />
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <p className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed line-clamp-4">
                      "{t.quote}"
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0B1530] to-[#1a2b5c] flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {t.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-[#0B1530] text-base">{t.name}</div>
                        <div className="text-xs text-gray-500">{t.title}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Duplicate for seamless loop */}
                {testimonials.map((t, idx) => (
                  <div
                    key={`second-${idx}`}
                    className="flex-shrink-0 w-[380px] md:w-[420px] bg-transparent p-7 rounded-2xl relative group"
                  >
                    {/* Quote Icon */}
                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                      </svg>
                    </div>
                    
                    {/* Stars */}
                    <div className="flex gap-1 mb-4 pt-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          size={16} 
                          className={i < t.rating ? 'text-[#D4AF37]' : 'text-gray-200'} 
                        />
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <p className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed line-clamp-4">
                      "{t.quote}"
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0B1530] to-[#1a2b5c] flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {t.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-[#0B1530] text-base">{t.name}</div>
                        <div className="text-xs text-gray-500">{t.title}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
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
            className="inline-block rounded-full bg-[#D4AF37] px-10 py-4 text-[#0B1530] font-bold text-base hover:bg-white transition-all duration-300"
          >
            Book Consultation
          </button>
        </div>
      </section>

    </main>
  );
};

export default Home;











