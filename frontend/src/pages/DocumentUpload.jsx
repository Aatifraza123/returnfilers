import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaFileAlt, FaTimes, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import api from '../api/axios';
import toast from 'react-hot-toast';

const services = [
  'GST Registration',
  'GST Return Filing',
  'Income Tax Return',
  'TDS Return Filing',
  'Company Registration',
  'LLP Registration',
  'Partnership Firm Registration',
  'Trademark Registration',
  'MSME Registration',
  'Import Export Code',
  'Tax Audit',
  'Statutory Audit',
  'Bookkeeping',
  'Other'
];

const DocumentUpload = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB per file
    
    const validFiles = selectedFiles.filter(file => {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max 5MB per file.`);
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

    if (files.length === 0) {
      toast.error('Please upload at least one document');
      return;
    }

    setLoading(true);

    try {
      // Convert files to base64
      const documentsData = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
          data: await convertToBase64(file)
        }))
      );

      const { data } = await api.post('/documents', {
        ...formData,
        documents: documentsData
      });

      if (data.success) {
        setSubmitted(true);
        toast.success('Documents submitted successfully!');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit documents');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto max-w-2xl px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-4xl text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-[#0B1530] mb-4">Documents Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for submitting your documents. Our team will review them and contact you within 24-48 hours.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              For urgent queries, call us at <strong>+91 84471 27264</strong>
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', phone: '', service: '', message: '' });
                setFiles([]);
              }}
              className="px-6 py-3 bg-[#0B1530] text-white rounded-lg hover:bg-[#D4AF37] hover:text-[#0B1530] transition-colors"
            >
              Submit Another Request
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      {/* Header */}
      <div className="bg-[#0B1530] py-12 mb-8">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Submit Your Documents</h1>
          <p className="text-gray-300">
            Upload your documents securely for our team to review and process your service request.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#0B1530] mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0B1530] mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0B1530] mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0B1530] mb-2">
                  Service Required <span className="text-red-500">*</span>
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
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
            <div>
              <label className="block text-sm font-semibold text-[#0B1530] mb-2">
                Additional Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Any specific requirements or notes..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-[#0B1530] mb-2">
                Upload Documents <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#D4AF37] transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FaCloudUploadAlt className="text-5xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-400 mt-2">
                    PDF, DOC, JPG, PNG, XLS (Max 5MB per file, up to 10 files)
                  </p>
                </label>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FaFileAlt className="text-[#D4AF37]" />
                        <div>
                          <p className="text-sm font-medium text-[#0B1530]">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#0B1530] text-white rounded-lg font-semibold hover:bg-[#D4AF37] hover:text-[#0B1530] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FaCloudUploadAlt />
                  Submit Documents
                </>
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/30">
            <h4 className="font-semibold text-[#0B1530] mb-2">Required Documents (varies by service):</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• PAN Card</li>
              <li>• Aadhaar Card</li>
              <li>• Address Proof (Electricity Bill / Rent Agreement)</li>
              <li>• Bank Statement / Cancelled Cheque</li>
              <li>• Business Proof (if applicable)</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentUpload;
