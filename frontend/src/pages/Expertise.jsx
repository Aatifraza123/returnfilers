import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaFileInvoiceDollar,
  FaBalanceScale,
  FaChartLine,
  FaUsers,
  FaPhone,
  FaWhatsapp,
  FaArrowRight,
  FaCheckCircle
} from 'react-icons/fa';

const Expertise = () => {
  const services = [
    {
      icon: <FaFileInvoiceDollar />,
      slug: 'tax-consulting',
      title: 'Tax Consulting',
      tagline: 'Expert Tax Planning & Compliance',
      description: 'Navigate the complex world of taxation with confidence. We provide expert guidance on tax planning, compliance, and optimization strategies.',
      features: ['Income Tax Planning', 'GST Registration & Returns', 'TDS Compliance', 'Tax Audit Support'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <FaBalanceScale />,
      slug: 'auditing',
      title: 'Auditing',
      tagline: 'Comprehensive Audit Services',
      description: 'Independent, objective assurance that your financial statements are accurate, complete, and compliant with applicable standards.',
      features: ['Statutory Audit', 'Internal Audit', 'Tax Audit', 'GST Audit'],
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <FaChartLine />,
      slug: 'financial-advisory',
      title: 'Financial Advisory',
      tagline: 'Strategic Financial Guidance',
      description: 'Strategic guidance to help businesses make informed financial decisions, optimize performance, and achieve long-term growth.',
      features: ['Financial Planning', 'Investment Advisory', 'Business Valuation', 'Risk Management'],
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <FaUsers />,
      slug: 'business-setup',
      title: 'Business Setup',
      tagline: 'End-to-End Company Formation',
      description: 'Complete assistance in company formation, registration, and legal structuring to get your business started right.',
      features: ['Company Registration', 'LLP Formation', 'GST Registration', 'MSME Registration'],
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <main className="font-sans bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-[#0B1530] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1530] via-[#1a2b5c] to-[#0B1530]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-sm font-semibold tracking-wider uppercase mb-6"
          >
            Our Expertise
          </motion.span>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6"
          >
            Comprehensive <span className="text-[#D4AF37]">Solutions</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Navigating the complexities of finance with precision and integrity. 
            Expert services tailored to your business needs.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full border border-gray-100">
                  {/* Card Header */}
                  <div className={`bg-gradient-to-r ${service.color} p-6 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white text-2xl mb-4">
                        {service.icon}
                      </div>
                      <span className="text-white/80 text-sm font-medium">{service.tagline}</span>
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mt-1">
                        {service.title}
                      </h2>
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-6">
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {service.description}
                    </p>
                    
                    {/* Features */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {service.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2">
                          <FaCheckCircle className="text-[#D4AF37] flex-shrink-0" size={14} />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* CTA */}
                    <Link 
                      to={`/expertise/${service.slug}`}
                      className="inline-flex items-center gap-2 text-[#0B1530] font-semibold hover:text-[#D4AF37] transition-colors group/link"
                    >
                      Learn More 
                      <FaArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#0B1530]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '3+', label: 'Years Experience' },
              { number: '100+', label: 'Happy Clients' },
              { number: '500+', label: 'Projects Done' },
              { number: '24/7', label: 'Support' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0B1530] mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Our expert team is ready to help you navigate your financial journey. 
              Contact us today for a free consultation.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/contact"
                className="px-8 py-3 bg-[#0B1530] text-white rounded-lg font-semibold hover:bg-[#1a2b5c] transition-colors shadow-lg hover:shadow-xl"
              >
                Contact Us
              </Link>
              <a 
                href="tel:+918447127264"
                className="px-8 py-3 border-2 border-[#0B1530] text-[#0B1530] rounded-lg font-semibold hover:bg-[#0B1530] hover:text-white transition-colors flex items-center gap-2"
              >
                <FaPhone size={14} />
                +91 84471 27264
              </a>
              <a 
                href="https://wa.me/918447127264"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-[#25D366] text-white rounded-lg font-semibold hover:bg-[#128C7E] transition-colors flex items-center gap-2"
              >
                <FaWhatsapp size={16} />
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Expertise;
