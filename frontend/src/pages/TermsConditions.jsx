import { motion } from 'framer-motion';
import { FaFileContract, FaGavel, FaExclamationCircle, FaRegCopyright, FaShieldAlt } from 'react-icons/fa';

const TermsConditions = () => {
  const sections = [
    {
      id: 'intro',
      title: '1. Introduction',
      icon: <FaFileContract />,
      content: `These Terms and Conditions govern your use of our website and services. By accessing or using our website, you agree to be bound by these terms. If you disagree with any part of these terms, you may not access the service.`,
    },
    {
      id: 'services',
      title: '2. Services',
      icon: <FaGavel />,
      content: `We provide professional chartered accountancy services including tax consulting, auditing, and financial advisory. All services are subject to these terms and any specific engagement letters signed between us and the client.`,
    },
    {
      id: 'payments',
      title: '3. Payments',
      icon: <FaExclamationCircle />,
      content: `All payments must be made in advance unless otherwise agreed in writing. We accept bank transfers, UPI, and major credit cards. Late payments may incur additional interest charges of 1.5% per month.`,
    },
    {
      id: 'refunds',
      title: '4. Refunds',
      icon: <FaShieldAlt />,
      content: `Our refund policy is strictly outlined in our separate Refund Policy document. Generally, fees paid for completed services are non-refundable. Retainers may be refunded on a pro-rata basis if the engagement is terminated early.`,
    },
    {
      id: 'ip',
      title: '5. Intellectual Property',
      icon: <FaRegCopyright />,
      content: `All content on this website, including text, graphics, logos, and software, is the property of CA Associates and is protected by international copyright laws.`,
    },
    {
      id: 'liability',
      title: '6. Limitation of Liability',
      icon: null,
      content: `We are not liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.`,
    },
    {
      id: 'changes',
      title: '7. Changes to Terms',
      icon: null,
      content: `We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.`,
    },
  ];

  return (
    <div className="font-sans text-gray-800 bg-white min-h-screen">
      
      {/* ==================== HERO SECTION - SIMPLE ==================== */}
      <section className="py-6 md:py-8 border-b border-gray-200">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <motion.span 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-[#0B1530] font-semibold tracking-wider uppercase text-xs mb-2 block"
          >
            Legal
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-serif font-bold mb-3 text-[#0B1530]"
          >
            Terms & <span className="text-[#D4AF37]">Conditions</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto"
          >
            Please read these terms carefully before using our services.
            <br />
            <span className="text-xs text-gray-500 mt-2 block">Last updated: November 28, 2025</span>
          </motion.p>
        </div>
      </section>

      {/* ==================== CONTENT SECTION ==================== */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200/60"
          >
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div key={section.id} className="relative">
                  <h2 className="text-lg md:text-xl font-bold text-[#0B1530] mb-3 flex items-center gap-2">
                    {/* Icon for mobile layout */}
                    {section.icon && <span className="text-[#D4AF37]">{section.icon}</span>}
                    {section.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {section.content}
                  </p>
                  
                  {/* Divider */}
                  {index !== sections.length - 1 && (
                    <div className="w-full h-px bg-gray-200 mt-6"></div>
                  )}
                </div>
              ))}

              {/* Contact Section */}
              <div className="bg-[#0B1530]/5 p-6 rounded-lg border border-[#D4AF37]/20 mt-8">
                <h2 className="text-lg font-bold text-[#0B1530] mb-2">8. Contact Us</h2>
                <p className="text-gray-600 mb-3 text-sm md:text-base">
                  If you have any questions about these Terms & Conditions, please contact us at:
                </p>
                <a 
                  href="mailto:info@caassociates.com" 
                  className="text-[#D4AF37] font-semibold hover:text-[#0B1530] transition-colors text-sm md:text-base underline decoration-[#D4AF37]/30 underline-offset-2"
                >
                  info@caassociates.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default TermsConditions;


