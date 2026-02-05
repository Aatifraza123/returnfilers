import { useState } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaBriefcase, FaComments } from 'react-icons/fa';
import api from '../../api/axios';
import { useRecaptcha } from '../../hooks/useRecaptcha';

const ConsultationModal = ({ isOpen, onClose, serviceName = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: serviceName || '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const getRecaptchaToken = useRecaptcha('consultation_form');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get reCAPTCHA token
      const recaptchaToken = await getRecaptchaToken();
      
      if (!recaptchaToken) {
        setError('Security verification failed. Please try again.');
        setLoading(false);
        return;
      }

      await api.post('/consultations', {
        ...formData,
        recaptchaToken
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <FaTimes size={20} />
        </button>

        {success ? (
          <div className="text-center py-12 px-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
            <p className="text-gray-600">We'll contact you within 24 hours.</p>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Book Consultation</h2>
              <p className="text-sm text-gray-600 mt-1">
                Fill the form below and our expert consultants will connect with you within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-3">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm">
                  {error}
                </div>
              )}

              <div>
                <div className="relative">
                  <FaUser className="absolute left-3 top-2.5 text-gray-400" size={14} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    placeholder="Full Name *"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-2.5 text-gray-400" size={14} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    placeholder="Email Address *"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-2.5 text-gray-400" size={14} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <FaBriefcase className="absolute left-3 top-2.5 text-gray-400" size={14} />
                  <input
                    type="text"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    placeholder="Select Service *"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <FaComments className="absolute left-3 top-2.5 text-gray-400" size={14} />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={2}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm"
                    placeholder="Briefly describe your requirements..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-black text-white font-semibold rounded hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ConsultationModal;
