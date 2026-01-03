import { useState, useEffect } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { FaTrash, FaPlus, FaEdit, FaChevronDown, FaChevronUp, FaRupeeSign, FaTag, FaImage, FaCheck, FaTimes, FaSearch, FaEye, FaClock } from 'react-icons/fa'

const AdminServices = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [expandedService, setExpandedService] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    timeline: '3-7 Working Days',
    icon: '',
    features: '',
    image: ''
  })

  // Predefined categories
  const predefinedCategories = ['Tax', 'Audit', 'Advisory', 'Compliance', 'Registration', 'Accounting', 'GST', 'Other']
  
  // Predefined timelines
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
  ]

  const getConfig = () => {
    const token = localStorage.getItem('token')
    return { headers: { Authorization: `Bearer ${token}` } }
  }

  useEffect(() => {
    fetchServices()
    const interval = setInterval(fetchServices, 15000)
    return () => clearInterval(interval)
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/services', getConfig())
      if (response.data.services && Array.isArray(response.data.services)) {
        setServices(response.data.services)
      } else if (Array.isArray(response.data)) {
        setServices(response.data)
      } else {
        setServices([])
      }
    } catch (error) {
      if (services.length === 0) {
        toast.error('Failed to fetch services')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const submitData = {
        ...formData,
        price: Number(formData.price),
        features: formData.features ? formData.features.split(',').map(f => f.trim()) : [],
        image: formData.image || '',
        timeline: formData.timeline || '3-7 Working Days'
      }

      if (editingService) {
        await api.put(`/services/${editingService._id}`, submitData, getConfig())
        toast.success('Service updated successfully!')
      } else {
        await api.post('/admin/services', submitData, getConfig())
        toast.success('Service created successfully!')
      }
      
      setShowForm(false)
      setEditingService(null)
      setFormData({ title: '', description: '', price: '', category: '', timeline: '3-7 Working Days', icon: '', features: '', image: '' })
      await fetchServices()
    } catch (error) {
      toast.error(editingService ? 'Failed to update service' : 'Failed to create service')
    }
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setFormData({
      title: service.title || '',
      description: service.description || '',
      price: service.price || '',
      category: service.category || '',
      timeline: service.timeline || '3-7 Working Days',
      icon: service.icon || '',
      features: service.features ? (Array.isArray(service.features) ? service.features.join(', ') : service.features) : '',
      image: service.image || ''
    })
    setShowForm(true)
    setExpandedService(null)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingService(null)
    setFormData({ title: '', description: '', price: '', category: '', timeline: '3-7 Working Days', icon: '', features: '', image: '' })
  }

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-medium">Delete this service?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id)
              try {
                await api.delete(`/admin/services/${id}`, getConfig())
                toast.success('Service deleted successfully')
                setServices(prev => prev.filter(service => service._id !== id))
              } catch (error) {
                toast.error('Failed to delete service')
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
    ), { duration: 10000 })
  }

  const toggleExpand = (id) => {
    setExpandedService(expandedService === id ? null : id)
  }

  // Get unique categories
  const categories = ['all', ...new Set(services.map(s => s.category?.toLowerCase()).filter(Boolean))]

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || service.category?.toLowerCase() === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0B1530]">Manage Services</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {filteredServices.length} of {services.length} services
          </p>
        </div>
        
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-[#0B1530] to-[#1a2b5c] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all text-sm font-semibold"
          >
            <FaPlus size={12} /> 
            Add Service
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      {!showForm && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4AF37] text-sm"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4AF37] text-sm bg-white min-w-[150px]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Service Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border-t-4 border-[#D4AF37]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#0B1530]">
              {editingService ? '✏️ Edit Service' : '➕ Add New Service'}
            </h2>
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 p-2">
              <FaTimes size={18} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Title *</label>
                <input 
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#D4AF37] text-sm" 
                  placeholder="e.g., Tax Consulting" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                <select 
                  className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#D4AF37] text-sm bg-white appearance-none cursor-pointer" 
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
              <textarea 
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#D4AF37] text-sm resize-none" 
                rows="3"
                placeholder="Describe the service..." 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) *</label>
                <div className="relative">
                  <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                  <input 
                    type="number"
                    className="w-full border border-gray-200 p-3 pl-8 rounded-xl focus:outline-none focus:border-[#D4AF37] text-sm" 
                    placeholder="5000" 
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Timeline *</label>
                <div className="relative">
                  <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                  <select 
                    className="w-full border border-gray-200 p-3 pl-8 rounded-xl focus:outline-none focus:border-[#D4AF37] text-sm bg-white appearance-none cursor-pointer" 
                    value={formData.timeline}
                    onChange={e => setFormData({...formData, timeline: e.target.value})}
                    required
                  >
                    {predefinedTimelines.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Icon</label>
                <div className="relative">
                  <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                  <input 
                    className="w-full border border-gray-200 p-3 pl-8 rounded-xl focus:outline-none focus:border-[#D4AF37] text-sm" 
                    placeholder="FaCode" 
                    value={formData.icon}
                    onChange={e => setFormData({...formData, icon: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
                <div className="relative">
                  <FaImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                  <input 
                    className="w-full border border-gray-200 p-3 pl-8 rounded-xl focus:outline-none focus:border-[#D4AF37] text-sm" 
                    placeholder="https://..." 
                    value={formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Features (comma separated)</label>
              <input 
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#D4AF37] text-sm" 
                placeholder="Feature 1, Feature 2, Feature 3" 
                value={formData.features}
                onChange={e => setFormData({...formData, features: e.target.value})}
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <button 
                type="submit" 
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all flex items-center gap-2"
              >
                <FaCheck size={12} />
                {editingService ? 'Update Service' : 'Create Service'}
              </button>
              <button 
                type="button"
                onClick={handleCancel}
                className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List - Accordion Style */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading services...</p>
          </div>
        ) : filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div 
              key={service._id} 
              className={`bg-white rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                expandedService === service._id 
                  ? 'border-[#D4AF37] shadow-lg' 
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              {/* Service Header - Always Visible */}
              <div 
                className="p-4 md:p-5 cursor-pointer"
                onClick={() => toggleExpand(service._id)}
              >
                <div className="flex items-center gap-4">
                  {/* Image Thumbnail */}
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {service.image ? (
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&h=100&fit=crop'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0B1530] to-[#1a2b5c] flex items-center justify-center text-white font-bold text-lg">
                        {service.title?.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  {/* Service Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-[#0B1530] text-base md:text-lg truncate">
                          {service.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 uppercase">
                            {service.category}
                          </span>
                          <span className="text-[#D4AF37] font-bold text-sm">
                            ₹{Number(service.price).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      {/* Expand Icon */}
                      <div className={`p-2 rounded-full transition-colors ${
                        expandedService === service._id ? 'bg-[#D4AF37] text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {expandedService === service._id ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Expanded Content */}
              {expandedService === service._id && (
                <div className="px-4 md:px-5 pb-5 border-t border-gray-100">
                  <div className="pt-4 space-y-4">
                    {/* Description */}
                    <div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    
                    {/* Timeline Badge */}
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
                        <FaClock size={10} />
                        {service.timeline || '3-7 Working Days'}
                      </span>
                    </div>
                    
                    {/* Features */}
                    {service.features && service.features.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Features</p>
                        <div className="flex flex-wrap gap-2">
                          {service.features.map((feature, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium flex items-center gap-1"
                            >
                              <FaCheck size={10} />
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEdit(service)
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors"
                      >
                        <FaEdit size={12} />
                        Edit
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(service._id)
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                      >
                        <FaTrash size={12} />
                        Delete
                      </button>
                      <a 
                        href="/services" 
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors ml-auto"
                      >
                        <FaEye size={12} />
                        View on Site
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No services found</h3>
            <p className="text-gray-500 text-sm">
              {searchTerm || filterCategory !== 'all' 
                ? 'Try adjusting your search or filter' 
                : 'Click "Add Service" to create your first service'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminServices
