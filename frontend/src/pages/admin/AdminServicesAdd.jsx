import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

const AdminServicesForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  
  const isEditMode = Boolean(id) && !location.pathname.includes('view')
  const isViewMode = Boolean(id) && location.pathname.includes('view')

  const [loading, setLoading] = useState(false)
  const [faqs, setFaqs] = useState([{ question: '', answer: '' }])
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  // Auth Config
  const getConfig = () => {
    const token = localStorage.getItem('token')
    return {
      headers: { Authorization: `Bearer ${token}` }
    }
  }

  // ✅ SMART FETCH LOGIC (Tries both URLs)
  useEffect(() => {
    if (id) {
      const fetchService = async () => {
        setLoading(true)
        try {
          let responseData = null;

          // 1. पहले Admin Route Try करें
          try {
            console.log("Attempting Admin Route...")
            const res = await api.get(`/admin/services/${id}`, getConfig())
            responseData = res.data
          } catch (adminError) {
            console.warn("Admin route failed (404), trying Public route...")
            
            // 2. अगर फेल हो, तो Public Route Try करें
            const res = await api.get(`/services/${id}`)
            responseData = res.data
          }

          console.log("✅ Service Data Received:", responseData) // Debugging के लिए

          // 3. डेटा को सही से निकालें (service, data, या direct object)
          const service = responseData.service || responseData.data || responseData

          if (!service) throw new Error("No service data found")

          // 4. Form Reset करें (Features Array को String में बदलें)
          const formattedFeatures = Array.isArray(service.features) 
            ? service.features.join('\n') 
            : (service.features || '')

          // Set FAQs if they exist
          if (service.faqs && service.faqs.length > 0) {
            setFaqs(service.faqs)
          }

          reset({
            title: service.title || '',
            description: service.description || '',
            price: service.price || '', // NaN हटाने के लिए empty string
            category: service.category || '',
            features: formattedFeatures
          })

        } catch (error) {
          console.error("❌ FINAL FETCH ERROR:", error)
          toast.error('Service not found. Check console.')
          // navigate('/admin/services') // Debugging के लिए इसे कमेंट कर सकते हैं
        } finally {
          setLoading(false)
        }
      }
      fetchService()
    }
  }, [id, navigate, reset])

  const onSubmit = async (data) => {
    if (isViewMode) return

    setLoading(true)
    try {
      // Features को वापस Array में बदलें
      const formattedData = {
        ...data,
        features: data.features.split('\n').map(f => f.trim()).filter(f => f !== ''),
        faqs: faqs.filter(faq => faq.question.trim() && faq.answer.trim())
      }

      if (isEditMode) {
        await api.put(`/admin/services/${id}`, formattedData, getConfig())
        toast.success('Service updated successfully')
      } else {
        await api.post('/admin/services', formattedData, getConfig())
        toast.success('Service created successfully')
      }
      
      navigate('/admin/services')
    } catch (error) {
      console.error(error)
      toast.error('Operation failed')
    } finally {
      setLoading(false)
    }
  }

  const getPageTitle = () => {
    if (isViewMode) return 'View Service Details'
    if (isEditMode) return 'Edit Service'
    return 'Add New Service'
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#0B1530]">
            {getPageTitle()}
          </h1>
          {isViewMode && (
            <Button 
              onClick={() => navigate(`/admin/services/edit/${id}`)}
              variant="outline"
            >
              Edit This Service
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={isViewMode ? 'pointer-events-none opacity-90' : ''}>
          {/* Title Input */}
          <Input
            label="Title"
            placeholder="Service title"
            {...register('title', { required: 'Title is required' })}
            error={errors.title?.message}
            disabled={isViewMode}
          />

          {/* Description Input */}
          <Input
            label="Description"
            type="textarea"
            placeholder="Service description"
            {...register('description', { required: 'Description is required' })}
            error={errors.description?.message}
            disabled={isViewMode}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price Input */}
            <Input
              label="Price (₹)"
              type="number"
              placeholder="15000"
              {...register('price', {
                required: 'Price is required',
                min: { value: 1, message: 'Minimum price is ₹1' },
              })}
              error={errors.price?.message}
              disabled={isViewMode}
            />

            {/* Category Input */}
            <Input
              label="Category"
              placeholder="tax, audit, advisory"
              {...register('category', { required: 'Category is required' })}
              error={errors.category?.message}
              disabled={isViewMode}
            />
          </div>

          {/* Features Textarea */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Features (one per line)
            </label>
            <textarea
              rows="5"
              disabled={isViewMode}
              placeholder="ITR Filing&#10;Tax Optimization&#10;GST Registration"
              {...register('features')}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1530] transition-colors ${
                isViewMode ? 'bg-gray-50 text-gray-600' : 'bg-white'
              }`}
            />
          </div>

          {/* FAQs Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-neutral-700">
                FAQs (Frequently Asked Questions)
              </label>
              {!isViewMode && (
                <button
                  type="button"
                  onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
                  className="px-3 py-1 bg-[#0B1530] text-white text-xs rounded hover:bg-blue-900 transition-colors"
                >
                  + Add FAQ
                </button>
              )}
            </div>
            
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">FAQ {index + 1}</span>
                    {!isViewMode && faqs.length > 1 && (
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
                      const newFaqs = [...faqs]
                      newFaqs[index].question = e.target.value
                      setFaqs(newFaqs)
                    }}
                    disabled={isViewMode}
                    className={`w-full px-3 py-2 border rounded-lg mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1530] ${
                      isViewMode ? 'bg-gray-100 text-gray-600' : 'bg-white'
                    }`}
                  />
                  <textarea
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => {
                      const newFaqs = [...faqs]
                      newFaqs[index].answer = e.target.value
                      setFaqs(newFaqs)
                    }}
                    disabled={isViewMode}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1530] resize-none ${
                      isViewMode ? 'bg-gray-100 text-gray-600' : 'bg-white'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          {!isViewMode && (
            <div className="flex gap-4 mt-6">
              <Button type="submit" disabled={loading} className="flex-1 bg-[#0B1530] text-white hover:bg-blue-900">
                {loading ? 'Processing...' : (isEditMode ? 'Update Service' : 'Create Service')}
              </Button>
              
              <button 
                type="button"
                onClick={() => navigate('/admin/services')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
          
          {isViewMode && (
             <div className="mt-6">
               <button 
                  type="button"
                  onClick={() => navigate('/admin/services')}
                  className="px-6 py-2 bg-gray-200 rounded-lg text-gray-800 hover:bg-gray-300 pointer-events-auto"
                >
                  Back to List
                </button>
             </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default AdminServicesForm



