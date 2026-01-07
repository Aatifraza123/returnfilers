import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaStar, FaToggleOn, FaToggleOff, FaTimes, FaCheck, FaQuoteLeft } from 'react-icons/fa';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [activeTab, setActiveTab] = useState('tax'); // 'tax' or 'webdev'
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    service: '',
    quote: '',
    rating: 5,
    image: '',
    isActive: true
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data } = await api.get('/testimonials/admin/all');
      if (data.success) {
        setTestimonials(data.data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTestimonial) {
        const { data } = await api.put(`/testimonials/admin/${editingTestimonial._id}`, formData);
        if (data.success) {
          toast.success('Testimonial updated successfully');
        }
      } else {
        const { data } = await api.post('/testimonials/admin', formData);
        if (data.success) {
          toast.success('Testimonial created successfully');
        }
      }
      resetForm();
      fetchTestimonials();
    } catch (error) {
      toast.error(editingTestimonial ? 'Failed to update testimonial' : 'Failed to create testimonial');
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      title: testimonial.title,
      service: testimonial.service || '',
      quote: testimonial.quote,
      rating: testimonial.rating,
      image: testimonial.image || '',
      isActive: testimonial.isActive
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-medium">Delete this testimonial?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const { data } = await api.delete(`/testimonials/admin/${id}`);
                if (data.success) {
                  toast.success('Testimonial deleted');
                  fetchTestimonials();
                }
              } catch (error) {
                toast.error('Failed to delete');
              }
            }}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await api.patch(`/testimonials/admin/${id}/toggle`);
      if (data.success) {
        toast.success(data.message);
        fetchTestimonials();
      }
    } catch (error) {
      toast.error('Failed to toggle status');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingTestimonial(null);
    setFormData({
      name: '',
      title: '',
      service: '',
      quote: '',
      rating: 5,
      image: '',
      isActive: true
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'} size={14} />
    ));
  };

  // Filter testimonials based on active tab
  const webDevServices = ['Web Development', 'E-commerce Website', 'Business Website', 'Custom Web Application'];
  const currentTestimonials = activeTab === 'tax'
    ? testimonials.filter(t => !webDevServices.includes(t.service))
    : testimonials.filter(t => webDevServices.includes(t.service));

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0B1530]">Testimonials</h1>
          <p className="text-gray-500 text-sm mt-1">Manage customer reviews and testimonials</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0B1530] to-[#1a2b5c] text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
          >
            <FaPlus size={12} />
            Add Testimonial
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6">
        <button
          onClick={() => setActiveTab('tax')}
          className={`px-6 py-3 font-semibold text-sm transition-colors relative ${
            activeTab === 'tax'
              ? 'text-[#C9A227] border-b-2 border-[#C9A227]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Tax Services
          <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
            {testimonials.filter(t => !['Web Development', 'E-commerce Website', 'Business Website', 'Custom Web Application'].includes(t.service)).length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('webdev')}
          className={`px-6 py-3 font-semibold text-sm transition-colors relative ${
            activeTab === 'webdev'
              ? 'text-[#C9A227] border-b-2 border-[#C9A227]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Web Development
          <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
            {testimonials.filter(t => ['Web Development', 'E-commerce Website', 'Business Website', 'Custom Web Application'].includes(t.service)).length}
          </span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border-t-4 border-[#C9A227]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#0B1530]">
              {editingTestimonial ? '✏️ Edit Testimonial' : '➕ Add Testimonial'}
            </h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 p-2">
              <FaTimes size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Customer name"
                  required
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title/Designation *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="CEO, Company Name"
                  required
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Service</label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm bg-white"
              >
                <option value="">General</option>
                <option value="Tax Consulting">Tax Consulting</option>
                <option value="Audit Services">Audit Services</option>
                <option value="Business Registration">Business Registration</option>
                <option value="Financial Advisory">Financial Advisory</option>
                <option value="Web Development">Web Development</option>
                <option value="E-commerce Website">E-commerce Website</option>
                <option value="Business Website">Business Website</option>
                <option value="Custom Web Application">Custom Web Application</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Review/Quote *</label>
              <textarea
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                placeholder="What did the customer say..."
                required
                rows="3"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm resize-none"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating</label>
                <div className="flex items-center gap-1 p-3 border border-gray-200 rounded-xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none"
                    >
                      <FaStar
                        size={20}
                        className={star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#C9A227] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`w-full p-3 rounded-xl flex items-center justify-center gap-2 font-medium text-sm ${
                    formData.isActive
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-gray-50 text-gray-500 border border-gray-200'
                  }`}
                >
                  {formData.isActive ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                  {formData.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
              >
                <FaCheck size={12} />
                {editingTestimonial ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-[#C9A227] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading testimonials...</p>
        </div>
      ) : currentTestimonials.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {currentTestimonials.map((testimonial) => (
            <div
              key={testimonial._id}
              className={`bg-white rounded-xl border-2 p-5 transition-all ${
                testimonial.isActive ? 'border-gray-100' : 'border-red-100 bg-red-50/30'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=0B1530&color=D4AF37`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0B1530] to-[#1a2b5c] flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name?.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-[#0B1530]">{testimonial.name}</h3>
                      <p className="text-gray-500 text-sm">{testimonial.title}</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>

                  <div className="mt-3 relative">
                    <FaQuoteLeft className="absolute -left-1 -top-1 text-[#C9A227]/20" size={20} />
                    <p className="text-gray-600 text-sm leading-relaxed pl-5 line-clamp-3">
                      {testimonial.quote}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleToggle(testimonial._id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        testimonial.isActive
                          ? 'bg-green-50 text-green-600 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {testimonial.isActive ? <FaToggleOn size={14} /> : <FaToggleOff size={14} />}
                      {testimonial.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors"
                    >
                      <FaEdit size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                    >
                      <FaTrash size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaQuoteLeft className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No testimonials yet</h3>
          <p className="text-gray-500 text-sm">Click "Add Testimonial" to create your first review</p>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
