import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCode, FaChartBar, FaCheckCircle, FaPhone, FaWhatsapp } from 'react-icons/fa';
import api from '../api/axios';

const DigitalServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/digital-services');
        setServices(data.services.filter(s => s.active) || []);
      } catch (error) {
        console.log('Failed to fetch digital services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const getIcon = (iconName) => {
    return iconName === 'FaCode' ? <FaCode /> : <FaChartBar />;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="font-sans bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-[#0B1530] via-[#1a2b5c] to-[#0B1530] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#C9A227] font-semibold tracking-widest uppercase text-sm mb-3 block"
          >
            Digital Solutions
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4"
          >
            Digital <span className="text-[#C9A227]">Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-lg max-w-2xl mx-auto"
          >
            Grow your business with our professional web development and data analysis services
          </motion.p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {services.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No digital services available at the moment.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, idx) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#0B1530] to-[#1a2b5c] p-6 text-white">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-[#C9A227]/20 rounded-xl flex items-center justify-center text-[#C9A227] text-2xl">
                        {getIcon(service.icon)}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{service.title}</h2>
                        <p className="text-gray-300 text-sm">{service.timeline}</p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-[#C9A227]">₹{service.price}</span>
                      <span className="text-gray-400 text-sm">onwards</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    
                    <h3 className="text-sm font-bold text-[#0B1530] mb-4 uppercase tracking-wide">What's Included</h3>
                    <ul className="space-y-3 mb-6">
                      {service.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3">
                          <FaCheckCircle className="text-[#C9A227] mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="flex gap-3">
                      <Link
                        to={`/booking?service=${encodeURIComponent(service.title)}`}
                        className="flex-1 bg-[#0B1530] text-white py-3 rounded-lg font-semibold text-center hover:bg-[#C9A227] hover:text-[#0B1530] transition-colors"
                      >
                        Book Now
                      </Link>
                      <a
                        href="https://wa.me/918447127264"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-[#25D366] text-white rounded-lg flex items-center justify-center hover:bg-[#128C7E] transition-colors"
                      >
                        <FaWhatsapp size={20} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0B1530] mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-gray-600 mb-6">
            Contact us for custom requirements and get a personalized quote
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-6 py-3 bg-[#C9A227] text-[#0B1530] rounded-lg font-semibold hover:bg-[#0B1530] hover:text-white transition-colors"
            >
              Contact Us
            </Link>
            <a
              href="tel:+918447127264"
              className="px-6 py-3 border-2 border-[#0B1530] text-[#0B1530] rounded-lg font-semibold hover:bg-[#0B1530] hover:text-white transition-colors flex items-center gap-2"
            >
              <FaPhone size={14} /> +91 84471 27264
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DigitalServices;
