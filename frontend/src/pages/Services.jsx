import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader'; 
import { Link } from 'react-router-dom';
import { FaCheck, FaSearch, FaArrowRight, FaRupeeSign, FaStar } from 'react-icons/fa';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [hoveredService, setHoveredService] = useState(null);

  useEffect(() => {
    fetchServices();
    const interval = setInterval(fetchServices, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await axios.get(`/api/services?t=${Date.now()}`);
      const serviceData = Array.isArray(data) ? data : (data.services || []);
      setServices(serviceData);
      console.log('Services fetched:', serviceData.length, 'services');
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
      setServices([]); 
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'tax', 'audit', 'advisory', 'compliance'];

  const filteredServices = filter === 'all' 
    ? services 
    : services.filter(s => s.category?.toLowerCase() === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader size="lg" color="#D4AF37" />
      </div>
    );
  }

  return (
    <main className="font-sans text-gray-800 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      
      {/* ==================== MODERN HERO SECTION ==================== */}
      <section className="relative py-10 md:py-14 bg-gradient-to-br from-[#0B1530] via-[#1a2b5c] to-[#0B1530] text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              x: [0, 30, 0],
              y: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 left-0 w-72 h-72 bg-[#D4AF37]/8 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          ></motion.div>
          <motion.div
            animate={{
              x: [0, -30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute bottom-0 right-0 w-72 h-72 bg-[#D4AF37]/8 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"
          ></motion.div>
        </div>
        
        <div className="absolute inset-0 opacity-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", type: "spring", stiffness: 100 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/20 backdrop-blur-sm border border-[#D4AF37]/30 mb-4"
          >
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <FaStar className="text-[#D4AF37]" size={12} />
            </motion.div>
            <span className="text-[#D4AF37] font-semibold tracking-wider uppercase text-[10px] sm:text-xs">
              What We Offer
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, x: -50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut", type: "spring", stiffness: 80 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight"
          >
            Premium <motion.span 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F5D76E]"
            >Services</motion.span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
            className="text-sm sm:text-base md:text-lg text-gray-300 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Comprehensive financial solutions tailored to your business needs. Experience excellence with our expert team.
          </motion.p>
        </div>
      </section>

      {/* ==================== MODERN FILTER SECTION ==================== */}
      <section className="sticky top-[80px] z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-3">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setFilter(cat)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-4 sm:px-5 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wide transition-all duration-300 overflow-hidden ${
                  filter === cat
                    ? 'bg-gradient-to-r from-[#0B1530] to-[#1a2b5c] text-white shadow-md shadow-[#0B1530]/15'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-[#0B1530]'
                }`}
              >
                {filter === cat && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] opacity-20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== MODERN SERVICES GRID ==================== */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service._id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                onHoverStart={() => setHoveredService(service._id)}
                onHoverEnd={() => setHoveredService(null)}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-gray-200/60 flex flex-col h-full backdrop-blur-sm"
              >
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 via-[#D4AF37]/0 to-[#D4AF37]/0 group-hover:from-[#D4AF37]/5 group-hover:via-[#D4AF37]/10 group-hover:to-[#D4AF37]/5 transition-all duration-500 z-0"></div>
                
                {/* Image Area with Modern Effects */}
                <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
                  <motion.div
                    animate={{
                      scale: hoveredService === service._id ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full h-full"
                  >
                    <img
                      src={service.image || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80"} 
                      alt={service.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80";
                      }}
                    />
                  </motion.div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1530]/70 via-transparent to-transparent"></div>
                  
                  {/* Shine Effect on Hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full"
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                  
                  {/* Category Badge - Modern Design */}
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    className="absolute top-3 right-3 bg-white/95 backdrop-blur-xl px-3 py-1.5 rounded-full shadow-lg border border-gray-200/50"
                  >
                    <span className="text-[#0B1530] text-[10px] font-bold uppercase tracking-wider">
                      {service.category}
                    </span>
                  </motion.div>

                  {/* Price Badge */}
                  <div className="absolute bottom-3 left-3 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] px-3 py-1.5 rounded-full shadow-md">
                    <div className="flex items-center gap-1">
                      <FaRupeeSign size={10} className="text-[#0B1530]" />
                      <span className="text-[#0B1530] font-bold text-xs">
                        {service.price && !isNaN(Number(service.price)) 
                          ? Number(service.price).toLocaleString() 
                          : 'On Request'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Area - Modern Typography */}
                <div className="p-5 md:p-6 flex flex-col flex-grow relative z-10">
                  <div className="mb-3">
                    <h3 className="text-lg md:text-xl font-serif font-bold text-[#0B1530] mb-2 group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2">
                      {service.title}
                    </h3>
                  </div>
                  
                  <p className="text-xs md:text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3 flex-grow">
                    {service.description}
                  </p>

                  {/* Features List - Modern Design */}
                  {service.features && service.features.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-2"
                        >
                          <div className="mt-0.5 w-4 h-4 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] flex items-center justify-center flex-shrink-0">
                            <FaCheck size={8} className="text-[#0B1530]" />
                          </div>
                          <span className="text-[10px] md:text-xs text-gray-700 leading-relaxed">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* CTA Button - Modern Design */}
                  <div className="mt-auto pt-4 border-t border-gray-100/50">
                    <Link
                      to={`/payment?service=${service._id}&amount=${service.price && !isNaN(Number(service.price)) ? Number(service.price) : ''}`}
                      className="block w-full"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full group relative bg-gradient-to-r from-[#0B1530] to-[#1a2b5c] text-white px-5 py-2.5 rounded-lg font-semibold text-xs hover:from-[#D4AF37] hover:to-[#F5D76E] hover:text-[#0B1530] transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-1.5">
                          Book Now
                          <FaArrowRight className="group-hover:translate-x-1 transition-transform" size={10} />
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      </motion.button>
                    </Link>
                  </div>
                </div>

                {/* Decorative Corner Element */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </div>

          {/* Empty State - Modern Design */}
          {filteredServices.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 md:py-24"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <FaSearch className="text-gray-400" size={32} />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No services found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Please check back later or adjust your filters.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Services;
