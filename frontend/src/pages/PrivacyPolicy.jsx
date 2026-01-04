import { motion } from 'framer-motion';
import { FaUserSecret, FaDatabase, FaShareAlt, FaLock, FaUserCheck, FaEnvelope } from 'react-icons/fa';

const PrivacyPolicy = () => {
  const sections = [
    {
      id: 'collect',
      title: '1. Information We Collect',
      icon: <FaUserSecret />,
      content: `We collect information that you provide directly to us, including your name, email address, phone number, billing address, and payment details when you engage with our services or fill out a form on our website.`,
    },
    {
      id: 'usage',
      title: '2. How We Use Your Information',
      icon: <FaDatabase />,
      content: `We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and invoice reminders, and respond to your comments and service inquiries efficiently.`,
    },
    {
      id: 'sharing',
      title: '3. Information Sharing',
      icon: <FaShareAlt />,
      content: `We do not share your personal information with third parties except as described in this policy. We may share strict necessary data with secure service providers (like payment gateways) who perform essential services on our behalf.`,
    },
    {
      id: 'security',
      title: '4. Data Security',
      icon: <FaLock />,
      content: `We implement industry-standard security measures, including SSL encryption and secure server protocols, to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.`,
    },
    {
      id: 'rights',
      title: '5. Your Rights',
      icon: <FaUserCheck />,
      content: `You have the right to access, update, correction, or deletion of your personal information at any time. You may also opt-out of receiving promotional communications from us by following the instructions in those messages.`,
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
            Transparency
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-serif font-bold mb-3 text-[#0B1530]"
          >
            Privacy <span className="text-[#C9A227]">Policy</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto"
          >
            We value your trust and are committed to protecting your personal data.
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
                    <span className="text-[#C9A227]">{section.icon}</span>
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
              <div className="bg-[#0B1530]/5 p-6 rounded-lg border border-[#C9A227]/20 mt-8 flex items-start gap-3">
                <div className="hidden sm:block mt-1 text-[#C9A227]">
                   <FaEnvelope size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0B1530] mb-2">6. Contact Us</h2>
                  <p className="text-gray-600 mb-3 text-sm md:text-base">
                    If you have any questions regarding this Privacy Policy or your personal data, please contact us at:
                  </p>
                  <a 
                    href="mailto:privacy@caassociates.com" 
                    className="text-[#C9A227] font-semibold hover:text-[#0B1530] transition-colors text-sm md:text-base underline decoration-[#C9A227]/30 underline-offset-2"
                  >
                    privacy@caassociates.com
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default PrivacyPolicy;



