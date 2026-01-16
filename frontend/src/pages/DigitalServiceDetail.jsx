import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowLeft, FaPhone, FaEnvelope, FaClock, FaRupeeSign, FaCode } from 'react-icons/fa';
import api from '../api/axios';
import Loader from '../components/common/Loader';
import UserAuthContext from '../context/UserAuthContext';
import AuthModal from '../components/common/AuthModal';
import ConsultationModal from '../components/common/ConsultationModal';

const DigitalServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserAuthContext);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  const handleBookNow = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    navigate(`/booking?service=${encodeURIComponent(service.title)}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/digital-services');
        const foundService = data.services.find(s => s.slug === slug && s.active);
        
        if (foundService) {
          setService(foundService);
        } else {
          navigate('/digital-services');
        }
      } catch (error) {
        console.error('Failed to fetch service details', error);
        navigate('/digital-services');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" text="Loading service details..." />
      </div>
    );
  }

  if (!service) {
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
          navigate(`/booking?service=${encodeURIComponent(service.title)}`);
        }}
        message="Please login to book this service"
      />
      
      {/* Header */}
      <section className="bg-primary text-white py-12 pt-20 md:pt-28">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link
            to="/digital-services"
            className="inline-flex items-center gap-2 text-secondary hover:text-white transition-colors mb-6"
          >
            <FaArrowLeft /> Back to Digital Services
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">{service.title}</h1>
              <p className="text-gray-400 text-lg max-w-2xl">{service.description}</p>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="flex items-baseline gap-2">
                <FaRupeeSign className="text-secondary text-2xl" />
                <span className="text-5xl font-bold text-secondary">{service.price}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <FaClock size={14} />
                <span className="text-sm">{service.timeline}</span>
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
                <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-white">✓</span>
                  What's Included
                </h2>
                
                <ul className="space-y-4">
                  {service.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <FaCheckCircle className="text-secondary text-sm" />
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
                className="bg-gradient-to-br from-primary to-primary rounded-2xl shadow-lg p-8 text-white mt-8"
              >
                <h3 className="text-xl font-bold mb-4">Why Choose This Service?</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  This service is designed to provide you with a complete solution for your digital needs. 
                  Our expert team will work closely with you to ensure your vision becomes reality.
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-secondary" />
                    Professional development team
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-secondary" />
                    Regular progress updates
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-secondary" />
                    Post-launch support included
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-secondary" />
                    100% satisfaction guarantee
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-secondary" />
                    Money-back guarantee if not satisfied
                  </li>
                </ul>
              </motion.div>

              {/* Process Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mt-8"
              >
                <h3 className="text-xl font-bold text-primary mb-6">Our Process</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Consultation</h4>
                      <p className="text-gray-600 text-sm">We discuss your requirements and goals</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Planning</h4>
                      <p className="text-gray-600 text-sm">Create detailed project plan and timeline</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Development</h4>
                      <p className="text-gray-600 text-sm">Build your project with regular updates</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold flex-shrink-0">4</div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Launch & Support</h4>
                      <p className="text-gray-600 text-sm">Deploy and provide ongoing support</p>
                    </div>
                  </div>
                </div>
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
                <h3 className="text-xl font-bold text-primary mb-4">Ready to Get Started?</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Book this service now and let's bring your project to life.
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
                  <h4 className="font-semibold text-primary text-sm">Need More Information?</h4>
                  
                  <a
                    href="tel:+918447127264"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-colors">
                      <FaPhone size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Call Us</p>
                      <p className="font-semibold text-primary">+91 84471 27264</p>
                    </div>
                  </a>

                  <Link
                    to="/contact"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-colors">
                      <FaEnvelope size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email Us</p>
                      <p className="font-semibold text-primary">info@returnfilers.in</p>
                    </div>
                  </Link>
                </div>

                <div className="mt-6 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                  <p className="text-xs text-gray-600 text-center mb-3">
                    <span className="font-semibold text-primary">Free Consultation:</span> Discuss your requirements before booking
                  </p>
                  <button
                    onClick={() => setShowConsultationModal(true)}
                    className="block w-full text-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg"
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
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <ConsultationModal 
        isOpen={showConsultationModal}
        onClose={() => setShowConsultationModal(false)}
        serviceName={service?.title}
      />
    </main>
  );
};

export default DigitalServiceDetail;
