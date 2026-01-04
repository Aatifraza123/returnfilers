import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaFileInvoiceDollar,
  FaBalanceScale,
  FaChartLine,
  FaUsers,
  FaPhone,
  FaEnvelope,
  FaArrowRight,
  FaCheckCircle
} from 'react-icons/fa';

const Expertise = () => {
  const services = [
    {
      icon: <FaFileInvoiceDollar />,
      title: 'Tax Consulting',
      slug: 'tax-consulting',
      description: 'Expert guidance on tax planning, compliance, and optimization strategies to minimize your tax burden while ensuring full regulatory compliance.',
      features: [
        'Income Tax Planning & Filing',
        'GST Registration & Returns',
        'Corporate Tax Advisory',
        'Tax Audit Support',
        'TDS Compliance',
        'International Taxation'
      ],
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600'
    },
    {
      icon: <FaBalanceScale />,
      title: 'Auditing',
      slug: 'auditing',
      description: 'Independent, objective assurance that your financial statements are accurate, complete, and compliant with applicable standards.',
      features: [
        'Statutory Audit',
        'Internal Audit',
        'Tax Audit',
        'GST Audit',
        'Stock Audit',
        'Compliance Audit'
      ],
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=600'
    },
    {
      icon: <FaChartLine />,
      title: 'Financial Advisory',
      slug: 'financial-advisory',
      description: 'Strategic guidance to help businesses make informed financial decisions, optimize performance, and achieve long-term growth.',
      features: [
        'Financial Planning & Analysis',
        'Investment Advisory',
        'Cash Flow Management',
        'Business Valuation',
        'Risk Management',
        'M&A Advisory'
      ],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600'
    },
    {
      icon: <FaUsers />,
      title: 'Business Setup',
      slug: 'business-setup',
      description: 'End-to-end assistance in company formation, registration, and legal structuring with complete compliance support.',
      features: [
        'Private Limited Company',
        'LLP Registration',
        'Partnership Firm',
        'GST Registration',
        'MSME Registration',
        'Import Export Code'
      ],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };


  return (
    <main className="font-sans text-gray-800 bg-gray-50">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative py-12 md:py-16 bg-gradient-to-br from-[#0B1530] via-[#1a2b5c] to-[#0B1530] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 max-w-5xl">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#D4AF37] font-semibold tracking-widest uppercase text-xs sm:text-sm mb-3 block"
          >
            Our Expertise
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight"
          >
            Comprehensive <span className="text-[#D4AF37]">Solutions</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm sm:text-base md:text-lg text-gray-300 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Navigating the complexities of finance with precision and integrity. We provide expert services tailored to your business needs.
          </motion.p>
        </div>
      </section>

      {/* ==================== SERVICES DETAILED SECTION ==================== */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="space-y-8"
          >
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className={`grid md:grid-cols-5 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Image */}
                  <div className={`md:col-span-2 h-48 md:h-auto ${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className={`md:col-span-3 p-6 md:p-8 ${idx % 2 === 1 ? 'md:order-1' : ''}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-[#0B1530] rounded-lg flex items-center justify-center text-[#D4AF37] text-lg">
                        {service.icon}
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-[#0B1530]">
                        {service.title}
                      </h2>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-5">
                      {service.description}
                    </p>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-5">
                      {service.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2">
                          <FaCheckCircle className="text-[#D4AF37] text-xs flex-shrink-0" />
                          <span className="text-xs text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link 
                      to={`/expertise/${service.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#D4AF37] hover:text-[#0B1530] transition-colors group"
                    >
                      Learn More <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-8 bg-white">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl lg:text-3xl font-serif font-bold mb-3 text-[#0B1530]">
              Ready to Get Started?
            </h2>
            <p className="text-base text-gray-600 mb-6 max-w-2xl mx-auto">
              Our expert team is ready to help you navigate your financial journey. Contact us today for a free consultation.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-[#D4AF37] text-[#0B1530] rounded-full font-semibold text-sm shadow-lg hover:bg-white transition-all flex items-center gap-2"
                >
                  <FaEnvelope size={14} />
                  Contact Us
                </motion.button>
              </Link>
              <a href="tel:+918447127264">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 border-2 border-[#0B1530] text-[#0B1530] rounded-full font-semibold text-sm hover:bg-[#0B1530] hover:text-white transition-all flex items-center gap-2"
                >
                  <FaPhone size={14} />
                  Call Now
                </motion.button>
              </a>
            </div>
            <div className="text-xs text-gray-500">
              <p>Or visit our <Link to="/services" className="text-[#D4AF37] hover:underline font-semibold">Services</Link> page to explore more</p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Expertise;
