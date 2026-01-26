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
  const [imagePreview, setImagePreview] = useState('')
  const [imageUploadType, setImageUploadType] = useState('url') // 'url' or 'upload'
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

          // Set image preview if exists
          if (service.image) {
            setImagePreview(service.image)
            setValue('image', service.image)
          }

          reset({
            title: service.title || '',
            description: service.description || '',
            price: service.price || '', // NaN हटाने के लिए empty string
            category: service.category || '',
            features: formattedFeatures,
            image: service.image || ''
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
        faqs: faqs.filter(faq => faq.question.trim() && faq.answer.trim()),
        image: imagePreview || data.image || '' // Use preview or URL
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

  // Handle image file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Convert to base64
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
      setValue('image', reader.result)
    }
    reader.readAsDataURL(file)
  }

  // Handle image URL input
  const handleImageUrl = (e) => {
    const url = e.target.value
    setImagePreview(url)
    setValue('image', url)
  }

  // Remove image
  const removeImage = () => {
    setImagePreview('')
    setValue('image', '')
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
          <h1 className="text-3xl font-serif font-bold text-primary">
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
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                isViewMode ? 'bg-gray-50 text-gray-600' : 'bg-white'
              }`}
            />
          </div>

          {/* Image Upload Section */}
          {!isViewMode && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Service Image
              </label>
              
              {/* Toggle between URL and Upload */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setImageUploadType('url')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    imageUploadType === 'url'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Image URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageUploadType('upload')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    imageUploadType === 'upload'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Upload Image
                </button>
              </div>

              {/* URL Input */}
              {imageUploadType === 'url' && (
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  onChange={handleImageUrl}
                  defaultValue={imagePreview}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )}

              {/* File Upload */}
              {imageUploadType === 'upload' && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 5MB
                    </span>
                  </label>
                </div>
              )}

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* View Mode Image Display */}
          {isViewMode && imagePreview && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Service Image
              </label>
              <img
                src={imagePreview}
                alt="Service"
                className="w-full h-48 object-cover rounded-lg border"
              />
            </div>
          )}

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
                  className="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-blue-900 transition-colors"
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
                    className={`w-full px-3 py-2 border rounded-lg mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
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
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
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
              <Button type="submit" disabled={loading} className="flex-1 bg-primary text-white hover:bg-blue-900">
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



