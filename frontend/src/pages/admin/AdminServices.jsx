import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa'

const AdminServices = () => {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    icon: '',
    features: '',
    image: ''
  })

  // Auth Headers
  const getConfig = () => {
    const token = localStorage.getItem('token')
    return {
      headers: { Authorization: `Bearer ${token}` }
    }
  }

  useEffect(() => {
    fetchServices()
    // Refresh every 15 seconds for real-time updates
    const interval = setInterval(fetchServices, 15000)
    return () => clearInterval(interval)
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:5000/api/admin/services', getConfig())
      
      // Admin endpoint returns { services: [] }
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
      // Don't clear services on error
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
        image: formData.image || '' // ✅ Ensure image field is always included
      }

      console.log('Submitting service data:', submitData); // Debug log

      if (editingService) {
        const response = await axios.put(`http://localhost:5000/api/services/${editingService._id}`, submitData, getConfig())
        console.log('Service updated response:', response.data); // Debug log
        toast.success('Service updated successfully!')
      } else {
        await axios.post('http://localhost:5000/api/admin/services', submitData, getConfig())
        toast.success('Service created successfully!')
      }
      
      setShowForm(false)
      setEditingService(null)
      setFormData({ title: '', description: '', price: '', category: '', icon: '', features: '', image: '' })
      await fetchServices() // ✅ Wait for refresh
    } catch (error) {
      console.error('Error saving service:', error)
      console.error('Error response:', error.response?.data) // Debug log
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
      icon: service.icon || '',
      features: service.features ? (Array.isArray(service.features) ? service.features.join(', ') : service.features) : '',
      image: service.image || ''
    })
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingService(null)
    setFormData({ title: '', description: '', price: '', category: '', icon: '', features: '', image: '' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return

    try {
      await axios.delete(`http://localhost:5000/api/admin/services/${id}`, getConfig())
      toast.success('Service deleted successfully')
      setServices(prev => prev.filter(service => service._id !== id))
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete service')
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#0B1530]">Manage Services</h1>
          <p className="text-gray-500 mt-1">Total Services: {services.length}</p>
        </div>
        
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-[#0B1530] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#1a2b5c] transition-all shadow-lg"
          >
            <FaPlus className="text-sm" /> 
            <span>Add New Service</span>
          </button>
        )}
      </div>

      {/* Service Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#0B1530]">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h2>
            <button 
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input 
                className="w-full border p-3 rounded-lg" 
                placeholder="Service Title *" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
              <input 
                className="w-full border p-3 rounded-lg" 
                placeholder="Category *" 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                required
              />
            </div>
            <textarea 
              className="w-full border p-3 rounded-lg h-32" 
              placeholder="Description *" 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              required
            />
            <div className="grid md:grid-cols-3 gap-4">
              <input 
                type="number"
                className="w-full border p-3 rounded-lg" 
                placeholder="Price *" 
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                required
              />
              <input 
                className="w-full border p-3 rounded-lg" 
                placeholder="Icon (e.g., FaCode)" 
                value={formData.icon}
                onChange={e => setFormData({...formData, icon: e.target.value})}
              />
              <input 
                className="w-full border p-3 rounded-lg" 
                placeholder="Image URL" 
                value={formData.image}
                onChange={e => setFormData({...formData, image: e.target.value})}
              />
            </div>
            <input 
              className="w-full border p-3 rounded-lg" 
              placeholder="Features (comma separated)" 
              value={formData.features}
              onChange={e => setFormData({...formData, features: e.target.value})}
            />
            <div className="flex gap-3">
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                {editingService ? 'Update Service' : 'Create Service'}
              </button>
              <button 
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading services...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wider">
                <tr>
                  <th className="p-5 border-b">Title</th>
                  <th className="p-5 border-b">Category</th>
                  <th className="p-5 border-b">Price</th>
                  <th className="p-5 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {services.length > 0 ? (
                  services.map((service) => (
                    <tr key={service._id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-5 font-medium text-gray-900">{service.title}</td>
                      <td className="p-5">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 uppercase">
                          {service.category}
                        </span>
                      </td>
                      <td className="p-5 font-medium text-[#0B1530]">₹{Number(service.price).toLocaleString()}</td>
                      <td className="p-5">
                        <div className="flex justify-center gap-3">
                          <button 
                            onClick={() => handleEdit(service)}
                            className="p-2 text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100"
                            title="Edit Service"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => handleDelete(service._id)}
                            className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                            title="Delete Service"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-gray-500">
                      No services found. Check console log for details.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminServices



