import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaFileAlt, FaTimes, FaCheckCircle, FaSpinner, FaShieldAlt, FaLock, FaCalendarCheck } from 'react-icons/fa';
import api from '../api/axios';
import toast from 'react-hot-toast';

const defaultServices = [
  'GST Registration',
  'GST Return Filing',
  'Income Tax Return',
  'TDS Return Filing',
  'Company Registration',
  'LLP Registration',
  'Partnership Firm',
  'Trademark Registration',
  'MSME Registration',
  'Import Export Code',
  'Tax Audit',
  'Bookkeeping',
  'Web Development',
  'Data Analysis',
  'Other'
];

// Services that don't require document upload
const noDocumentServices = ['Web Development', 'Data Analysis'];

const Booking = () => {
  const [searchParams] = useSearchParams();
  const preSelectedService = searchParams.get('service') || '';
  
  // Add preSelectedService to list if not already present
  const services = preSelectedService && !defaultServices.includes(preSelectedService)
    ? [preSelectedService, ...defaultServices]
    : defaultServices;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: preSelectedService,
    message: ''
  });
  
  // Check if current service requires documents
  const requiresDocuments = !noDocumentServices.includes(formData.service);
  
  // Update service when URL param changes
  useEffect(() => {
    if (preSelectedService) {
      setFormData(prev => ({ ...prev, service: preSelectedService }));
    }
  }, [preSelectedService]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [consent, setConsent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: digitsOnly });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024;
    
    const validFiles = selectedFiles.filter(file => {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max 5MB.`);
        return false;
      }
      return true;
    });

    if (files.length + validFiles.length > 10) {
      toast.error('Maximum 10 files allowed');
      return;
    }
    setFiles([...files, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.service) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    // Consent required only if documents are uploaded
    if (files.length > 0 && !consent) {
      toast.error('Please accept the terms to upload documents');
      return;
    }

    setLoading(true);

    try {
      // Prepare booking data
      const bookingData = { ...formData };
      
      // If documents uploaded, convert to base64
      if (files.length > 0) {
        const documentsData = await Promise.all(
          files.map(async (file) => ({
            name: file.name,
            type: file.type,
            size: file.size,
            data: await convertToBase64(file)
          }))
        );
        bookingData.documents = documentsData;
      }

      // Always use bookings API
      await api.post('/bookings', bookingData);

      setSubmitted(true);
      toast.success('Booking submitted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-4xl text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#0B1530] mb-3">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            We'll review your request and contact you within 24 hours.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            For urgent queries, call <strong>+91 84471 27264</strong>
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: '', email: '', phone: '', service: '', message: '' });
              setFiles([]);
              setConsent(false);
            }}
            className="px-6 py-3 bg-[#0B1530] text-white rounded-lg font-semibold hover:bg-[#C9A227] hover:text-[#0B1530] transition-colors"
          >
            Book Another Service
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0B1530] pt-28 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Book a Service</h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Fill in your details to book our professional services. You can also upload documents if ready.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="container mx-auto px-4 -mt-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg max-w-2xl mx-auto overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-5 md:p-6">
            {/* Personal Details */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-[#0B1530] mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A227] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0B1530] mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A227] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0B1530] mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  maxLength={10}
                  pattern="[6-9][0-9]{9}"
                  title="Enter valid 10-digit mobile number"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A227] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0B1530] mb-1.5">
                  Service Required <span className="text-red-500">*</span>
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A227] transition-colors bg-white"
                  required
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Message */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#0B1530] mb-1.5">
                Additional Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Any specific requirements or notes..."
                rows={2}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A227] transition-colors resize-none"
              />
            </div>

            {/* File Upload - Optional (Hidden for digital services) */}
            {requiresDocuments && (
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#0B1530] mb-1.5">
                Upload Documents <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-[#C9A227] transition-colors cursor-pointer">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FaCloudUploadAlt className="text-3xl text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 font-medium">Click to upload documents</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, DOC, JPG, PNG, XLS (Max 5MB each)</p>
                </label>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FaFileAlt className="text-[#C9A227] text-sm" />
                        <div>
                          <p className="text-sm font-medium text-[#0B1530]">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                        <FaTimes size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            )}

            {/* Consent - Only show if files uploaded */}
            {files.length > 0 && requiresDocuments && (
              <div className="mb-5 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#C9A227] border-gray-300 rounded focus:ring-[#C9A227]"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the <strong>Terms & Conditions</strong> and authorize Tax Filer to securely store and process my documents. My data will be kept <strong>100% confidential</strong>.
                  </span>
                </label>
              </div>
            )}

            {/* Trust Badges - Only show if files uploaded */}
            {files.length > 0 && requiresDocuments && (
              <div className="flex flex-wrap items-center justify-center gap-4 mb-5 py-3 border-y border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <FaShieldAlt className="text-green-500" />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <FaLock className="text-green-500" />
                  <span>Data Encrypted</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <FaCheckCircle className="text-green-500" />
                  <span>Confidential</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0B1530] text-white rounded-lg font-semibold hover:bg-[#C9A227] hover:text-[#0B1530] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><FaSpinner className="animate-spin" /> Submitting...</>
              ) : (
                <><FaCalendarCheck /> {files.length > 0 ? 'Book & Upload Documents' : 'Book Service'}</>
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="bg-gray-50 px-5 md:px-6 py-4 border-t">
            <p className="text-xs text-gray-600">
              <span className="font-semibold text-[#0B1530]">Common Documents:</span> PAN Card • Aadhaar • Address Proof • Bank Details • Business Proof (if applicable)
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Booking;
