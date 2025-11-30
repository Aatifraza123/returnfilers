import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FaTrash, FaEdit, FaPlus, FaTimes } from 'react-icons/fa'
import Loader from '../../components/common/Loader'

const AdminPortfolio = () => {
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    description: '',
    outcome: '',
    images: ''
  })

  // Auth Headers
  const getConfig = () => {
    const token = localStorage.getItem('token')
    return {
      headers: { Authorization: `Bearer ${token}` }
    }
  }

  useEffect(() => {
    fetchPortfolio()
    // Refresh every 15 seconds for real-time updates
    const interval = setInterval(fetchPortfolio, 15000)
    return () => clearInterval(interval)
  }, [])

  const fetchPortfolio = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.get('http://localhost:5000/api/portfolio', config)
      const data = response.data
      setPortfolio(Array.isArray(data) ? data : (data.portfolio || []))
    } catch (error) {
      if (portfolio.length === 0) {
        toast.error('Failed to fetch portfolio items')
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
        images: formData.images ? formData.images.split(',').map(img => img.trim()) : []
      }

      if (editingItem) {
        await axios.put(`http://localhost:5000/api/portfolio/${editingItem._id}`, submitData, getConfig())
        toast.success('Portfolio item updated!')
      } else {
        await axios.post('http://localhost:5000/api/portfolio', submitData, getConfig())
        toast.success('Portfolio item created!')
      }
      
      setShowForm(false)
      setEditingItem(null)
      setFormData({ title: '', client: '', description: '', outcome: '', images: '' })
      fetchPortfolio()
    } catch (error) {
      toast.error(editingItem ? 'Failed to update portfolio item' : 'Failed to create portfolio item')
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      title: item.title || '',
      client: item.client || '',
      description: item.description || '',
      outcome: item.outcome || '',
      images: item.images ? item.images.join(', ') : ''
    })
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingItem(null)
    setFormData({ title: '', client: '', description: '', outcome: '', images: '' })
  }

  const deleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this portfolio item?')) return

    try {
      await axios.delete(`http://localhost:5000/api/portfolio/${id}`, getConfig())
      toast.success('Portfolio item deleted successfully')
      fetchPortfolio()
    } catch (error) {
      toast.error('Failed to delete portfolio item')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1530]">Manage Portfolio</h1>
          <p className="text-gray-500 mt-1">Total Items: {portfolio.length}</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-[#0B1530] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#1a2b5c] transition-all shadow-lg"
          >
            <FaPlus /> Add Portfolio Item
          </button>
        )}
      </div>

      {/* Portfolio Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#0B1530]">
              {editingItem ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
            </h2>
            <button 
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input 
                className="w-full border p-3 rounded-lg" 
                placeholder="Title *" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
              <input 
                className="w-full border p-3 rounded-lg" 
                placeholder="Client *" 
                value={formData.client}
                onChange={e => setFormData({...formData, client: e.target.value})}
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
            <textarea 
              className="w-full border p-3 rounded-lg h-24" 
              placeholder="Outcome (Optional)" 
              value={formData.outcome}
              onChange={e => setFormData({...formData, outcome: e.target.value})}
            />
            <input 
              className="w-full border p-3 rounded-lg" 
              placeholder="Image URLs (comma separated, optional)" 
              value={formData.images}
              onChange={e => setFormData({...formData, images: e.target.value})}
            />
            <div className="flex gap-3">
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                {editingItem ? 'Update Item' : 'Create Item'}
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

      {/* Portfolio List */}
      <div className="grid md:grid-cols-2 gap-6">
        {portfolio.map((item) => (
          <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#0B1530] mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-2"><span className="font-semibold">Client:</span> {item.client}</p>
              <p className="text-gray-600 mb-2 line-clamp-2">{item.description}</p>
              {item.outcome && (
                <p className="text-gray-500 text-sm mb-4"><span className="font-semibold">Outcome:</span> {item.outcome}</p>
              )}
              {item.images && item.images.length > 0 && (
                <p className="text-gray-500 text-xs mb-4">{item.images.length} image(s)</p>
              )}
              <div className="flex justify-end gap-3 border-t pt-4">
                <button 
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <FaEdit /> Edit
                </button>
                <button 
                  onClick={() => deleteItem(item._id)}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {portfolio.length === 0 && !loading && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl mb-2">No portfolio items found</p>
          <p className="text-sm">Click "Add Portfolio Item" to get started</p>
        </div>
      )}
    </div>
  )
}

export default AdminPortfolio
