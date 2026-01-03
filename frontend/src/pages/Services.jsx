import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader'; 
import { FaCheck, FaSearch, FaArrowRight, FaRupeeSign, FaClock, FaEye } from 'react-icons/fa';
import ConsultationModal from '../components/common/ConsultationModal';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const openModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await api.get(`/services?t=${Date.now()}`);
      const serviceData = Array.isArray(data) ? data : (data.services || []);
      setServices(serviceData);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
      setServices([]); 
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(services.map(s => s.category?.toLowerCase()).filter(Boolean))];

  const filteredServices = filter === 'all' 
    ? services 
    : services.filter(s => s.category?.toLowerCase() === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size="lg" color="#D4AF37" />
      </div>
    );
  }

  return (
    <main className="font-sans text-gray-800 bg-white">
      
      <ConsultationModal isOpen={isModalOpen} closeModal={closeModal} preSelectedService={selectedService?.title} />
      
      {/* Hero Section */}
      <section className="bg-[#0B1530] py-16 md:py-20">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <span className="inline-block px-4 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-4">
            Our Services
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
            Professional Financial Solutions
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Expert tax, accounting, and business registration services for individuals and businesses
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center gap-2 py-4 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filter === cat
                    ? 'bg-[#0B1530] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {filteredServices.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => (
                <div
                  key={service._id || index}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#D4AF37]/30 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
                >
                  {/* Image */}
                  <Link to={`/services/${service._id}`} className="block relative h-56 overflow-hidden">
                    <img
                      src={service.image || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80"} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80"; }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Category Badge */}
                    <span className="absolute top-4 left-4 px-3 py-1.5 bg-white text-[#0B1530] text-[11px] font-bold uppercase tracking-wide rounded-lg shadow-md">
                      {service.category}
                    </span>

                    {/* View Button on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#0B1530] text-sm font-bold rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <FaEye size={14} /> View Details
                      </span>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <h3 className="text-xl font-bold text-white line-clamp-2 pr-4 drop-shadow-lg">
                        {service.title}
                      </h3>
                      <div className="flex-shrink-0 bg-[#D4AF37] text-[#0B1530] px-4 py-2 rounded-xl font-bold text-base shadow-lg flex items-center gap-1">
                        <FaRupeeSign size={12} />
                        {service.price && !isNaN(Number(service.price)) 
                          ? Number(service.price).toLocaleString() 
                          : 'Quote'}
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Description */}
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-5 flex-grow">
                      {service.description}
                    </p>

                    {/* Features */}
                    {service.features && service.features.length > 0 && (
                      <div className="space-y-2 mb-5 pb-5 border-b border-gray-100">
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                              <FaCheck size={9} className="text-[#D4AF37]" />
                            </div>
                            <span className="text-sm text-gray-600 line-clamp-1">{feature}</span>
                          </div>
                        ))}
                        {service.features.length > 3 && (
                          <p className="text-xs text-[#D4AF37] font-medium pl-7">
                            +{service.features.length - 3} more features
                          </p>
                        )}
                      </div>
                    )}

                    {/* Timeline Badge */}
                    <div className="flex items-center gap-2 mb-5 text-gray-400 text-xs">
                      <FaClock size={12} />
                      <span>Delivery: {service.timeline || '3-7 Working Days'}</span>
                    </div>

                    {/* Buttons */}
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      <Link
                        to={`/services/${service._id}`}
                        className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-[#0B1530] bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        Learn More
                      </Link>
                      <button
                        onClick={() => openModal(service)}
                        className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-[#0B1530] rounded-xl hover:bg-[#D4AF37] hover:text-[#0B1530] transition-all shadow-lg shadow-[#0B1530]/20"
                      >
                        Book Now <FaArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <FaSearch className="text-gray-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No services found</h3>
              <p className="text-gray-500 text-sm mb-5">Try selecting a different category</p>
              <button 
                onClick={() => setFilter('all')}
                className="text-[#D4AF37] font-semibold text-sm hover:underline"
              >
                View All Services
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0B1530]">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-gray-400 text-sm md:text-base mb-8">
            Get a personalized quote for your specific requirements
          </p>
          <button
            onClick={() => openModal({ title: 'Custom Service' })}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4AF37] text-[#0B1530] rounded-xl font-bold text-sm hover:bg-white transition-colors shadow-xl"
          >
            Get Custom Quote <FaArrowRight size={12} />
          </button>
        </div>
      </section>
    </main>
  );
};

export default Services;
