import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [faqs, setFaqs] = useState([{ question: '', answer: '' }]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    timeline: '3-7 Working Days',
    icon: '',
    features: '',
    image: ''
  });

  const predefinedCategories = ['Tax', 'Audit', 'Advisory', 'Compliance', 'Registration', 'Accounting', 'GST', 'Other'];
  const predefinedTimelines = [
    'Same Day',
    '1-2 Working Days',
    '2-3 Working Days',
    '3-5 Working Days',
    '3-7 Working Days',
    '5-7 Working Days',
    '7-10 Working Days',
    '7-15 Working Days',
    '15-30 Working Days',
    'Ongoing/Monthly'
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.get('/admin/services', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(data.services || data || []);
    } catch (error) {
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const submitData = {
        ...formData,
        price: Number(formData.price),
        features: formData.features ? formData.features.split(',').map(f => f.trim()) : [],
        faqs: faqs.filter(faq => faq.question.trim() && faq.answer.trim())
      };

      if (editingService) {
        await api.put(`/services/${editingService._id}`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Service updated');
      } else {
        await api.post('/admin/services', submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Service created');
      }
      
      setShowForm(false);
      setEditingService(null);
      setFaqs([{ question: '', answer: '' }]);
      setFormData({ title: '', description: '', price: '', category: '', timeline: '3-7 Working Days', icon: '', features: '', image: '' });
      fetchServices();
    } catch (error) {
      toast.error('Failed to save service');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      description: service.description || '',
      price: service.price || '',
      category: service.category || '',
      timeline: service.timeline || '3-7 Working Days',
      icon: service.icon || '',
      features: service.features ? (Array.isArray(service.features) ? service.features.join(', ') : service.features) : '',
      image: service.image || ''
    });
    setFaqs(service.faqs && service.faqs.length > 0 ? service.faqs : [{ question: '', answer: '' }]);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
    setFaqs([{ question: '', answer: '' }]);
    setFormData({ title: '', description: '', price: '', category: '', timeline: '3-7 Working Days', icon: '', features: '', image: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/admin/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Service deleted');
      fetchServices();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Services</h1>
          <p className="text-gray-600">Manage all services</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <FaPlus size={14} />
            Add Service
          </button>
        )}
      </div>

      {/* Service Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h2>
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
              <FaTimes size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Title *</label>
                <input 
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-gray-900" 
                  placeholder="e.g., Tax Consulting" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select 
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-gray-900" 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  {predefinedCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea 
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-gray-900 resize-none" 
                rows="3"
                placeholder="Describe the service..." 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                <input 
                  type="number"
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-gray-900" 
                  placeholder="5000" 
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timeline *</label>
                <select 
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-gray-900" 
                  value={formData.timeline}
                  onChange={e => setFormData({...formData, timeline: e.target.value})}
                  required
                >
                  {predefinedTimelines.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <input 
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-gray-900" 
                  placeholder="FaCode" 
                  value={formData.icon}
                  onChange={e => setFormData({...formData, icon: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input 
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-gray-900" 
                placeholder="https://..." 
                value={formData.image}
                onChange={e => setFormData({...formData, image: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label>
              <input 
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-gray-900" 
                placeholder="Feature 1, Feature 2, Feature 3" 
                value={formData.features}
                onChange={e => setFormData({...formData, features: e.target.value})}
              />
            </div>

            {/* FAQs Section */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">FAQs (Frequently Asked Questions)</label>
                <button
                  type="button"
                  onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
                  className="px-3 py-1 bg-gray-900 text-white text-xs rounded hover:bg-gray-800 transition-colors"
                >
                  + Add FAQ
                </button>
              </div>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">FAQ {index + 1}</span>
                      {faqs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Question"
                      value={faq.question}
                      onChange={(e) => {
                        const newFaqs = [...faqs];
                        newFaqs[index].question = e.target.value;
                        setFaqs(newFaqs);
                      }}
                      className="w-full border border-gray-300 p-2 rounded-lg mb-2 text-sm focus:outline-none focus:border-gray-900"
                    />
                    <textarea
                      placeholder="Answer"
                      value={faq.answer}
                      onChange={(e) => {
                        const newFaqs = [...faqs];
                        newFaqs[index].answer = e.target.value;
                        setFaqs(newFaqs);
                      }}
                      rows="2"
                      className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:outline-none focus:border-gray-900 resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                type="submit" 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {editingService ? 'Update Service' : 'Create Service'}
              </button>
              <button 
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.length > 0 ? (
          services.map((service) => (
            <div key={service._id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              {service.image && (
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-900">{service.title}</h3>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                  {service.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-gray-900">₹{Number(service.price).toLocaleString()}</span>
                <span className="text-xs text-gray-500">{service.timeline}</span>
              </div>
              {service.features && service.features.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">
                        {feature}
                      </span>
                    ))}
                    {service.features.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded text-xs">
                        +{service.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(service)}
                  className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                >
                  <FaEdit size={12} />
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(service._id)}
                  className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <FaTrash size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No services found</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Add First Service
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServices;
