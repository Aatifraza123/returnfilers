import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  FaAward,
  FaUsers,
  FaHandshake,
  FaChartLine,
  FaShieldAlt,
  FaLightbulb,
  FaBalanceScale,
  FaHistory,
  FaArrowRight,
  FaClock,
  FaUserCheck,
  FaRocket,
  FaHeadset,
  FaMoneyBillWave,
  FaLock,
} from 'react-icons/fa';

// Counter Animation Component
const CounterAnimation = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      let startTime = null;
      const startCount = 0;
      
      const animate = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(easeOutQuart * (end - startCount) + startCount);
        
        setCount(currentCount);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration, hasAnimated]);

  return (
    <div ref={ref} className="text-2xl md:text-3xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>
      {count}{suffix}
    </div>
  );
};
import api from '../api/axios';

const About = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        console.log('About settings response:', response.data); // Debug log
        if (response.data.success) {
          setSettings(response.data.data);
        } else {
          setSettings(response.data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const stats = [
    { 
      icon: <FaUsers />, 
      end: settings?.about?.clientsServed || 500, 
      suffix: '+', 
      label: 'Happy Clients',
      duration: 2500 
    },
    { 
      icon: <FaAward />, 
      end: settings?.about?.yearsOfExperience || 3, 
      suffix: '+', 
      label: 'Years Experience',
      duration: 1500 
    },
    { 
      icon: <FaHandshake />, 
      end: settings?.about?.projectsCompleted || 1000, 
      suffix: '+', 
      label: 'Tax Returns Filed',
      duration: 3000 
    },
    { 
      icon: <FaChartLine />, 
      end: settings?.about?.successRate || 99, 
      suffix: '%', 
      label: 'Client Satisfaction',
      duration: 2200 
    },
  ];

  // Use team from settings, no default fallback
  const team = settings?.about?.team || [];

  const values = [
    { icon: <FaShieldAlt />, title: 'Trust & Transparency', desc: 'We believe in complete transparency with our clients. No hidden charges, clear communication at every step.' },
    { icon: <FaLightbulb />, title: 'Expert Guidance', desc: 'Our team of qualified CAs provides expert advice tailored to your unique financial situation and business needs.' },
    { icon: <FaBalanceScale />, title: 'Compliance First', desc: 'We ensure 100% compliance with all tax laws and regulations, keeping you stress-free and penalty-free.' },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div 
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: 'var(--color-secondary)' }}
        ></div>
      </div>
    );
  }

  return (
    <main className="font-sans text-gray-800 bg-gray-50">
      
      {/* ==================== HERO SECTION ==================== */}
      <section 
        className="relative py-12 md:py-14 text-white overflow-hidden pt-20 md:pt-28"
        style={{
          background: `linear-gradient(to bottom right, var(--color-primary), rgba(var(--color-primary-rgb, 11, 21, 48), 0.9), rgba(var(--color-primary-rgb, 11, 21, 48), 0.8))`
        }}
      >
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container mx-auto px-6 text-center relative z-10 max-w-5xl">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-bold tracking-widest uppercase text-base md:text-lg mb-5 block"
            style={{ color: 'var(--color-secondary)' }}
          >
            Who We Are
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight"
          >
            About <span style={{ color: 'var(--color-secondary)' }}>ReturnFilers</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Your trusted partner for all tax and financial services. We simplify complex tax matters and help individuals and businesses achieve financial compliance with ease.
          </motion.p>
        </div>
      </section>

      {/* ==================== STATS ==================== */}
      <section className="py-6 bg-white shadow-md relative z-20 -mt-10 mx-4 md:mx-auto max-w-6xl rounded-xl border border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center px-2"
              >
                <div 
                  className="text-3xl mb-2 flex justify-center"
                  style={{ color: 'var(--color-secondary)' }}
                >{stat.icon}</div>
                <CounterAnimation 
                  end={stat.end} 
                  suffix={stat.suffix}
                  duration={stat.duration}
                />
                <p className="text-gray-500 text-xs md:text-sm uppercase tracking-wide font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== OUR HISTORY ==================== */}
      <section className="relative py-8 md:py-12 mt-6 bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white overflow-hidden">
        <FaHistory className="absolute top-10 right-10 text-white/5 text-[14rem] -rotate-12" />
        
        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <motion.div 
               initial={{ scale: 0 }}
               whileInView={{ scale: 1 }}
               viewport={{ once: true }}
               className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl md:text-3xl mb-6 shadow-lg"
               style={{
                 backgroundColor: 'var(--color-secondary)',
                 color: 'var(--color-primary)',
                 boxShadow: '0 10px 15px -3px rgba(var(--color-secondary-rgb, 201, 162, 39), 0.2)'
               }}
            >
               <FaHandshake />
            </motion.div>

            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-bold tracking-[0.2em] uppercase text-sm md:text-base mb-4"
              style={{ color: 'var(--color-secondary)' }}
            >
              Our Journey
            </motion.span>

            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-serif font-bold mb-4"
            >
              Building Trust Since <span 
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(to right, var(--color-secondary), #fbbf24)`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text'
                }}
              >{settings?.about?.yearEstablished || 2022}</span>
            </motion.h2>

            <div className="max-w-4xl mx-auto">
               <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="text-base md:text-lg text-gray-200 font-light leading-relaxed mb-4 italic"
              >
                "{settings?.about?.mission || 'To provide hassle-free, accurate, and timely tax filing services to individuals and businesses across India.'}"
              </motion.p>
              
              <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="text-sm md:text-base text-gray-400 leading-relaxed max-w-3xl mx-auto"
              >
                {settings?.about?.vision || 'ReturnFilers was founded with a simple mission: to make tax filing easy and stress-free for everyone. From GST registration to income tax returns, from business incorporation to financial advisory - we handle it all. Our team of experienced tax and business consultants is dedicated to providing personalized service and expert guidance to help you stay compliant and maximize your savings.'}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex gap-6 md:gap-8 justify-center"
            >
               <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-white">{settings?.about?.clientsServed || 500}+</div>
                  <div className="text-xs text-gray-500 uppercase mt-1">Clients</div>
               </div>
               <div className="w-px bg-white/10 h-8"></div>
               <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-white">{settings?.about?.yearsOfExperience || 3}+</div>
                  <div className="text-xs text-gray-500 uppercase mt-1">Years</div>
               </div>
               <div className="w-px bg-white/10 h-8"></div>
               <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-white">24/7</div>
                  <div className="text-xs text-gray-500 uppercase mt-1">Support</div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== WHY CHOOSE US ==================== */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 
              className="text-3xl md:text-4xl font-serif font-bold mb-4"
              style={{ color: 'var(--color-primary)' }}
            >
              Why Choose Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              We combine expertise, technology, and personalized service to deliver exceptional results
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Advantage 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
              style={{ borderColor: '#e5e7eb' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-xl mb-4"
                style={{ 
                  backgroundColor: '#e9f5f9',
                  color: 'var(--color-secondary)'
                }}
              >
                <FaUserCheck />
              </div>
              <h3 
                className="text-lg font-bold mb-3"
                style={{ color: 'var(--color-primary)' }}
              >Expert Professionals</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our team consists of qualified tax consultants and business advisors with years of industry experience
              </p>
            </motion.div>

            {/* Advantage 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
              style={{ borderColor: '#e5e7eb' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-xl mb-4"
                style={{ 
                  backgroundColor: '#e9f5f9',
                  color: 'var(--color-secondary)'
                }}
              >
                <FaClock />
              </div>
              <h3 
                className="text-lg font-bold mb-3"
                style={{ color: 'var(--color-primary)' }}
              >Timely Delivery</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We understand deadlines matter. Get your returns filed on time, every time, with automated reminders
              </p>
            </motion.div>

            {/* Advantage 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
              style={{ borderColor: '#e5e7eb' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-xl mb-4"
                style={{ 
                  backgroundColor: '#e9f5f9',
                  color: 'var(--color-secondary)'
                }}
              >
                <FaMoneyBillWave />
              </div>
              <h3 
                className="text-lg font-bold mb-3"
                style={{ color: 'var(--color-primary)' }}
              >Transparent Pricing</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                No hidden charges or surprise fees. Clear, upfront pricing for all our services with detailed breakdowns
              </p>
            </motion.div>

            {/* Advantage 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
              style={{ borderColor: '#e5e7eb' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-xl mb-4"
                style={{ 
                  backgroundColor: '#e9f5f9',
                  color: 'var(--color-secondary)'
                }}
              >
                <FaLock />
              </div>
              <h3 
                className="text-lg font-bold mb-3"
                style={{ color: 'var(--color-primary)' }}
              >Data Security</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your financial data is protected with bank-grade encryption and secure cloud storage systems
              </p>
            </motion.div>

            {/* Advantage 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
              style={{ borderColor: '#e5e7eb' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-xl mb-4"
                style={{ 
                  backgroundColor: '#e9f5f9',
                  color: 'var(--color-secondary)'
                }}
              >
                <FaHeadset />
              </div>
              <h3 
                className="text-lg font-bold mb-3"
                style={{ color: 'var(--color-primary)' }}
              >24/7 Support</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Round-the-clock customer support via phone, email, and chat to address all your queries instantly
              </p>
            </motion.div>

            {/* Advantage 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
              style={{ borderColor: '#e5e7eb' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-xl mb-4"
                style={{ 
                  backgroundColor: '#e9f5f9',
                  color: 'var(--color-secondary)'
                }}
              >
                <FaRocket />
              </div>
              <h3 
                className="text-lg font-bold mb-3"
                style={{ color: 'var(--color-primary)' }}
              >Digital First</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Fully digital process with online document submission, e-signatures, and real-time status tracking
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== OUR PROCESS ==================== */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 
              className="text-3xl md:text-4xl font-serif font-bold mb-4"
              style={{ color: 'var(--color-primary)' }}
            >
              How We Work
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              Our simple 4-step process - from consultation to completion
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
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
                >Share Requirements</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Fill out a simple form or schedule a call to discuss your tax and business needs with our experts
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
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
                >Expert Consultation</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our team reviews your case and provides personalized recommendations and a transparent quote
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
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
                >Document Processing</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Upload documents securely online. We handle all paperwork, filings, and compliance requirements
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
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
                >Delivery & Support</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Receive completed documents and certificates. Enjoy ongoing support for any queries or updates
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== LEADERSHIP TEAM ==================== */}
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 
              className="text-3xl md:text-4xl font-serif font-bold mb-3"
              style={{ color: 'var(--color-primary)' }}
            >Meet Our Expert Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
              Qualified tax and business consultants dedicated to your financial success and peace of mind.
            </p>
          </motion.div>

          {team.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 p-6"
                >
                  {/* Info */}
                  <div className="text-center">
                    <h3 
                      className="text-lg md:text-xl font-bold mb-2"
                      style={{ color: 'var(--color-primary)' }}
                    >{member.name}</h3>
                    <p 
                      className="font-medium text-xs md:text-sm mb-2"
                      style={{ color: 'var(--color-secondary)' }}
                    >{member.position}</p>
                    <p className="text-xs text-gray-400 mb-3">{member.qualification}</p>
                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                      {member.about}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No team members to display at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* ==================== CORE VALUES ==================== */}
      <section className="py-8 md:py-12 bg-gradient-to-br from-sky-50 to-sky-100 text-gray-800">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl font-serif font-bold text-center mb-6"
            style={{ color: 'var(--color-primary)' }}
          >
            Our Core Values
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5, scale: 1.01 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-sky-100 text-center group hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-100 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl"></div>
                
                <div className="w-14 h-14 mx-auto bg-sky-50 rounded-full flex items-center justify-center text-2xl text-sky-600 mb-4 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300 shadow-sm z-10 relative">
                   {value.icon}
                </div>
                
                <h3 
                  className="text-lg md:text-xl font-bold mb-2 relative z-10"
                  style={{ color: 'var(--color-primary)' }}
                >{value.title}</h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed relative z-10">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section 
        className="py-12 md:py-16 text-center"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
            Ready to Work With Us?
          </h2>
          <p className="text-gray-400 text-sm md:text-base mb-8">
            Get a personalized quote for your business needs or schedule a consultation
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

export default About;









