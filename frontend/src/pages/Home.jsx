import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import ConsultationModal from "../components/common/ConsultationModal";
import api from "../api/axios";
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
  FaChevronRight,
} from "react-icons/fa";

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
    <div ref={ref} className="text-4xl font-serif font-bold">
      {count}{suffix}
    </div>
  );
};

const Home = () => {
  // State to control the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [settings, setSettings] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Carousel navigation
  const nextTestimonial = useCallback(() => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, [testimonials.length]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(nextTestimonial, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length, nextTestimonial]);

  // Fetch testimonials and settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch settings first
        const { data: settingsData } = await api.get("/settings");
        if (settingsData.success) {
          setSettings(settingsData.data);
        }

        // Fetch testimonials only if enabled in settings
        if (
          settingsData.success &&
          settingsData.data?.features?.enableTestimonials
        ) {
          const { data: testimonialsData } = await api.get("/testimonials");
          if (testimonialsData.success && testimonialsData.data.length > 0) {
            setTestimonials(testimonialsData.data);
          }
        }
      } catch (error) {
        console.log("Error fetching data");
      }
    };
    fetchData();
  }, []);

  const services = [
    {
      icon: <FaFileInvoiceDollar />,
      title: "Tax Consulting",
      desc: "Expert tax planning and compliance strategies optimized for your business growth.",
      slug: "tax-consulting",
    },
    {
      icon: <FaBalanceScale />,
      title: "Auditing",
      desc: "Comprehensive audit services ensuring accuracy, transparency, and regulatory compliance.",
      slug: "auditing",
    },
    {
      icon: <FaChartLine />,
      title: "Financial Advisory",
      desc: "Strategic financial guidance to maximize profits and minimize risks.",
      slug: "financial-advisory",
    },
    {
      icon: <FaUsers />,
      title: "Business Setup",
      desc: "End-to-end assistance in company formation, registration, and legal structuring.",
      slug: "business-setup",
    },
    {
      icon: <FaBriefcase />,
      title: "Web Development",
      desc: "Professional website development to establish your digital presence and grow online.",
      slug: "web-development",
      isDigital: true,
    },
  ];

  const features = [
    {
      icon: <FaCheckCircle />,
      title: "Transparent Pricing",
      desc: "Clear fee structure with no hidden charges.",
    },
    {
      icon: <FaChartLine />,
      title: "Timely Compliance",
      desc: "Never miss a deadline with our automated reminders.",
    },
    {
      icon: <FaLock />,
      title: "Secure Data",
      desc: "Bank-grade encryption keeps your financial data safe.",
    },
    {
      icon: <FaUserTie />,
      title: "Expert Team",
      desc: "Certified professionals dedicated to your success.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <main className="font-sans text-gray-800">
      <ConsultationModal isOpen={isModalOpen} onClose={closeModal} />
      
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-28 pb-16 md:pb-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={
              settings?.hero?.backgroundImage ||
              "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop"
            }
            alt="Office Background"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-r"
            style={{
              background: `linear-gradient(to right, var(--color-primary), rgba(var(--color-primary-rgb, 11, 21, 48), 0.85), rgba(var(--color-primary-rgb, 11, 21, 48), 0.4))`
            }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 font-medium text-sm mb-6 backdrop-blur-sm text-white"
              >
                <FaBriefcase className="text-xs" /> Since{" "}
                {settings?.about?.yearEstablished || 2022}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-6"
              >
                {settings?.hero?.title ||
                  "Financial Clarity for Modern Business"}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg lg:text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light"
              >
                {settings?.hero?.subtitle ||
                  "We simplify complex tax and audit challenges, allowing you to focus on what you do best—growing your business."}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
              >
                {/* UPDATED: Button triggers Modal with Dynamic Colors */}
                <button
                  onClick={openModal}
                  className="px-6 py-3 md:px-8 md:py-3.5 rounded-full font-semibold text-sm md:text-base shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                  style={{
                    background: "var(--color-secondary)",
                    color: "var(--color-primary)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--color-primary)";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--color-secondary)";
                    e.currentTarget.style.color = "var(--color-primary)";
                  }}
                >
                  Book Consultation
                </button>

                <Link
                  to="/quote"
                  className="px-6 py-3 md:px-8 md:py-3.5 border border-white/20 bg-white/5 text-white rounded-full font-medium text-sm md:text-base hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  Get Custom Quote
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
                  <FaCheckCircle style={{ color: 'var(--color-secondary)' }} />{" "}
                  {settings?.about?.yearsOfExperience || 3}+ Years Exp.
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <FaCheckCircle style={{ color: 'var(--color-secondary)' }} />{" "}
                  {settings?.about?.clientsServed || 100}+ Clients
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <FaCheckCircle style={{ color: 'var(--color-secondary)' }} /> Certified Experts
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
                <div 
                  className="absolute inset-0 mix-blend-multiply"
                  style={{ backgroundColor: 'var(--color-primary)', opacity: 0.2 }}
                ></div>
              </div>

              {/* Modern Floating Badge */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-8 -left-6 bg-white p-5 rounded-xl shadow-xl flex items-center gap-4 max-w-xs"
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                  style={{ 
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-secondary)'
                  }}
                >
                  <FaUserTie />
                </div>
                <div>
                  <p 
                    className="font-bold text-lg"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Expert Advice
                  </p>
                  <p className="text-gray-500 text-sm">
                    Strategic financial planning.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== STATS STRIP ==================== */}
      <section 
        className="py-8"
        style={{ backgroundColor: 'var(--color-secondary)' }}
      >
        <div className="container mx-auto max-w-6xl px-6">
          <div 
            className="flex flex-wrap justify-around items-center gap-8"
            style={{ color: 'var(--color-primary)' }}
          >
            <div className="text-center">
              <CounterAnimation 
                end={settings?.about?.yearsOfExperience || 3} 
                suffix="+"
                duration={2000}
              />
              <div className="text-sm font-bold uppercase tracking-wider opacity-80">
                Years Experience
              </div>
            </div>
            <div 
              className="h-10 w-px hidden md:block"
              style={{ backgroundColor: 'var(--color-primary)', opacity: 0.2 }}
            ></div>
            <div className="text-center">
              <CounterAnimation 
                end={settings?.about?.clientsServed || 100} 
                suffix="+"
                duration={2500}
              />
              <div className="text-sm font-bold uppercase tracking-wider opacity-80">
                Happy Clients
              </div>
            </div>
            <div 
              className="h-10 w-px hidden md:block"
              style={{ backgroundColor: 'var(--color-primary)', opacity: 0.2 }}
            ></div>
            <div className="text-center">
              <CounterAnimation 
                end={100} 
                suffix="%"
                duration={1800}
              />
              <div className="text-sm font-bold uppercase tracking-wider opacity-80">
                Confidentiality
              </div>
            </div>
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
            <span 
              className="font-bold tracking-widest uppercase text-sm"
              style={{ color: 'var(--color-secondary)' }}
            >
              Our Expertise
            </span>
            <h2 
              className="text-3xl lg:text-4xl font-serif font-bold mt-3 mb-3"
              style={{ color: 'var(--color-primary)' }}
            >
              Comprehensive Solutions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base font-light">
              Navigating the complexities of finance with precision and
              integrity.
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
                className="p-8 rounded-2xl border border-gray-100 hover:border-secondary/30 shadow-sm hover:shadow-xl transition-all duration-300 group"
                style={{ backgroundColor: '#e9f5f9' }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 transition-all duration-300"
                  style={{
                    backgroundColor: "#F4F6F9",
                    color: "var(--color-primary)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#F4F6F9";
                    e.currentTarget.style.color = "var(--color-secondary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#F4F6F9";
                    e.currentTarget.style.color = "var(--color-primary)";
                  }}
                >
                  {service.icon}
                </div>
                <h3 
                  className="text-xl font-bold mb-3"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {service.title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed mb-6">
                  {service.desc}
                </p>
                <Link
                  to={
                    service.isDigital
                      ? "/digital-services"
                      : `/expertise/${service.slug}`
                  }
                  className="text-base font-bold flex items-center gap-2 transition-colors"
                  style={{ color: 'var(--color-primary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-secondary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
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
          <div className="absolute inset-0" style={{ backgroundColor: '#0B1530', opacity: 0.9 }} />
        </div>

        <div className="relative z-10 container mx-auto max-w-5xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-bold tracking-widest uppercase text-sm mb-4 block"
            style={{ color: 'var(--color-secondary)' }}
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
            We combine traditional values of trust and integrity with modern
            technology to provide efficient solutions. Our commitment goes
            beyond just numbers, we partner in your growth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <div 
                  className="text-3xl mb-4 flex justify-center"
                  style={{ color: 'var(--color-secondary)' }}
                >
                  {feature.icon}
                </div>
                <h4 className="text-white font-bold text-lg mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
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
                  alt="About ReturnFilers"
                  className="w-full h-[400px] object-cover"
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-t to-transparent"
                  style={{ 
                    background: `linear-gradient(to top, rgba(var(--color-primary-rgb, 11, 21, 48), 0.4), transparent)`
                  }}
                ></div>
              </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span 
                className="font-bold tracking-widest uppercase text-sm mb-4 block"
                style={{ color: 'var(--color-secondary)' }}
              >
                About Us
              </span>
              <h2 
                className="text-3xl lg:text-4xl font-serif font-bold mb-6"
                style={{ color: 'var(--color-primary)' }}
              >
                Business Growth in Financial Success
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                We are a trusted partner for businesses seeking
                seamless compliance and return filing solutions. Our team of
                experienced professionals ensures that your organization stays
                fully aligned with statutory requirements while you focus on
                growth. With a commitment to accuracy, transparency, and timely
                delivery, we simplify complex regulatory processes into clear,
                actionable steps. From corporate compliances to tax return
                filings, we bring together expertise and technology to provide
                reliable, end-to-end support. <br/> <br/>Our goal is to empower businesses
                with peace of mind, knowing that their compliance obligations
                are handled with precision and care.{" "}
                {settings?.about?.yearEstablished || 2022}, we have been helping
                businesses and individuals navigate the complex world of
                taxation, compliance, and financial planning.
              </p>
              

              {/* Key Points */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--color-secondary-10)' }}
                  >
                    <FaUsers style={{ color: 'var(--color-secondary)' }} />
                  </div>
                  <div>
                    <h4 
                      className="font-bold"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {settings?.about?.clientsServed || 100}+ Clients
                    </h4>
                    <p className="text-sm text-gray-500">
                      Trusted by businesses
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--color-secondary-10)' }}
                  >
                    <FaLock style={{ color: 'var(--color-secondary)' }} />
                  </div>
                  <div>
                    <h4 
                      className="font-bold"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      100% Confidential
                    </h4>
                    <p className="text-sm text-gray-500">Your data is secure</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--color-secondary-10)' }}
                  >
                    <FaCheckCircle style={{ color: 'var(--color-secondary)' }} />
                  </div>
                  <div>
                    <h4 
                      className="font-bold"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      Timely Delivery
                    </h4>
                    <p className="text-sm text-gray-500">
                      Never miss deadlines
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--color-secondary-10)' }}
                  >
                    <FaChartLine style={{ color: 'var(--color-secondary)' }} />
                  </div>
                  <div>
                    <h4 
                      className="font-bold"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {settings?.about?.yearsOfExperience || 3}+ Years
                      Experience
                    </h4>
                    <p className="text-sm text-gray-500">
                      Since {settings?.about?.yearEstablished || 2022}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 font-semibold transition-all group"
                style={{ color: 'var(--color-primary)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              >
                Learn More About Us{" "}
                <FaArrowRight
                  size={12}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
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
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              Simple 4-step process to get started with our services
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
                >Contact Us</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Reach out via phone, email, or our website form to discuss your requirements
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
                >Get Quote</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Receive a transparent quote with detailed breakdown of services and pricing
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
                >Submit Documents</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Upload required documents securely through our online portal
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
                >Get Results</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Receive completed filings and certificates with ongoing support
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== INDUSTRIES WE SERVE ==================== */}
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
              Industries We Serve
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              Providing specialized tax and compliance solutions across diverse sectors
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'E-commerce & Retail', desc: 'Online stores, marketplaces, retail businesses' },
              { name: 'IT & Software', desc: 'Tech startups, software companies, IT services' },
              { name: 'Manufacturing', desc: 'Production units, factories, industrial businesses' },
              { name: 'Real Estate', desc: 'Property developers, real estate agents, builders' },
              { name: 'Healthcare', desc: 'Clinics, hospitals, medical practitioners' },
              { name: 'Professional Services', desc: 'Consultants, agencies, service providers' }
            ].map((industry, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
                style={{ borderColor: '#e5e7eb', backgroundColor: '#e9f5f9' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              >
                <h3 
                  className="text-lg font-bold mb-2"
                  style={{ color: 'var(--color-primary)' }}
                >{industry.name}</h3>
                <p className="text-gray-600 text-sm">{industry.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
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
                See what our clients say about their experience working with us
              </p>
            </motion.div>

            {/* Carousel Container */}
            <div className="relative max-w-5xl mx-auto">
              {/* Testimonial Card */}
              <div className="overflow-hidden px-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 md:p-8 rounded-2xl shadow-xl relative flex flex-col md:flex-row items-center gap-6"
                    style={{ backgroundColor: '#e9f5f9' }}
                  >
                    {/* Left: Author */}
                    <div className="flex flex-col items-center md:w-48 flex-shrink-0">
                      <div 
                        className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-2xl shadow-md mb-3"
                        style={{
                          background: `linear-gradient(to bottom right, var(--color-primary), var(--color-primary))`
                        }}
                      >
                        {testimonials[currentTestimonial]?.image ? (
                          <img
                            src={testimonials[currentTestimonial].image}
                            alt={testimonials[currentTestimonial]?.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <span
                          className={
                            testimonials[currentTestimonial]?.image
                              ? "hidden"
                              : "flex"
                          }
                        >
                          {testimonials[currentTestimonial]?.name?.charAt(0)}
                        </span>
                      </div>
                      <div className="text-center">
                        <div 
                          className="font-bold"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          {testimonials[currentTestimonial]?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {testimonials[currentTestimonial]?.title}
                        </div>
                      </div>
                      {/* Stars - Always Gold Color */}
                      <div className="flex gap-0.5 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            size={14}
                            style={{
                              color:
                                i <
                                (testimonials[currentTestimonial]?.rating || 5)
                                  ? "var(--color-secondary)"
                                  : "#e5e7eb",
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Right: Quote */}
                    <div className="flex-1 relative md:pl-6 md:border-l border-gray-100">
                      {/* Quote Icon */}
                      <div 
                        className="absolute -top-2 -left-2 md:top-0 md:-left-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: 'var(--color-secondary)' }}
                      >
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
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
                          ? "w-6"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      style={idx === currentTestimonial ? { backgroundColor: 'var(--color-secondary)' } : {}}
                      aria-label={`Go to testimonial ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ==================== FAQ SECTION ==================== */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
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
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              Quick answers to common questions about our services
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: 'What services do you provide?',
                a: 'We offer comprehensive tax planning, GST filing, ITR filing, company registration, audit services, and financial advisory for individuals and businesses.'
              },
              {
                q: 'How long does it take to file ITR?',
                a: 'ITR filing typically takes 2-3 business days once we receive all required documents. We ensure timely filing before deadlines.'
              },
              {
                q: 'Do you provide GST registration services?',
                a: 'Yes, we handle complete GST registration including application filing, documentation, and follow-up with authorities.'
              },
              {
                q: 'What are your consultation charges?',
                a: 'We offer free initial consultations. Service charges vary based on requirements. Contact us for a detailed quote.'
              },
              {
                q: 'Is my financial data secure?',
                a: 'Absolutely. We use bank-grade encryption and secure cloud storage. Your data is 100% confidential and protected.'
              },
              {
                q: 'Do you provide support after filing?',
                a: 'Yes, we provide ongoing support for queries, notices, and updates even after filing completion.'
              }
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all duration-300"
                style={{ borderColor: '#e5e7eb' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              >
                <h3 
                  className="text-lg font-bold mb-2"
                  style={{ color: 'var(--color-primary)' }}
                >{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 font-semibold transition-all"
              style={{ color: 'var(--color-primary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
            >
              Have more questions? Contact us <FaArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section 
        className="py-12 md:py-16 px-6 text-center"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl lg:text-3xl font-serif font-bold mb-4 text-white">
            Ready to Optimize Your Finances?
          </h2>
          <p className="text-base lg:text-lg mb-8 text-gray-400 font-light">
            Schedule a free 30-minute consultation with our expert tax and business
            consultants.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* UPDATED: Button triggers Modal with Dynamic Colors */}
            <button
              onClick={openModal}
              className="inline-block rounded-full px-10 py-4 font-bold text-base transition-all duration-300 hover:shadow-xl hover:scale-105"
              style={{
                background: "var(--color-secondary)",
                color: "var(--color-primary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-primary)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-secondary)";
                e.currentTarget.style.color = "var(--color-primary)";
              }}
            >
              Book Consultation
            </button>
            
            <Link
              to="/quote"
              className="inline-block rounded-full px-10 py-4 font-bold text-base transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-white/20 text-white hover:bg-white/10"
            >
              Get Custom Quote
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;

