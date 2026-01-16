import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaQuestionCircle, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'tax', name: 'Tax Filing' },
    { id: 'gst', name: 'GST' },
    { id: 'company', name: 'Company Registration' },
    { id: 'pricing', name: 'Pricing & Payment' },
    { id: 'process', name: 'Process & Timeline' },
  ];

  const faqs = [
    // Tax Filing
    {
      category: 'tax',
      question: 'What is the deadline for filing Income Tax Returns (ITR)?',
      answer: 'For individuals (non-audit cases), the ITR filing deadline is July 31st of the assessment year. For businesses requiring audit, the deadline is October 31st. However, we recommend filing early to avoid last-minute rush and potential technical issues on the portal.'
    },
    {
      category: 'tax',
      question: 'What documents do I need for ITR filing?',
      answer: 'You need: PAN card, Aadhaar card, Form 16 (from employer), Bank statements, Investment proofs (80C, 80D), Capital gains statements, Home loan interest certificate, and any other income proof. We provide a detailed checklist after you book our service.'
    },
    {
      category: 'tax',
      question: 'Can I file ITR if I have income from multiple sources?',
      answer: 'Yes, absolutely! We handle ITR filing for income from salary, business, capital gains, house property, and other sources. Our experts will help you consolidate all income sources and file the appropriate ITR form.'
    },
    {
      category: 'tax',
      question: 'What happens if I miss the ITR filing deadline?',
      answer: 'You can still file a belated return up to December 31st of the assessment year, but you may face penalties and lose certain benefits like carrying forward losses. We recommend filing on time to avoid complications.'
    },

    // GST
    {
      category: 'gst',
      question: 'Who needs GST registration?',
      answer: 'GST registration is mandatory if your annual turnover exceeds ₹40 lakhs (₹20 lakhs for special category states) for goods, or ₹20 lakhs (₹10 lakhs for special category states) for services. E-commerce sellers and inter-state suppliers need registration regardless of turnover.'
    },
    {
      category: 'gst',
      question: 'How long does GST registration take?',
      answer: 'GST registration typically takes 3-7 working days if all documents are correct. We handle the entire process including application filing, ARN generation, and certificate download. You can track the status through your dashboard.'
    },
    {
      category: 'gst',
      question: 'What is the difference between GSTR-1 and GSTR-3B?',
      answer: 'GSTR-1 is a monthly/quarterly return for outward supplies (sales), while GSTR-3B is a monthly summary return showing both sales and purchases with tax liability. GSTR-3B must be filed monthly by all regular taxpayers.'
    },
    {
      category: 'gst',
      question: 'Can I claim Input Tax Credit (ITC)?',
      answer: 'Yes, you can claim ITC on GST paid on business purchases if you have valid tax invoices and the supplier has filed their returns. We help you maximize ITC claims while ensuring compliance.'
    },

    // Company Registration
    {
      category: 'company',
      question: 'What is the difference between Private Limited and LLP?',
      answer: 'Private Limited offers limited liability, easier funding, and better credibility but requires more compliance. LLP offers flexibility, lower compliance, and is suitable for professional services. We help you choose based on your business needs.'
    },
    {
      category: 'company',
      question: 'How long does company registration take?',
      answer: 'Private Limited registration takes 10-15 days, LLP takes 7-10 days, and Partnership/Proprietorship takes 3-5 days. Timeline depends on document verification and government processing.'
    },
    {
      category: 'company',
      question: 'What documents are needed for company registration?',
      answer: 'You need: PAN & Aadhaar of directors/partners, Address proof, Passport size photos, Registered office proof (rent agreement/NOC), and Digital Signature Certificate (DSC). We guide you through the entire documentation process.'
    },
    {
      category: 'company',
      question: 'Do I need a physical office for company registration?',
      answer: 'Yes, you need a registered office address with proof (rent agreement, electricity bill, or NOC from owner). We can also help you with virtual office solutions if needed.'
    },

    // Pricing & Payment
    {
      category: 'pricing',
      question: 'How much do your services cost?',
      answer: 'Our pricing varies by service. ITR filing starts from ₹499, GST registration from ₹2,999, and company registration from ₹7,999. Visit our Pricing page for detailed packages or request a custom quote for your specific needs.'
    },
    {
      category: 'pricing',
      question: 'Are there any hidden charges?',
      answer: 'No, we believe in complete transparency. All charges are mentioned upfront including government fees, professional fees, and any additional costs. No surprises, no hidden charges.'
    },
    {
      category: 'pricing',
      question: 'What payment methods do you accept?',
      answer: 'We accept bank transfers, UPI, credit/debit cards, and online payments through our secure payment gateway. For larger projects, we offer milestone-based payment plans.'
    },
    {
      category: 'pricing',
      question: 'Do you offer refunds?',
      answer: 'Yes, we have a clear refund policy. If we are unable to deliver the service due to any reason from our end, we provide a full refund. Please check our Refund Policy page for detailed terms.'
    },

    // Process & Timeline
    {
      category: 'process',
      question: 'How does your service process work?',
      answer: 'Simple 4-step process: 1) Book service and share requirements, 2) Our expert reviews and provides consultation, 3) Upload documents securely, 4) We process and deliver with ongoing support. You can track status in real-time through your dashboard.'
    },
    {
      category: 'process',
      question: 'Can I track my service status?',
      answer: 'Yes! Once you book a service, you get access to a dashboard where you can track real-time status, upload documents, communicate with your assigned expert, and download completed documents.'
    },
    {
      category: 'process',
      question: 'Do you provide support after service delivery?',
      answer: 'Absolutely! We provide ongoing support for all services. If you face any issues, receive notices, or have questions after delivery, our team is available via phone, email, and chat to assist you.'
    },
    {
      category: 'process',
      question: 'What if I need urgent service?',
      answer: 'We offer express processing for urgent requirements at a nominal additional charge. Contact us with your deadline, and we will do our best to accommodate your timeline.'
    },

    // General
    {
      category: 'all',
      question: 'Is my data secure with you?',
      answer: 'Yes, absolutely! We use bank-grade encryption, secure cloud storage, and follow strict data protection protocols. Your financial and personal information is 100% confidential and never shared with third parties.'
    },
    {
      category: 'all',
      question: 'Do you provide free consultation?',
      answer: 'Yes, we offer free initial consultation to understand your requirements and suggest the best solution. You can book a consultation through our website or call us directly.'
    },
    {
      category: 'all',
      question: 'Can I get a custom package for my business?',
      answer: 'Yes! We understand every business is unique. Contact us with your specific requirements, and we will create a customized package with transparent pricing tailored to your needs.'
    },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="font-sans bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary py-12 md:py-16 pt-20 md:pt-28">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-4"
          >
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
              <FaQuestionCircle className="text-primary text-2xl" />
            </div>
          </motion.div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Find answers to common questions about our tax and business services
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-6 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {filteredFaqs.length > 0 ? (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-lg border-2 transition-all duration-300 overflow-hidden ${
                    openIndex === index
                      ? 'border-secondary shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm transition-colors ${
                        openIndex === index
                          ? 'bg-secondary text-primary'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        openIndex === index
                          ? 'bg-secondary text-primary'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <FaChevronDown size={14} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 border-t border-gray-100 pt-4">
                          <p className="text-gray-600 leading-relaxed pl-12">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <FaQuestionCircle className="text-gray-300 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No questions found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or category filter</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('all');
                }}
                className="text-secondary font-semibold hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-gray-600 mb-8">
            Can't find the answer you're looking for? Our team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-block px-6 py-2.5 text-sm md:text-base bg-primary text-white rounded-lg font-semibold hover:bg-secondary hover:text-primary transition-all shadow-md"
            >
              Contact Us
            </Link>
            <Link
              to="/quote"
              className="inline-block px-6 py-2.5 text-sm md:text-base border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FAQ;

