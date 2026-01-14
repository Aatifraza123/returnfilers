import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowLeft, FaPhone, FaEnvelope, FaClock, FaRupeeSign } from 'react-icons/fa';
import api from '../api/axios';
import Loader from '../components/common/Loader';
import UserAuthContext from '../context/UserAuthContext';
import AuthModal from '../components/common/AuthModal';

const PackageDetail = () => {
  const { slug, packageSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserAuthContext);
  const [service, setService] = useState(null);
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleBookNow = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    navigate(`/booking?service=${encodeURIComponent(service.title + ' - ' + packageData.name)}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/digital-services');
        const foundService = data.services.find(s => s.slug === slug && s.active);
        
        if (foundService && foundService.packages) {
          const foundPackage = foundService.packages.find(
            p => p.name.toLowerCase().replace(/\s+/g, '-') === packageSlug
          );
          
          if (foundPackage) {
            setService(foundService);
            setPackageData(foundPackage);
          } else {
            navigate('/digital-services');
          }
        } else {
          navigate('/digital-services');
        }
      } catch (error) {
        console.error('Failed to fetch package details', error);
        navigate('/digital-services');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, packageSlug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" text="Loading package details..." />
      </div>
    );
  }

  if (!packageData || !service) {
    return null;
  }

  return (
    <main className="font-sans bg-gray-50 min-h-screen">
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          navigate(`/booking?service=${encodeURIComponent(service.title + ' - ' + packageData.name)}`);
        }}
        message="Please login to book this package"
      />
      
      {/* Header */}
      <section className="bg-[#0B1530] text-white py-12 pt-20 md:pt-28">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link
            to="/digital-services"
            className="inline-flex items-center gap-2 text-[#C9A227] hover:text-white transition-colors mb-6"
          >
            <FaArrowLeft /> Back to Digital Services
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-[#C9A227] text-sm font-semibold mb-2">{service.title}</p>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">{packageData.name}</h1>
              <p className="text-gray-400 text-lg">Complete package details and features</p>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="flex items-baseline gap-2">
                <FaRupeeSign className="text-[#C9A227] text-2xl" />
                <span className="text-5xl font-bold text-[#C9A227]">{packageData.price}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <FaClock size={14} />
                <span className="text-sm">{packageData.timeline}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Features List */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-[#0B1530] mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-[#C9A227] rounded-lg flex items-center justify-center text-white">✓</span>
                  What's Included
                </h2>
                
                <ul className="space-y-4">
                  {packageData.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#C9A227]/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <FaCheckCircle className="text-[#C9A227] text-sm" />
                      </div>
                      <span className="text-gray-700 leading-relaxed">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-[#0B1530] to-[#1a2b5c] rounded-2xl shadow-lg p-8 text-white mt-8"
              >
                <h3 className="text-xl font-bold mb-4">Why Choose This Package?</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  This package is designed to provide you with a complete solution for your digital needs. 
                  Our expert team will work closely with you to ensure your vision becomes reality.
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-[#C9A227]" />
                    Professional development team
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-[#C9A227]" />
                    Regular progress updates
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-[#C9A227]" />
                    Post-launch support included
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-[#C9A227]" />
                    100% satisfaction guarantee
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* Sidebar - CTA */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-24"
              >
                <h3 className="text-xl font-bold text-[#0B1530] mb-4">Ready to Get Started?</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Book this package now and let's bring your project to life.
                </p>

                <button
                  onClick={handleBookNow}
                  className="block w-full py-3 rounded-lg font-semibold text-sm text-center transition-all shadow-lg hover:shadow-xl mb-4"
                  style={{
                    background: 'var(--color-primary)',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-secondary)';
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--color-primary)';
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  Book Now
                </button>

                <div className="border-t pt-6 space-y-4">
                  <h4 className="font-semibold text-[#0B1530] text-sm">Need More Information?</h4>
                  
                  <a
                    href="tel:+918447127264"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-[#0B1530] rounded-lg flex items-center justify-center text-[#C9A227] group-hover:bg-[#C9A227] group-hover:text-[#0B1530] transition-colors">
                      <FaPhone size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Call Us</p>
                      <p className="font-semibold text-[#0B1530]">+91 84471 27264</p>
                    </div>
                  </a>

                  <Link
                    to="/contact"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-[#0B1530] rounded-lg flex items-center justify-center text-[#C9A227] group-hover:bg-[#C9A227] group-hover:text-[#0B1530] transition-colors">
                      <FaEnvelope size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email Us</p>
                      <a 
                        href="mailto:info@returnfilers.in" 
                        className="font-semibold text-[#0B1530] hover:text-[#C9A227] transition-colors"
                      >
                        info@returnfilers.in
                      </a>
                    </div>
                  </Link>
                </div>

                <div className="mt-6 p-4 bg-[#C9A227]/10 rounded-lg border border-[#C9A227]/20">
                  <p className="text-xs text-gray-600 text-center mb-3">
                    <span className="font-semibold text-[#0B1530]">Free Consultation:</span> Discuss your requirements before booking
                  </p>
                  <Link
                    to="/booking?service=Free%20Consultation"
                    className="block text-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg"
                    style={{
                      background: 'var(--color-secondary)',
                      color: 'var(--color-primary)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--color-primary)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--color-secondary)';
                      e.currentTarget.style.color = 'var(--color-primary)';
                    }}
                  >
                    Book Consultation
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PackageDetail;
