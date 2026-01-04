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
  FaPhoneAlt, 
  FaFileAlt,
  FaShieldAlt,
  FaHeadset,
  FaChartLine
} from 'react-icons/fa';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
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
      const serviceData = data.service || data;
      setService(serviceData);

      // Fetch related services from same category
      const allServices = await api.get('/services');
      const servicesArray = Array.isArray(allServices.data) ? allServices.data : (allServices.data.services || []);
      const related = servicesArray
        .filter(s => s.category === serviceData.category && s._id !== id)
        .slice(0, 3);
      setRelatedServices(related);
    } catch (error) {
      console.error('Error fetching service:', error);
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

  const benefits = [
    { icon: <FaShieldAlt />, title: '100% Compliance', desc: 'Fully compliant with latest regulations' },
    { icon: <FaHeadset />, title: 'Dedicated Support', desc: 'Expert assistance throughout the process' },
    { icon: <FaClock />, title: 'Timely Delivery', desc: 'On-time completion guaranteed' },
    { icon: <FaChartLine />, title: 'Best Practices', desc: 'Industry-standard methodologies' },
  ];

  return (
    <main className="font-sans text-gray-800 bg-gray-50">
      <ConsultationModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} preSelectedService={service.title} />

      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-end">
        <div className="absolute inset-0">
          <img
            src={service.image || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80"}
            alt={service.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1530] via-[#0B1530]/80 to-[#0B1530]/40" />
        </div>

        <div className="container mx-auto px-6 max-w-5xl relative z-10 pb-10">
          {/* Breadcrumb */}
          <Link to="/services" className="inline-flex items-center gap-2 text-gray-300 hover:text-[#D4AF37] text-sm mb-4">
            <FaArrowLeft size={10} /> Back to Services
          </Link>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <span className="inline-block px-3 py-1 bg-[#D4AF37] text-[#0B1530] text-[10px] font-bold uppercase rounded mb-3">
                {service.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {service.title}
              </h1>
            </div>

            {/* Price Card */}
            <div className="bg-white px-5 py-4 rounded-xl shadow-lg flex items-center gap-4">
              <div>
                <p className="text-[10px] text-gray-500 uppercase">Starting From</p>
                <div className="flex items-center gap-0.5 text-[#0B1530]">
                  <FaRupeeSign size={14} />
                  <span className="text-xl font-bold">
                    {service.price && !isNaN(Number(service.price)) 
                      ? Number(service.price).toLocaleString() 
                      : 'Quote'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 bg-[#0B1530] text-white rounded-lg font-semibold text-sm hover:bg-[#D4AF37] hover:text-[#0B1530] transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* About Service */}
              <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-100">
                <h2 className="text-base font-bold text-[#0B1530] mb-3 flex items-center gap-2">
                  <FaFileAlt className="text-[#D4AF37]" size={14} />
                  About This Service
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {service.description}
                </p>
              </div>

              {/* Features */}
              {service.features && service.features.length > 0 && (
                <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-100">
                  <h2 className="text-base font-bold text-[#0B1530] mb-4 flex items-center gap-2">
                    <FaCheck className="text-[#D4AF37]" size={14} />
                    What's Included
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                        <FaCheck className="text-[#D4AF37] text-xs" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              <div className="bg-[#0B1530] p-5 md:p-6 rounded-xl">
                <h2 className="text-base font-bold text-white mb-4">Why Choose Us?</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="w-8 h-8 bg-[#D4AF37] rounded-lg flex items-center justify-center text-[#0B1530] flex-shrink-0">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm">{benefit.title}</h3>
                        <p className="text-gray-400 text-xs">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4">
              
              {/* Quick Info */}
              <div className="bg-white p-5 rounded-xl border border-gray-100">
                <h3 className="font-bold text-[#0B1530] text-sm mb-3">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <FaClock className="text-[#D4AF37]" size={14} />
                    <div>
                      <p className="text-[10px] text-gray-500">Timeline</p>
                      <p className="font-semibold text-[#0B1530] text-sm">{service.timeline || '3-7 Days'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <FaFileAlt className="text-[#D4AF37]" size={14} />
                    <div>
                      <p className="text-[10px] text-gray-500">Category</p>
                      <p className="font-semibold text-[#0B1530] text-sm capitalize">{service.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaShieldAlt className="text-[#D4AF37]" size={14} />
                    <div>
                      <p className="text-[10px] text-gray-500">Support</p>
                      <p className="font-semibold text-[#0B1530] text-sm">Dedicated Expert</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Card */}
              <div className="bg-[#D4AF37] p-5 rounded-xl">
                <h3 className="font-bold text-[#0B1530] mb-1">Ready to Start?</h3>
                <p className="text-sm text-[#0B1530]/70 mb-3">Book a free consultation</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-[#0B1530] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-white hover:text-[#0B1530] transition-colors"
                >
                  Book Now
                </button>
              </div>

              {/* Contact Card */}
              <div className="bg-white p-5 rounded-xl border border-gray-100">
                <h3 className="font-bold text-[#0B1530] text-sm mb-2">Need Help?</h3>
                <p className="text-xs text-gray-600 mb-3">Call us for immediate assistance</p>
                <a
                  href="tel:+918447127264"
                  className="w-full border border-[#0B1530] text-[#0B1530] py-2.5 rounded-lg font-semibold text-sm hover:bg-[#0B1530] hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <FaPhoneAlt size={10} />
                  +91 84471 27264
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-10 bg-white border-t border-gray-100">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-lg font-bold text-[#0B1530] mb-5">Related Services</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedServices.map((s) => (
                <Link
                  key={s._id}
                  to={`/services/${s._id}`}
                  className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-all border border-gray-100"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={s.image || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80"}
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <h3 className="absolute bottom-2 left-3 right-3 text-white font-semibold text-sm line-clamp-1">{s.title}</h3>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-[#D4AF37] font-semibold text-sm">
                      ₹{s.price && !isNaN(Number(s.price)) ? Number(s.price).toLocaleString() : 'Quote'}
                    </span>
                    <span className="text-xs text-gray-500 group-hover:text-[#D4AF37]">View →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default ServiceDetail;
