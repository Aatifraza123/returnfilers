import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import Card from '../components/common/Card'; // Ensure this component supports classNames/children
import Loader from '../components/common/Loader';
import { FaBuilding, FaChartLine, FaSearch } from 'react-icons/fa';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const { data } = await axios.get('/api/portfolio');
      setPortfolio(data.portfolio || []);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      toast.error('Failed to load portfolio items');
      setPortfolio([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size="xl" color="#D4AF37" />
      </div>
    );
  }

  return (
    <main className="font-sans text-gray-800 bg-white">
      
      {/* ==================== HERO SECTION - SIMPLE ==================== */}
      <section className="py-6 md:py-8 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-6xl">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#0B1530] font-bold tracking-widest uppercase text-sm mb-2 block"
          >
            Our Work
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-serif font-bold mb-3 text-[#0B1530]"
          >
            Success <span className="text-[#D4AF37]">Stories</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Explore how we've helped businesses navigate financial complexities and achieve sustainable growth.
          </motion.p>
        </div>
      </section>

      {/* ==================== PORTFOLIO GRID - MORE COMPACT ==================== */}
      <section className="py-5 md:py-6 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          
          {portfolio.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {portfolio.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 border border-gray-100/80 flex flex-col backdrop-blur-sm"
                >
                  {/* Image Area - Modern */}
                  <div className="relative h-44 md:h-52 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {item.images?.[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                        <FaBuilding size={40} />
                      </div>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Date Badge - Modern */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/50">
                      <span className="text-[#0B1530] text-xs font-bold">{new Date(item.date).getFullYear()}</span>
                    </div>

                    {/* Client Name - Modern */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-[#D4AF37] font-semibold uppercase tracking-wide text-[10px] mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Client</p>
                      <h3 className="text-white text-base md:text-lg font-bold drop-shadow-lg">{item.client}</h3>
                    </div>
                  </div>

                  {/* Content Area - Modern */}
                  <div className="p-4 md:p-5 flex flex-col flex-grow bg-white relative z-10">
                    <h2 className="text-base md:text-lg font-bold text-[#0B1530] mb-2 group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2">
                      {item.title}
                    </h2>
                    
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3 flex-grow line-clamp-3">
                      {item.description}
                    </p>

                    {/* Outcome Box - Modern */}
                    {item.outcome && (
                      <div className="relative pl-4 border-l-4 border-[#D4AF37] py-2.5 bg-gradient-to-r from-[#D4AF37]/5 to-transparent rounded-r-lg">
                        <div className="flex items-center gap-2 mb-1.5">
                           <FaChartLine className="text-[#D4AF37] text-sm" />
                           <span className="text-[#0B1530] font-semibold text-xs uppercase tracking-wide">Key Outcome</span>
                        </div>
                        <p className="text-gray-700 text-xs md:text-sm italic line-clamp-2 leading-relaxed">
                          "{item.outcome}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-[#D4AF37]/0 group-hover:border-[#D4AF37]/30 transition-all duration-300 pointer-events-none"></div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Empty State - Compact */
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400 text-4xl">
                <FaSearch />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No portfolio items yet</h3>
              <p className="text-gray-500 text-base">
                Check back soon to see our latest case studies.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Portfolio;

