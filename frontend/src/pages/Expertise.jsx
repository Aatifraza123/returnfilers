import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaFileInvoiceDollar,
  FaBalanceScale,
  FaChartLine,
  FaUsers,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';

const Expertise = () => {
  const services = [
    {
      icon: <FaFileInvoiceDollar />,
      title: 'Tax Consulting',
      description: 'Our comprehensive tax consulting services help businesses and individuals navigate the complex world of taxation with confidence. We provide expert guidance on tax planning, compliance, and optimization strategies to minimize your tax burden while ensuring full regulatory compliance.',
      longDescription: 'Tax consulting is crucial for any business or individual looking to optimize their financial position. Our team of experienced Chartered Accountants specializes in all aspects of taxation including income tax, GST, corporate tax, and international taxation. We stay updated with the latest tax laws and regulations to provide you with the most current and effective tax strategies. Our services include detailed tax planning to identify opportunities for tax savings, timely filing of all tax returns, representation before tax authorities, and ongoing compliance support. We work closely with clients to understand their unique financial situation and develop customized tax strategies that align with their business goals while ensuring complete compliance with all applicable tax laws.',
    },
    {
      icon: <FaBalanceScale />,
      title: 'Auditing',
      description: 'Our auditing services provide independent, objective assurance that your financial statements are accurate, complete, and compliant with applicable standards. We conduct thorough examinations of your financial records, internal controls, and business processes to identify risks and opportunities for improvement.',
      longDescription: 'Auditing is essential for maintaining financial integrity, ensuring regulatory compliance, and building stakeholder confidence. Our team of qualified auditors conducts comprehensive audits using industry best practices and the latest auditing standards. We examine your financial statements, internal controls, operational processes, and compliance with various regulations. Our audit services help identify potential risks, fraud, errors, and inefficiencies in your business operations. We provide detailed audit reports with actionable recommendations to improve your financial processes, strengthen internal controls, and enhance overall business performance. Our auditing approach is thorough yet efficient, minimizing disruption to your business while providing valuable insights.',
    },
    {
      icon: <FaChartLine />,
      title: 'Financial Advisory',
      description: 'Our financial advisory services provide strategic guidance to help businesses make informed financial decisions, optimize performance, and achieve long-term growth objectives. We combine deep financial expertise with business acumen to deliver actionable insights and recommendations.',
      longDescription: 'Financial advisory is critical for businesses looking to grow, optimize performance, and make strategic decisions. Our team of experienced financial advisors works closely with clients to understand their business objectives, financial position, and market dynamics. We provide comprehensive financial analysis, strategic planning, and actionable recommendations to help businesses achieve their goals. Our services include financial planning and analysis to forecast future performance, investment advisory to optimize capital allocation, budgeting and forecasting to plan for growth, cash flow management to ensure liquidity, merger and acquisition advisory for strategic transactions, valuation services for various purposes, risk management to protect against uncertainties, and business restructuring to improve efficiency and profitability. We use advanced financial modeling, data analytics, and industry best practices to deliver insights that drive business value.',
    },
    {
      icon: <FaUsers />,
      title: 'Business Setup',
      description: 'Starting a new business requires careful planning and proper legal compliance. Our business setup services provide end-to-end assistance in company formation, registration, and legal structuring. We guide you through every step of the process, ensuring complete compliance with all applicable laws and regulations.',
      longDescription: 'Business setup is a critical first step in your entrepreneurial journey. Our comprehensive business setup services ensure that your business is established correctly, legally compliant, and ready for operations. We help you choose the right business structure based on your needs - whether it\'s a Private Limited Company, Public Limited Company, LLP, Partnership Firm, or Sole Proprietorship. Our services include complete company registration with the Registrar of Companies, obtaining all necessary licenses and registrations including GST, MSME, Import Export Code, Professional Tax, and other state-specific registrations. We handle all documentation, filing, and compliance requirements, making the process smooth and hassle-free. Our team stays updated with the latest regulations and requirements to ensure your business setup is completed efficiently and in compliance with all applicable laws. We also provide ongoing support for compliance and regulatory requirements after setup.',
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
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              >
                <div className="p-6 md:p-8">
                  <div className="w-12 h-12 bg-[#F4F6F9] rounded-xl flex items-center justify-center text-[#0B1530] text-2xl mb-4">
                    {service.icon}
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0B1530] mb-4">
                    {service.title}
                  </h2>
                  
                  <p className="text-base text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Long Description */}
                  {service.longDescription && (
                    <div className="text-gray-700 text-sm leading-relaxed">
                      <p>{service.longDescription}</p>
                    </div>
                  )}
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
              <a href="tel:+919876543210">
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

