import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFileContract } from 'react-icons/fa';
import api from '../api/axios';

const TermsConditions = () => {
  const [content, setContent] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTermsConditions();
  }, []);

  const fetchTermsConditions = async () => {
    try {
      const { data } = await api.get('/settings');
      if (data.success) {
        setContent(data.data.termsConditions || 'Terms & Conditions content will be available soon.');
        setLastUpdated(data.data.lastUpdated);
      }
    } catch (error) {
      console.error('Error fetching terms:', error);
      setContent('Unable to load terms & conditions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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
            Terms & <span className="text-[#C9A227]">Conditions</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto"
          >
            Please read these terms carefully before using our services.
            {lastUpdated && (
              <>
                <br />
                <span className="text-xs text-gray-500 mt-2 block">
                  Last updated: {new Date(lastUpdated).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </>
            )}
          </motion.p>
        </div>
      </section>

      {/* ==================== CONTENT SECTION ==================== */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-[#C9A227] border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200/60"
            >
              <div className="prose prose-gray max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {content}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

    </div>
  );
};

export default TermsConditions;
                    {section.content}
                  </p>
                  
                  {/* Divider */}
                  {index !== sections.length - 1 && (
                    <div className="w-full h-px bg-gray-200 mt-6"></div>
                  )}
                </div>
              ))}

              {/* Contact Section */}
              <div className="bg-[#0B1530]/5 p-6 rounded-lg border border-[#C9A227]/20 mt-8">
                <h2 className="text-lg font-bold text-[#0B1530] mb-2">8. Contact Us</h2>
                <p className="text-gray-600 mb-3 text-sm md:text-base">
                  If you have any questions about these Terms & Conditions, please contact us at:
                </p>
                <a 
                  href="mailto:info@caassociates.com" 
                  className="text-[#C9A227] font-semibold hover:text-[#0B1530] transition-colors text-sm md:text-base underline decoration-[#C9A227]/30 underline-offset-2"
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


