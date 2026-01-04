import { motion } from 'framer-motion';
import { FaMoneyBillWave, FaHistory, FaBan, FaPercentage, FaEnvelope } from 'react-icons/fa';

const RefundPolicy = () => {
  const sections = [
    {
      id: 'eligibility',
      title: '1. Refund Eligibility',
      icon: <FaMoneyBillWave />,
      content: `Refunds are generally available only for services that have not yet commenced or been delivered. Once our team has started working on your file (e.g., tax analysis, document verification), full refunds are no longer applicable to cover the billable hours used.`,
    },
    {
      id: 'process',
      title: '2. Refund Process',
      icon: <FaHistory />,
      content: `To request a refund, you must contact our support team within 7 days of the initial payment. All requests must include the transaction ID and a valid reason for cancellation. Approved refunds will be processed back to the original payment method within 7-14 business days.`,
    },
    {
      id: 'non-refundable',
      title: '3. Non-Refundable Items',
      icon: <FaBan />,
      content: `Certain services are strictly non-refundable. These include government fees paid on your behalf (e.g., MCA filing fees, GST registration fees), expedited service charges, and digital products/reports that have already been downloaded or emailed.`,
    },
    {
      id: 'partial',
      title: '4. Partial Refunds',
      icon: <FaPercentage />,
      content: `If partial work has been completed but the service cannot be fully delivered due to unforeseen circumstances or client cancellation, a partial refund may be issued at our sole discretion. We will deduct a fair amount for the hours and resources already utilized.`,
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
            Billing & Support
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-serif font-bold mb-3 text-[#0B1530]"
          >
            Refund <span className="text-[#C9A227]">Policy</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto"
          >
            We aim for complete satisfaction. Here is how we handle cancellations and refunds.
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
                  <h2 className="text-lg font-bold text-[#0B1530] mb-2">5. Contact Us</h2>
                  <p className="text-gray-600 mb-3 text-sm md:text-base">
                    For any questions regarding refunds or billing discrepancies, please email us at:
                  </p>
                  <a 
                    href="mailto:info@caassociates.com" 
                    className="text-[#C9A227] font-semibold hover:text-[#0B1530] transition-colors text-sm md:text-base underline decoration-[#C9A227]/30 underline-offset-2"
                  >
                    info@caassociates.com
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

export default RefundPolicy;

