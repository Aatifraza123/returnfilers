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
      <section className="relative min-h-[50vh] flex items-end">
        <div className="absolute inset-0">
          <img
            src={service.image || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80"}
            alt={service.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1530] via-[#0B1530]/70 to-[#0B1530]/30" />
        </div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10 pb-12">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link to="/services" className="inline-flex items-center gap-2 text-gray-300 hover:text-[#D4AF37] transition-colors text-sm">
              <FaArrowLeft size={12} />
              Back to Services
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="inline-block px-4 py-1.5 bg-[#D4AF37] text-[#0B1530] text-xs font-bold uppercase rounded-full mb-4">
                {service.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-3">
                {service.title}
              </h1>
              <p className="text-gray-300 max-w-2xl text-sm md:text-base">
                {service.description?.substring(0, 150)}...
              </p>
            </div>

            {/* Price Card */}
            <div className="bg-white p-6 rounded-2xl shadow-xl min-w-[200px]">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Starting From</p>
              <div className="flex items-center gap-1 text-[#0B1530] mb-3">
                <FaRupeeSign size={20} />
                <span className="text-3xl font-bold">
                  {service.price && !isNaN(Number(service.price)) 
                    ? Number(service.price).toLocaleString() 
                    : 'On Request'}
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-[#0B1530] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#D4AF37] hover:text-[#0B1530] transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* About Service */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-[#0B1530] mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center">
                    <FaFileAlt className="text-[#D4AF37]" />
                  </div>
                  About This Service
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {service.description}
                </p>
              </div>

              {/* Features */}
              {service.features && service.features.length > 0 && (
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-[#0B1530] mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center">
                      <FaCheck className="text-[#D4AF37]" />
                    </div>
                    What's Included
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-[#D4AF37]/10 transition-colors">
                        <div className="w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FaCheck size={10} className="text-white" />
                        </div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              <div className="bg-[#0B1530] p-6 md:p-8 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-6">Why Choose Us?</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center text-[#0B1530] flex-shrink-0">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm mb-1">{benefit.title}</h3>
                        <p className="text-gray-400 text-xs">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              
              {/* Quick Info */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-[#0B1530] mb-4">Quick Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <FaClock className="text-[#0B1530]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Timeline</p>
                      <p className="font-semibold text-[#0B1530] text-sm">{service.timeline || '3-7 Working Days'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <FaFileAlt className="text-[#0B1530]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Category</p>
                      <p className="font-semibold text-[#0B1530] text-sm capitalize">{service.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <FaShieldAlt className="text-[#0B1530]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Support</p>
                      <p className="font-semibold text-[#0B1530] text-sm">Dedicated Expert</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Card */}
              <div className="bg-gradient-to-br from-[#D4AF37] to-[#b8962e] p-6 rounded-2xl text-[#0B1530]">
                <h3 className="font-bold text-lg mb-2">Ready to Get Started?</h3>
                <p className="text-sm opacity-80 mb-4">Book a free consultation with our experts today.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-[#0B1530] text-white py-3 rounded-xl font-semibold text-sm hover:bg-white hover:text-[#0B1530] transition-colors flex items-center justify-center gap-2"
                >
                  Book Consultation
                  <FaArrowRight size={12} />
                </button>
              </div>

              {/* Contact Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-[#0B1530] mb-3">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">Call us directly for immediate assistance.</p>
                <a
                  href="tel:+918447127264"
                  className="w-full border-2 border-[#0B1530] text-[#0B1530] py-3 rounded-xl font-semibold text-sm hover:bg-[#0B1530] hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <FaPhoneAlt size={12} />
                  +91 84471 27264
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-2xl font-serif font-bold text-[#0B1530] mb-8">Related Services</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedServices.map((s) => (
                <Link
                  key={s._id}
                  to={`/services/${s._id}`}
                  className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all border border-gray-100"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={s.image || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80"}
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-semibold text-sm line-clamp-1">{s.title}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[#D4AF37]">
                        <FaRupeeSign size={10} />
                        <span className="font-semibold text-sm">
                          {s.price && !isNaN(Number(s.price)) ? Number(s.price).toLocaleString() : 'On Request'}
                        </span>
                      </div>
                      <span className="text-xs text-[#0B1530] font-medium group-hover:text-[#D4AF37] transition-colors flex items-center gap-1">
                        View <FaArrowRight size={10} />
                      </span>
                    </div>
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
