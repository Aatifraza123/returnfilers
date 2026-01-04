import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import ConsultationModal from '../components/common/ConsultationModal';
import { 
  FaCheck, 
  FaRupeeSign, 
  FaArrowRight, 
  FaArrowLeft,
  FaClock, 
  FaPhoneAlt
} from 'react-icons/fa';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchService();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchService = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/services/${id}`);
      setService(data.service || data);
    } catch (error) {
      toast.error('Service not found');
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size="lg" color="#D4AF37" />
      </div>
    );
  }

  if (!service) return null;

  return (
    <main className="font-sans text-gray-800 bg-white">
      <ConsultationModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} preSelectedService={service.title} />

      {/* Header */}
      <section className="bg-[#0B1530] pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-5xl">
          <Link to="/services" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] text-sm mb-6">
            <FaArrowLeft size={12} /> Back to Services
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="inline-block px-3 py-1 bg-[#D4AF37] text-[#0B1530] text-xs font-bold uppercase rounded mb-3">
                {service.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {service.title}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-400">Starting From</p>
                <div className="flex items-center gap-1 text-[#D4AF37]">
                  <FaRupeeSign size={16} />
                  <span className="text-2xl font-bold">
                    {service.price && !isNaN(Number(service.price)) 
                      ? Number(service.price).toLocaleString() 
                      : 'Quote'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-[#D4AF37] text-[#0B1530] font-semibold rounded-lg hover:bg-white transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Image */}
              {service.image && (
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-64 object-cover rounded-xl"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}

              {/* Description */}
              <div>
                <h2 className="text-lg font-bold text-[#0B1530] mb-3">About This Service</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {service.description}
                </p>
              </div>

              {/* Features */}
              {service.features && service.features.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-[#0B1530] mb-4">What's Included</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <FaCheck className="text-[#D4AF37] text-sm" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              
              {/* Quick Info */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-[#0B1530] mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FaClock className="text-[#D4AF37]" />
                    <div>
                      <p className="text-xs text-gray-500">Timeline</p>
                      <p className="font-medium text-sm">{service.timeline || '3-7 Days'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaRupeeSign className="text-[#D4AF37]" />
                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="font-medium text-sm">₹{service.price && !isNaN(Number(service.price)) ? Number(service.price).toLocaleString() : 'On Request'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-[#0B1530] p-5 rounded-xl text-center">
                <h3 className="font-bold text-white mb-2">Need Help?</h3>
                <p className="text-gray-400 text-sm mb-4">Talk to our expert</p>
                <a
                  href="tel:+918447127264"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#D4AF37] text-[#0B1530] font-semibold rounded-lg hover:bg-white transition-colors"
                >
                  <FaPhoneAlt size={12} />
                  +91 84471 27264
                </a>
              </div>

              {/* Book Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3 border-2 border-[#0B1530] text-[#0B1530] font-semibold rounded-lg hover:bg-[#0B1530] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                Book Consultation <FaArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServiceDetail;
