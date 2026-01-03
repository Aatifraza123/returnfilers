import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import api from '../api/axios'
import toast from 'react-hot-toast'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { FaUser, FaEnvelope, FaPhone, FaRupeeSign, FaCheckCircle, FaLock, FaArrowLeft } from 'react-icons/fa'

const Payment = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const serviceId = searchParams.get('service')
  const amountParam = searchParams.get('amount')
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(false)
  const [serviceLoading, setServiceLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm()

  // Auto-fill amount if provided in URL
  useEffect(() => {
    if (amountParam && !isNaN(Number(amountParam))) {
      setValue('amount', Number(amountParam))
    }
  }, [amountParam, setValue])

  useEffect(() => {
    console.log('Payment page mounted, serviceId:', serviceId)
    if (serviceId) {
      fetchService()
    } else {
      console.log('No serviceId in URL params')
    }
  }, [serviceId])

  // Load Razorpay script
  useEffect(() => {
    loadRazorpay()
  }, [])

  const fetchService = async () => {
    if (!serviceId) {
      console.log('No serviceId provided')
      return
    }
    
    // Validate service ID format
    if (serviceId.length !== 24) {
      console.error('Invalid service ID format:', serviceId)
      toast.error('Invalid service ID format')
      return
    }
    
    setServiceLoading(true)
    try {
      console.log('Fetching service with ID:', serviceId)
      const response = await api.get(`/services/${serviceId}`, {
        timeout: 10000 // 10 second timeout
      });
      console.log('Service response status:', response.status)
      console.log('Service data:', response.data)
      
      // Backend returns service directly, not wrapped
      const serviceData = response.data
      
      if (serviceData && serviceData._id && serviceData.title) {
        setService(serviceData)
        console.log('Service set successfully:', serviceData.title)
        
        // Auto-fill amount if service has price
        if (serviceData.price) {
          setValue('amount', serviceData.price)
          console.log('Amount set to:', serviceData.price)
        }
      } else {
        console.error('Invalid service data received:', serviceData)
        toast.error('Service data is invalid or incomplete')
      }
    } catch (error) {
      console.error('Error fetching service:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      console.error('Error URL:', error.config?.url)
      
      if (error.response?.status === 404) {
        toast.error(`Service not found. ID: ${serviceId.substring(0, 8)}...`)
      } else if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please try again.')
      } else {
        toast.error(error.response?.data?.message || 'Failed to load service details')
      }
    } finally {
      setServiceLoading(false)
    }
  }

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        setRazorpayLoaded(true)
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        setRazorpayLoaded(true)
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  const openRazorpay = async (formData) => {
    try {
      if (!razorpayLoaded && !window.Razorpay) {
        const loaded = await loadRazorpay()
        if (!loaded) {
          toast.error('Razorpay SDK failed to load. Please refresh the page.')
          return
        }
      }

      const amount = service?.price || formData.amount || amountParam
      if (!amount || amount <= 0) {
        toast.error('Please enter a valid amount')
        return
      }

      // Create order
      console.log('Creating payment order with:', { amount: Number(amount), serviceId: service?._id || serviceId, customerDetails: formData });
      const { data } = await api.post('/payments/create-order', {
        amount: Number(amount),
        serviceId: service?._id || serviceId,
        customerDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
      })

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_key', // Fallback for testing
        amount: data.amount, // Amount in paise
        currency: data.currency || 'INR',
        order_id: data.orderId,
        name: 'Tax Filer',
        description: service?.title || 'Service Payment',
        image: '/logo.png',
        handler: async (response) => {
          try {
            const verifyResponse = await api.post('/payments/verify', {
              razorpayOrderId: data.orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            
            toast.success('Payment successful! Check your email for confirmation.')
            
            // Redirect after successful payment
            setTimeout(() => {
              navigate('/')
            }, 2000)
          } catch (error) {
            console.error('Payment verification error:', error)
            toast.error(error.response?.data?.message || 'Payment verification failed')
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#0B1530',
        },
        modal: {
          ondismiss: () => {
            toast.info('Payment cancelled')
          },
        },
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    } catch (error) {
      console.error('Payment initiation error:', error)
      toast.error(error.response?.data?.message || 'Payment initiation failed')
    }
  }

  const onSubmit = async (formData) => {
    setLoading(true)
    await openRazorpay(formData)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Link 
          to="/services" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#0B1530] mb-6 transition-colors text-sm"
        >
          <FaArrowLeft /> Back to Services
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Service Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6"
            >
              <h2 className="text-lg font-bold text-[#0B1530] mb-4">Order Summary</h2>
              
              {/* Service Loading */}
              {serviceLoading && (
                <div className="flex items-center gap-3 py-8">
                  <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-600">Loading service...</p>
                </div>
              )}

              {/* Service Details - Simple & Clean */}
              {!serviceLoading && service && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Service</p>
                    <h3 className="text-base font-semibold text-[#0B1530] mb-1">{service.title}</h3>
                    {service.category && (
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                        {service.category}
                      </span>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Amount</span>
                      <span className="text-2xl font-bold text-[#0B1530]">
                        ₹{(service.price || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Amount Only - When no service but amount provided */}
              {!serviceLoading && !service && amountParam && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount</span>
                    <span className="text-2xl font-bold text-[#0B1530]">
                      ₹{Number(amountParam).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* No Service State */}
              {!serviceLoading && !service && !amountParam && (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-600 mb-2">No service selected</p>
                  <p className="text-xs text-gray-500">Select a service or enter amount</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Side - Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8"
            >
              <h1 className="text-2xl font-bold text-[#0B1530] mb-6">Payment Details</h1>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      {...register('name', { required: 'Name is required' })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="tel"
                      placeholder="9876543210"
                      {...register('phone', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message: 'Enter valid 10-digit mobile number',
                        },
                      })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>

                {/* Amount Field - Only show if service price not available */}
                {(!service || !service.price) && !amountParam && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Amount (₹)
                    </label>
                    <div className="relative">
                      <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        type="number"
                        placeholder="Enter amount"
                        {...register('amount', {
                          required: (!service || !service.price) && !amountParam ? 'Amount is required' : false,
                          min: { value: 1, message: 'Amount must be greater than 0' },
                        })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all ${
                          errors.amount ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.amount && (
                      <p className="mt-1 text-sm text-red-500">{errors.amount.message}</p>
                    )}
                  </div>
                )}

                {/* Display Amount if from URL param */}
                {amountParam && !service && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Amount
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-lg font-bold text-[#0B1530]">
                      ₹{Number(amountParam).toLocaleString()}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3.5 px-6 bg-[#0B1530] text-white rounded-lg font-semibold text-base hover:bg-[#1a2b5e] transition-all duration-300 flex items-center justify-center gap-2 ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaLock className="text-sm" />
                        Proceed to Payment
                      </>
                    )}
                  </button>
                </div>

                {/* Security Message */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <FaCheckCircle className="text-green-500 text-sm" />
                  <p className="text-xs text-gray-500 text-center">
                    Secure payment gateway
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
