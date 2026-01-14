import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaFileInvoiceDollar,
  FaBalanceScale,
  FaChartLine,
  FaUsers,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaArrowRight,
  FaCode
} from 'react-icons/fa';

const Expertise = () => {
  // v2.1 - Fixed icon hover colors
  const services = [
    {
      icon: <FaFileInvoiceDollar />,
      title: 'Tax Consulting',
      slug: 'tax-consulting',
      description: 'Expert guidance on tax planning, compliance, and optimization strategies to minimize your tax burden while ensuring full regulatory compliance.',
      keyPoints: [
        'Comprehensive tax planning to identify savings opportunities',
        'Timely filing of Income Tax, GST & TDS returns',
        'Representation before Income Tax & GST authorities',
        'Corporate tax advisory and compliance',
        'International taxation and transfer pricing',
        'Tax audit support and documentation'
      ],
      benefits: [
        'Minimize tax liability legally',
        'Avoid penalties and notices',
        'Stay compliant with latest laws',
        'Expert CA guidance'
      ]
    },
    {
      icon: <FaBalanceScale />,
      title: 'Auditing',
      slug: 'auditing',
      description: 'Independent, objective assurance that your financial statements are accurate, complete, and compliant with applicable standards.',
      keyPoints: [
        'Statutory audit as per Companies Act',
        'Internal audit for process improvement',
        'Tax audit under Section 44AB',
        'GST audit and reconciliation',
        'Stock audit and verification',
        'Compliance audit for regulations'
      ],
      benefits: [
        'Ensure financial accuracy',
        'Identify risks early',
        'Build stakeholder confidence',
        'Improve internal controls'
      ]
    },
    {
      icon: <FaChartLine />,
      title: 'Financial Advisory',
      slug: 'financial-advisory',
      description: 'Strategic guidance to help businesses make informed financial decisions, optimize performance, and achieve long-term growth.',
      keyPoints: [
        'Financial planning and analysis (FP&A)',
        'Investment advisory and portfolio management',
        'Cash flow management and optimization',
        'Business valuation services',
        'Merger & acquisition advisory',
        'Risk management and mitigation'
      ],
      benefits: [
        'Data-driven decisions',
        'Optimize capital allocation',
        'Improve profitability',
        'Strategic growth planning'
      ]
    },
    {
      icon: <FaUsers />,
      title: 'Business Setup',
      slug: 'business-setup',
      description: 'End-to-end assistance in company formation, registration, and legal structuring with complete compliance support.',
      keyPoints: [
        'Private Limited Company registration',
        'LLP & Partnership Firm formation',
        'GST registration and compliance',
        'MSME/Udyam registration',
        'Import Export Code (IEC)',
        'Trademark & IP registration'
      ],
      benefits: [
        'Hassle-free registration',
        'Complete documentation',
        'Post-setup compliance support',
        'Expert legal guidance'
      ]
    },
    {
      icon: <FaCode />,
      title: 'Web Development',
      slug: 'web-development',
      description: 'Professional website and web application development services to establish your digital presence and grow your business online.',
      keyPoints: [
        'Business & Corporate websites',
        'E-commerce website development',
        'Custom web applications',
        'Mobile responsive design',
        'SEO optimized websites',
        'Website maintenance & support'
      ],
      benefits: [
        'Professional online presence',
        'Increase customer reach',
        'Mobile-friendly design',
        '24/7 online availability'
      ]
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
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 bg-gradient-to-br from-[#0B1530] via-[#1a2b5c] to-[#0B1530] text-white overflow-hidden pt-20 md:pt-28">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 max-w-5xl">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#C9A227] font-semibold tracking-widest uppercase text-xs sm:text-sm mb-3 block"
          >
            Our Expertise
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight"
          >
            Comprehensive <span className="text-[#C9A227]">Solutions</span>
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

      {/* Services Section */}
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
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <div className="p-6 md:p-8">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#0B1530] rounded-lg flex items-center justify-center text-[#C9A227] text-xl flex-shrink-0 group-hover:scale-110 transition-all duration-300">
                      {service.icon}
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-[#0B1530] mb-2">
                        {service.title}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Content Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Services Offered */}
                    <div className="bg-gray-50 rounded-lg p-5">
                      <h3 className="text-sm font-bold text-[#0B1530] mb-4 uppercase tracking-wide">
                        Services We Offer
                      </h3>
                      <ul className="space-y-2.5">
                        {service.keyPoints.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2.5">
                            <FaCheckCircle className="text-[#C9A227] text-xs mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits */}
                    <div className="bg-[#0B1530]/5 rounded-lg p-5">
                      <h3 className="text-sm font-bold text-[#0B1530] mb-4 uppercase tracking-wide">
                        Key Benefits
                      </h3>
                      <ul className="space-y-2.5">
                        {service.benefits.map((benefit, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2.5">
                            <div className="w-5 h-5 bg-[#C9A227] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <FaCheckCircle className="text-white text-[8px]" />
                            </div>
                            <span className="text-sm text-gray-700 font-medium">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <Link 
                      to={`/expertise/${service.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#C9A227] hover:text-[#0B1530] transition-colors group"
                    >
                      Learn More <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1530] text-white text-sm font-semibold rounded-lg hover:bg-[#C9A227] hover:text-[#0B1530] transition-colors"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-white">
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
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-[#C9A227] text-[#0B1530] rounded-full font-semibold text-sm shadow-lg hover:bg-white hover:shadow-xl transition-all flex items-center gap-2"
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
                  +91 84471 27264
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Expertise;
