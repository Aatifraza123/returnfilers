import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader'; 
import { FaCheck, FaSearch, FaArrowRight, FaRupeeSign, FaClock } from 'react-icons/fa';

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const handleBookNow = (service) => {
    navigate(`/booking?service=${encodeURIComponent(service.title)}`);
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
        <Loader size="lg" color="#C9A227" />
      </div>
    );
  }

  return (
    <main className="font-sans text-gray-800 bg-white">
      
      {/* Hero Section */}
      <section className="bg-[#0B1530] py-16 md:py-20">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <span className="inline-block px-4 py-1 rounded-full bg-[#C9A227]/10 text-[#C9A227] text-xs font-semibold uppercase tracking-wider mb-4">
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
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredServices.map((service, index) => (
                <div
                  key={service._id || index}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-[#C9A227]/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Image */}
                  <Link to={`/services/${service._id}`} className="block relative h-48 overflow-hidden">
                    <img
                      src={service.image || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80"} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80"; }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Category Badge */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 text-[#0B1530] text-[10px] font-bold uppercase tracking-wide rounded-md">
                      {service.category}
                    </span>

                    {/* Title on Image */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-lg font-bold text-white line-clamp-2 drop-shadow-lg">
                        {service.title}
                      </h3>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    {/* Price & Timeline Row */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-1 text-[#C9A227]">
                        <FaRupeeSign size={14} />
                        <span className="text-xl font-bold">
                          {service.price && !isNaN(Number(service.price)) 
                            ? Number(service.price).toLocaleString() 
                            : 'Quote'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                        <FaClock size={10} />
                        <span>{service.timeline || '3-7 Days'}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-grow">
                      {service.description}
                    </p>

                    {/* Features */}
                    {service.features && service.features.length > 0 && (
                      <div className="space-y-1.5 mb-4">
                        {service.features.slice(0, 2).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <FaCheck size={8} className="text-[#C9A227]" />
                            <span className="text-xs text-gray-600 line-clamp-1">{feature}</span>
                          </div>
                        ))}
                        {service.features.length > 2 && (
                          <p className="text-[10px] text-[#C9A227] font-medium">
                            +{service.features.length - 2} more
                          </p>
                        )}
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <Link
                        to={`/services/${service._id}`}
                        className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-[#0B1530] bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleBookNow(service)}
                        className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-white bg-[#0B1530] rounded-lg hover:bg-[#C9A227] hover:text-[#0B1530] transition-all"
                      >
                        Book Now <FaArrowRight size={9} />
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
                className="text-[#C9A227] font-semibold text-sm hover:underline"
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
          <Link
            to="/booking?service=Custom%20Service"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A227] text-[#0B1530] rounded-xl font-bold text-sm hover:bg-white transition-colors shadow-xl"
          >
            Get Custom Quote <FaArrowRight size={12} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Services;
