import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import UserAuthContext from '../context/UserAuthContext';
import AuthModal from '../components/common/AuthModal';

const Quote = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(UserAuthContext);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
    budget: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Phone number validation - only allow digits and max 10
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: digitsOnly });
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    // Validate phone is exactly 10 digits
    if (formData.phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    
    setLoading(true);

    try {
      const response = await api.post('/quotes', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Quote request submitted successfully! We will contact you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        message: '',
        budget: ''
      });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit quote request. Please try again.';
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(userData) => {
          setFormData({
            ...formData,
            name: userData.name,
            email: userData.email,
            phone: userData.phone || formData.phone
          });
          setShowAuthModal(false);
        }}
        message="Please login to request a quote"
      />
      
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Get a Quote</h2>
          <p className="text-gray-600 text-sm">
            Fill out the form below and we'll get back to you with a customized quote
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm"
              />
            </div>

            {/* Email and Phone Row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="9876543210"
                  maxLength={10}
                  pattern="[6-9][0-9]{9}"
                  title="Enter valid 10-digit mobile number starting with 6-9"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm"
                />
              </div>
            </div>

            {/* Company and Service Row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="company"
                  placeholder="Your company name"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service *</label>
                <select
                  name="service"
                  required
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm bg-white"
                >
                  <option value="">Select Service *</option>
                  <option value="accounting">Accounting Services</option>
                  <option value="tax">Tax Planning</option>
                  <option value="audit">Audit Services</option>
                  <option value="consulting">Business Consulting</option>
                  <option value="financial">Financial Planning</option>
                  <optgroup label="Web Development">
                    <option value="web-basic">Basic Website</option>
                    <option value="web-business">Business Website</option>
                    <option value="web-ecommerce">E-commerce Website</option>
                    <option value="web-custom">Custom Web Application</option>
                  </optgroup>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range (Optional)</label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm bg-white"
              >
                <option value="">Select Budget Range</option>
                <option value="under-10k">Under ₹10,000</option>
                <option value="10k-50k">₹10,000 - ₹50,000</option>
                <option value="50k-1lakh">₹50,000 - ₹1,00,000</option>
                <option value="1lakh-5lakh">₹1,00,000 - ₹5,00,000</option>
                <option value="above-5lakh">Above ₹5,00,000</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Requirements *</label>
              <textarea
                name="message"
                required
                placeholder="Tell us about your requirements"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-2.5 rounded-md font-medium text-sm hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Submitting...' : 'Submit Quote Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default Quote;

