import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserSecret } from 'react-icons/fa';
import api from '../api/axios';

const PrivacyPolicy = () => {
  const [content, setContent] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const fetchPrivacyPolicy = async () => {
    try {
      const { data } = await api.get('/settings');
      if (data.success) {
        setContent(data.data.privacyPolicy || 'Privacy Policy content will be available soon.');
        setLastUpdated(data.data.lastUpdated);
      }
    } catch (error) {
      console.error('Error fetching privacy policy:', error);
      setContent('Unable to load privacy policy. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to make emails clickable and bold important terms
  const formatContent = (text) => {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const parts = text.split(emailRegex);
    
    return parts.map((part, index) => {
      const testRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+$/i;
      if (testRegex.test(part)) {
        return (
          <a 
            key={index} 
            href={`mailto:${part}`} 
            className="text-[#C9A227] hover:text-[#0B1530] underline transition-colors font-bold"
          >
            {part}
          </a>
        );
      }
      
      // Bold important section headings and key terms with black color
      const boldTerms = [
        'Information We Collect',
        'How We Use Your Information',
        'Information Sharing',
        'Data Security',
        'Third-Party Sharing',
        'Your Rights',
        'Contact Us',
        'Cookies',
        'Data Protection'
      ];
      
      let formattedPart = part;
      boldTerms.forEach(term => {
        const regex = new RegExp(`(${term})`, 'gi');
        formattedPart = formattedPart.replace(regex, '<strong class="text-black font-bold">$1</strong>');
      });
      
      return <span key={index} dangerouslySetInnerHTML={{ __html: formattedPart }} />;
    });
  };

  return (
    <div className="font-sans text-gray-800 bg-white min-h-screen pt-20">
      
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
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-loose text-base">
                  {formatContent(content)}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

    </div>
  );
};

export default PrivacyPolicy;



