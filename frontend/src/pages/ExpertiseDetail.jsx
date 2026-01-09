import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaFileInvoiceDollar, 
  FaBalanceScale, 
  FaChartLine, 
  FaUsers,
  FaCheckCircle,
  FaArrowLeft,
  FaPhone,
  FaWhatsapp,
  FaCode
} from 'react-icons/fa';

const expertiseData = {
  'tax-consulting': {
    icon: <FaFileInvoiceDollar />,
    title: 'Tax Consulting',
    tagline: 'Expert Tax Planning & Compliance',
    heroImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2072&auto=format&fit=crop',
    description: 'Our comprehensive tax consulting services help businesses and individuals navigate the complex world of taxation with confidence.',
    overview: 'Tax consulting is crucial for any business or individual looking to optimize their financial position. Our team of experienced Chartered Accountants specializes in all aspects of taxation including income tax, GST, corporate tax, and international taxation.',
    services: [
      'Income Tax Planning & Filing',
      'GST Registration & Returns',
      'Corporate Tax Advisory',
      'Tax Audit & Assessment',
      'TDS Compliance',
      'International Taxation',
      'Tax Dispute Resolution',
      'Advance Tax Planning'
    ],
    benefits: [
      { title: 'Minimize Tax Liability', desc: 'Strategic planning to legally reduce your tax burden' },
      { title: 'Full Compliance', desc: 'Stay compliant with all tax laws and regulations' },
      { title: 'Expert Guidance', desc: 'Advice from certified Chartered Accountants' },
      { title: 'Timely Filing', desc: 'Never miss a deadline with our proactive approach' }
    ],
    process: [
      { step: '01', title: 'Assessment', desc: 'We analyze your current tax situation and identify opportunities' },
      { step: '02', title: 'Strategy', desc: 'Develop a customized tax strategy aligned with your goals' },
      { step: '03', title: 'Implementation', desc: 'Execute the strategy with proper documentation' },
      { step: '04', title: 'Review', desc: 'Ongoing monitoring and adjustments as needed' }
    ]
  },
  'auditing': {
    icon: <FaBalanceScale />,
    title: 'Auditing',
    tagline: 'Comprehensive Audit Services',
    heroImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop',
    description: 'Our auditing services provide independent, objective assurance that your financial statements are accurate and compliant.',
    overview: 'Auditing is essential for maintaining financial integrity, ensuring regulatory compliance, and building stakeholder confidence. Our team conducts comprehensive audits using industry best practices.',
    services: [
      'Statutory Audit',
      'Internal Audit',
      'Tax Audit',
      'GST Audit',
      'Stock Audit',
      'Forensic Audit',
      'Compliance Audit',
      'Due Diligence'
    ],
    benefits: [
      { title: 'Financial Accuracy', desc: 'Ensure your financial statements are error-free' },
      { title: 'Risk Identification', desc: 'Identify potential risks and fraud early' },
      { title: 'Stakeholder Confidence', desc: 'Build trust with investors and partners' },
      { title: 'Process Improvement', desc: 'Get recommendations to improve operations' }
    ],
    process: [
      { step: '01', title: 'Planning', desc: 'Understand your business and define audit scope' },
      { step: '02', title: 'Fieldwork', desc: 'Examine records, test controls, gather evidence' },
      { step: '03', title: 'Analysis', desc: 'Evaluate findings and identify issues' },
      { step: '04', title: 'Reporting', desc: 'Deliver detailed report with recommendations' }
    ]
  },
  'financial-advisory': {
    icon: <FaChartLine />,
    title: 'Financial Advisory',
    tagline: 'Strategic Financial Guidance',
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop',
    description: 'Strategic financial guidance to help businesses make informed decisions and achieve long-term growth objectives.',
    overview: 'Financial advisory is critical for businesses looking to grow, optimize performance, and make strategic decisions. We provide comprehensive financial analysis and actionable recommendations.',
    services: [
      'Financial Planning & Analysis',
      'Investment Advisory',
      'Budgeting & Forecasting',
      'Cash Flow Management',
      'M&A Advisory',
      'Business Valuation',
      'Risk Management',
      'Business Restructuring'
    ],
    benefits: [
      { title: 'Informed Decisions', desc: 'Data-driven insights for better decision making' },
      { title: 'Growth Strategy', desc: 'Clear roadmap for business expansion' },
      { title: 'Risk Mitigation', desc: 'Identify and manage financial risks' },
      { title: 'Profit Optimization', desc: 'Strategies to maximize profitability' }
    ],
    process: [
      { step: '01', title: 'Discovery', desc: 'Understand your business goals and challenges' },
      { step: '02', title: 'Analysis', desc: 'Deep dive into your financial data' },
      { step: '03', title: 'Strategy', desc: 'Develop actionable recommendations' },
      { step: '04', title: 'Support', desc: 'Ongoing guidance and implementation support' }
    ]
  },
  'business-setup': {
    icon: <FaUsers />,
    title: 'Business Setup',
    tagline: 'End-to-End Company Formation',
    heroImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-2pPKi0VWbJ1IZ1-z_Iap1430Hf4RS0kmvw&s',
    description: 'Complete assistance in company formation, registration, and legal structuring to get your business started right.',
    overview: 'Business setup is a critical first step in your entrepreneurial journey. We ensure your business is established correctly, legally compliant, and ready for operations.',
    services: [
      'Private Limited Company',
      'LLP Registration',
      'OPC Registration',
      'Partnership Firm',
      'Sole Proprietorship',
      'GST Registration',
      'MSME/Udyam Registration',
      'Trademark Registration'
    ],
    benefits: [
      { title: 'Hassle-Free Process', desc: 'We handle all paperwork and compliance' },
      { title: 'Expert Guidance', desc: 'Choose the right structure for your business' },
      { title: 'Quick Turnaround', desc: 'Fast registration with minimal delays' },
      { title: 'Complete Compliance', desc: 'All licenses and registrations covered' }
    ],
    process: [
      { step: '01', title: 'Consultation', desc: 'Discuss your business idea and requirements' },
      { step: '02', title: 'Structure', desc: 'Recommend the best legal structure' },
      { step: '03', title: 'Registration', desc: 'Complete all registrations and filings' },
      { step: '04', title: 'Handover', desc: 'Deliver documents and provide ongoing support' }
    ]
  },
  'web-development': {
    icon: <FaCode />,
    title: 'Web Development',
    tagline: 'Professional Digital Solutions',
    heroImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80',
    description: 'Professional website and web application development services to establish your digital presence and grow your business online.',
    overview: 'In today\'s digital age, having a professional online presence is essential for business success. We create modern, responsive, and SEO-optimized websites that help you reach more customers and grow your business.',
    services: [
      'Business & Corporate Websites',
      'E-commerce Development',
      'Custom Web Applications',
      'Landing Pages',
      'Portfolio Websites',
      'Blog & Content Websites',
      'Website Redesign',
      'Website Maintenance'
    ],
    benefits: [
      { title: 'Professional Presence', desc: 'Establish credibility with a modern website' },
      { title: 'Mobile Responsive', desc: 'Perfect display on all devices' },
      { title: 'SEO Optimized', desc: 'Rank higher on Google search results' },
      { title: '24/7 Availability', desc: 'Your business is always accessible online' }
    ],
    process: [
      { step: '01', title: 'Discovery', desc: 'Understand your business needs and goals' },
      { step: '02', title: 'Design', desc: 'Create modern UI/UX design mockups' },
      { step: '03', title: 'Development', desc: 'Build your website with latest technologies' },
      { step: '04', title: 'Launch', desc: 'Deploy and provide ongoing support' }
    ]
  }
};

const ExpertiseDetail = () => {
  const { slug } = useParams();
  const expertise = expertiseData[slug];

  if (!expertise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#0B1530] mb-4">Page Not Found</h1>
          <Link to="/expertise" className="text-[#C9A227] hover:underline">← Back to Expertise</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="font-sans bg-gray-50">
      {/* Hero Section - Compact */}
      <section className="relative min-h-[30vh] flex items-center">
        <div className="absolute inset-0">
          <img src={expertise.heroImage} alt={expertise.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1530] via-[#0B1530]/90 to-[#0B1530]/70" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 py-8">
          <Link to="/expertise" className="inline-flex items-center gap-2 text-[#C9A227] hover:text-white mb-3 transition-colors text-sm">
            Back to All Services
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="w-12 h-12 bg-[#C9A227]/20 rounded-xl flex items-center justify-center text-[#C9A227] text-2xl mb-3">
              {expertise.icon}
            </div>
            <span className="text-[#C9A227] font-semibold tracking-wider uppercase text-xs">{expertise.tagline}</span>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mt-2 mb-2">
              {expertise.title}
            </h1>
            <p className="text-sm text-gray-300 leading-relaxed">
              {expertise.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[#C9A227] font-bold tracking-wider uppercase text-sm">Overview</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0B1530] mt-2 mb-6">
                What We Offer
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {expertise.overview}
              </p>
              <div className="flex gap-4">
                <a href="tel:+918447127264" className="px-6 py-3 bg-[#0B1530] text-white rounded-lg font-semibold hover:bg-[#1a2b5c] transition-colors flex items-center gap-2">
                  <FaPhone size={14} /> Call Now
                </a>
                <a href="https://wa.me/918447127264" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#25D366] text-white rounded-lg font-semibold hover:bg-[#128C7E] transition-colors flex items-center gap-2">
                  <FaWhatsapp size={16} /> WhatsApp
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#F9FAFB] rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold text-[#0B1530] mb-6">Our Services Include</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {expertise.services.map((service, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <FaCheckCircle className="text-[#C9A227] flex-shrink-0" />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-[#C9A227] font-bold tracking-wider uppercase text-sm">Benefits</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0B1530] mt-2">
              Why Choose Us
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertise.benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-[#0B1530] rounded-lg flex items-center justify-center text-[#C9A227] text-xl mb-4">
                  <FaCheckCircle />
                </div>
                <h3 className="text-lg font-bold text-[#0B1530] mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-[#C9A227] font-bold tracking-wider uppercase text-sm">Our Process</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0B1530] mt-2">
              How We Work
            </h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {expertise.process.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-[#C9A227]/20 mb-2">{step.step}</div>
                <h3 className="text-xl font-bold text-[#0B1530] mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
                {idx < expertise.process.length - 1 && (
                  <div className="hidden md:block absolute top-8 right-0 w-1/2 h-0.5 bg-[#C9A227]/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0B1530]">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Contact us today for a free consultation and let our experts help you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="px-8 py-3 bg-[#C9A227] text-[#0B1530] rounded-lg font-bold hover:bg-white transition-colors">
                Contact Us
              </Link>
              <a href="tel:+918447127264" className="px-8 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-[#0B1530] transition-colors">
                +91 84471 27264
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default ExpertiseDetail;
