import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaFileInvoiceDollar, 
  FaBalanceScale, 
  FaChartLine, 
  FaUsers,
  FaCheckCircle,
  FaArrowLeft,
  FaPhone,
  FaWhatsapp,
  FaCode,
  FaClock,
  FaShieldAlt,
  FaHeadset,
  FaFileAlt,
  FaQuestionCircle
} from 'react-icons/fa';

const expertiseData = {
  'tax-consulting': {
    icon: <FaFileInvoiceDollar />,
    title: 'Tax Consulting',
    tagline: 'Expert Tax Planning & Compliance',
    heroImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2072&auto=format&fit=crop',
    description: 'Our comprehensive tax consulting services help businesses and individuals navigate the complex world of taxation with confidence.',
    overview: 'Tax consulting is crucial for any business or individual looking to optimize their financial position. Our team of experienced tax consultants specializes in all aspects of taxation including income tax, GST, corporate tax, and international taxation.',
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
      { title: 'Expert Guidance', desc: 'Advice from certified tax consultants' },
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
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // FAQ data for each expertise
  const faqData = {
    'tax-consulting': [
      { question: 'What documents do I need for tax filing?', answer: 'You need PAN card, Aadhaar card, Form 16, bank statements, investment proofs, and any other income documents.' },
      { question: 'When should I file my income tax return?', answer: 'For individuals, the deadline is July 31st of the assessment year. For businesses, it varies based on audit requirements.' },
      { question: 'Can you help with GST registration?', answer: 'Yes, we provide complete GST registration services including documentation, filing, and ongoing compliance support.' },
      { question: 'What is advance tax planning?', answer: 'Advance tax planning involves strategic financial decisions throughout the year to minimize tax liability legally and maximize savings.' }
    ],
    'auditing': [
      { question: 'What is the difference between statutory and internal audit?', answer: 'Statutory audit is mandatory by law for certain entities, while internal audit is voluntary and focuses on internal controls and processes.' },
      { question: 'How long does an audit take?', answer: 'Audit duration depends on company size and complexity. Typically, it ranges from 2-4 weeks for small businesses to several months for large corporations.' },
      { question: 'Do I need a tax audit?', answer: 'Tax audit is mandatory if your business turnover exceeds ₹1 crore (for business) or ₹50 lakhs (for professionals), or if you opt for presumptive taxation.' },
      { question: 'What happens during a forensic audit?', answer: 'Forensic audit investigates financial irregularities, fraud, or disputes. It involves detailed examination of records and may be used in legal proceedings.' }
    ],
    'financial-advisory': [
      { question: 'What is financial advisory?', answer: 'Financial advisory provides strategic guidance on investments, budgeting, cash flow, business valuation, and financial planning to help achieve your goals.' },
      { question: 'How can financial advisory help my business?', answer: 'We help optimize financial performance, identify growth opportunities, manage risks, improve cash flow, and make informed strategic decisions.' },
      { question: 'What is business valuation?', answer: 'Business valuation determines the economic value of your company using various methods like DCF, comparable company analysis, and asset-based valuation.' },
      { question: 'Do you provide M&A advisory?', answer: 'Yes, we provide comprehensive M&A advisory including target identification, valuation, due diligence, negotiation support, and deal structuring.' }
    ],
    'business-setup': [
      { question: 'Which business structure is right for me?', answer: 'It depends on your business size, funding needs, liability concerns, and tax implications. We help you choose between Pvt Ltd, LLP, OPC, or Partnership.' },
      { question: 'How long does company registration take?', answer: 'Private Limited Company registration typically takes 7-10 days, while LLP registration takes 5-7 days, subject to document verification.' },
      { question: 'What is the cost of company registration?', answer: 'Costs vary based on business structure and authorized capital. Contact us for a detailed quote tailored to your requirements.' },
      { question: 'Do I need GST registration immediately?', answer: 'GST registration is mandatory if your turnover exceeds ₹40 lakhs (₹20 lakhs for special category states) or if you\'re in certain business categories.' }
    ],
    'web-development': [
      { question: 'How long does it take to build a website?', answer: 'A basic website takes 2-3 weeks, while complex e-commerce or custom applications may take 6-12 weeks depending on requirements.' },
      { question: 'Will my website be mobile-friendly?', answer: 'Yes, all our websites are fully responsive and optimized for mobile, tablet, and desktop devices.' },
      { question: 'Do you provide website maintenance?', answer: 'Yes, we offer ongoing maintenance packages including updates, security patches, backups, and technical support.' },
      { question: 'Can you help with SEO?', answer: 'Yes, all our websites are built with SEO best practices. We also offer dedicated SEO services to improve your search rankings.' }
    ]
  };

  if (!expertise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Page Not Found</h1>
          <Link to="/expertise" className="text-secondary hover:underline">← Back to Expertise</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="font-sans bg-gray-50">
      {/* Hero Section - Compact */}
      <section className="relative min-h-[30vh] flex items-center pt-20 md:pt-24">
        <div className="absolute inset-0">
          <img src={expertise.heroImage} alt={expertise.title} className="w-full h-full object-cover" />
          <div 
            className="absolute inset-0"
            style={{ 
              background: `linear-gradient(to right, var(--color-primary), var(--color-primary-90), var(--color-primary-70))`
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 py-8 md:py-10">
          <Link 
            to="/expertise" 
            className="inline-flex items-center gap-2 hover:text-white mb-4 transition-colors text-xs md:text-sm"
            style={{ color: 'var(--color-secondary)' }}
          >
            <FaArrowLeft size={12} /> Back to All Services
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <span 
              className="font-semibold tracking-wider uppercase text-xs md:text-sm"
              style={{ color: 'var(--color-secondary)' }}
            >
              {expertise.tagline}
            </span>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-white mt-2 mb-2">
              {expertise.title}
            </h1>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              {expertise.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why This Service - Simple 3 Cards */}
      <section 
        className="py-8 border-b border-gray-100"
        style={{ backgroundColor: 'var(--color-bg-light)' }}
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: 'var(--color-secondary-light)' }}
              >
                <FaClock style={{ color: 'var(--color-secondary)' }} size={20} />
              </div>
              <h3 
                className="font-bold text-sm mb-1"
                style={{ color: 'var(--color-primary)' }}
              >
                Quick Turnaround
              </h3>
              <p className="text-gray-600 text-xs">Fast and efficient service delivery</p>
            </div>
            <div className="text-center">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: 'var(--color-secondary-light)' }}
              >
                <FaShieldAlt style={{ color: 'var(--color-secondary)' }} size={20} />
              </div>
              <h3 
                className="font-bold text-sm mb-1"
                style={{ color: 'var(--color-primary)' }}
              >
                100% Compliance
              </h3>
              <p className="text-gray-600 text-xs">Fully compliant with all regulations</p>
            </div>
            <div className="text-center">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: 'var(--color-secondary-light)' }}
              >
                <FaHeadset style={{ color: 'var(--color-secondary)' }} size={20} />
              </div>
              <h3 
                className="font-bold text-sm mb-1"
                style={{ color: 'var(--color-primary)' }}
              >
                Expert Support
              </h3>
              <p className="text-gray-600 text-xs">Dedicated assistance throughout</p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section 
        className="py-16"
        style={{ backgroundColor: 'var(--color-bg-light)' }}
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span 
                className="font-bold tracking-wider uppercase text-sm"
                style={{ color: 'var(--color-secondary)' }}
              >
                Overview
              </span>
              <h2 
                className="text-3xl md:text-4xl font-serif font-bold mt-2 mb-6"
                style={{ color: 'var(--color-primary)' }}
              >
                What We Offer
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {expertise.overview}
              </p>
              <div className="flex gap-4">
                <a 
                  href="tel:+918447127264" 
                  className="px-6 py-3 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-secondary)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
                >
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
              <h3 
                className="text-xl font-bold mb-6"
                style={{ color: 'var(--color-primary)' }}
              >
                Our Services Include
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {expertise.services.map((service, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <FaCheckCircle 
                      className="flex-shrink-0" 
                      style={{ color: 'var(--color-secondary)' }}
                    />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Required Documents - Simple List */}
      <section 
        className="py-12"
        style={{ backgroundColor: 'var(--color-bg-light)' }}
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-xl border border-gray-100">
            <h2 
              className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2"
              style={{ color: 'var(--color-primary)' }}
            >
              <FaFileAlt style={{ color: 'var(--color-secondary)' }} size={18} />
              Required Documents
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <span style={{ color: 'var(--color-secondary)' }} className="mt-0.5">•</span>
                <span>PAN Card (Individual/Company)</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <span style={{ color: 'var(--color-secondary)' }} className="mt-0.5">•</span>
                <span>Aadhaar Card / Address Proof</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <span style={{ color: 'var(--color-secondary)' }} className="mt-0.5">•</span>
                <span>Business Registration Documents (if applicable)</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <span style={{ color: 'var(--color-secondary)' }} className="mt-0.5">•</span>
                <span>Bank Account Details & Statements</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <span style={{ color: 'var(--color-secondary)' }} className="mt-0.5">•</span>
                <span>Previous Year Financial Records (if applicable)</span>
              </div>
              <p className="text-xs text-gray-500 mt-4 italic">
                * Additional documents may be required based on specific service requirements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <span 
              className="font-bold tracking-wider uppercase text-sm"
              style={{ color: 'var(--color-secondary)' }}
            >
              Benefits
            </span>
            <h2 
              className="text-3xl md:text-4xl font-serif font-bold mt-2"
              style={{ color: 'var(--color-primary)' }}
            >
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
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-xl mb-4"
                  style={{ 
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-secondary)'
                  }}
                >
                  <FaCheckCircle />
                </div>
                <h3 
                  className="text-lg font-bold mb-2"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {benefit.title}
                </h3>
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
            <span 
              className="font-bold tracking-wider uppercase text-sm"
              style={{ color: 'var(--color-secondary)' }}
            >
              Our Process
            </span>
            <h2 
              className="text-3xl md:text-4xl font-serif font-bold mt-2"
              style={{ color: 'var(--color-primary)' }}
            >
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
                <div 
                  className="text-6xl font-bold mb-2 opacity-20"
                  style={{ color: 'var(--color-secondary)' }}
                >
                  {step.step}
                </div>
                <h3 
                  className="text-xl font-bold mb-2"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
                {idx < expertise.process.length - 1 && (
                  <div 
                    className="hidden md:block absolute top-8 right-0 w-1/2 h-0.5 opacity-30"
                    style={{ backgroundColor: 'var(--color-secondary)' }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {faqData[slug] && faqData[slug].length > 0 && (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-6 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span 
                className="inline-block px-4 py-1.5 rounded-full mb-4 text-xs font-bold uppercase tracking-wider"
                style={{ 
                  backgroundColor: 'var(--color-secondary-light)',
                  color: 'var(--color-secondary)'
                }}
              >
                Got Questions?
              </span>
              <h2 
                className="text-2xl md:text-3xl font-serif font-bold mb-3"
                style={{ color: 'var(--color-primary)' }}
              >
                Frequently Asked Questions
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-sm">
                Find answers to common questions about this service
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4">
              {faqData[slug].map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full p-5 flex items-start gap-4 cursor-pointer focus:outline-none text-left"
                  >
                    <div 
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        backgroundColor: openFaqIndex === idx 
                          ? 'var(--color-secondary)' 
                          : 'var(--color-secondary-light)',
                        color: openFaqIndex === idx ? '#ffffff' : 'var(--color-secondary)'
                      }}
                    >
                      <FaQuestionCircle size={18} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 
                        className="font-semibold text-sm md:text-base transition-colors"
                        style={{
                          color: openFaqIndex === idx 
                            ? 'var(--color-secondary)' 
                            : 'var(--color-primary)'
                        }}
                      >
                        {faq.question}
                      </h3>
                    </div>
                    
                    <div 
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300"
                      style={{ backgroundColor: 'var(--color-secondary-light)' }}
                      {...(openFaqIndex === idx && { style: { transform: 'rotate(180deg)', backgroundColor: 'var(--color-secondary-light)' } })}
                    >
                      <span style={{ color: 'var(--color-secondary)' }} className="text-xs">▼</span>
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {openFaqIndex === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pl-[4.5rem]">
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section 
        className="py-16"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
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
              <Link 
                to="/contact" 
                className="px-8 py-3 rounded-lg font-bold transition-colors"
                style={{ 
                  backgroundColor: 'var(--color-secondary)',
                  color: 'var(--color-primary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = 'var(--color-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-secondary)';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
              >
                Contact Us
              </Link>
              <a 
                href="tel:+918447127264" 
                className="px-8 py-3 border-2 text-white rounded-lg font-bold transition-colors"
                style={{ borderColor: '#ffffff' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#ffffff';
                }}
              >
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

