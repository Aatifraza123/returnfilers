import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaBriefcase, FaComment } from 'react-icons/fa';

const ConsultationModal = ({ isOpen, closeModal, preSelectedService }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  // Pre-fill service when preSelectedService prop changes
  useEffect(() => {
    if (preSelectedService) {
      setFormData(prev => ({ ...prev, service: preSelectedService }));
    }
  }, [preSelectedService]);

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
    
    // Validate phone is exactly 10 digits
    if (formData.phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    
    setLoading(true);

    try {
      const response = await api.post('/consultations', formData);
      
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
        closeModal();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to submit. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all border-t-4 border-[#C9A227]">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title as="h3" className="text-2xl font-bold text-[#0B1530]">
                    Book Consultation
                  </Dialog.Title>
                  <button 
                    onClick={closeModal} 
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <p className="text-gray-600 text-sm mb-6">
                  Fill the form below and our expert CAs will connect with you within 24 hours.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Name */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaUser size={14} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name *"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0B1530] focus:ring-1 focus:ring-[#0B1530] transition-all text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaEnvelope size={14} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address *"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0B1530] focus:ring-1 focus:ring-[#0B1530] transition-all text-sm"
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaPhone size={14} />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      maxLength={10}
                      pattern="[6-9][0-9]{9}"
                      title="Enter valid 10-digit mobile number"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0B1530] focus:ring-1 focus:ring-[#0B1530] transition-all text-sm"
                    />
                  </div>

                  {/* Service */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaBriefcase size={14} />
                    </div>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0B1530] focus:ring-1 focus:ring-[#0B1530] transition-all appearance-none text-sm text-gray-700"
                    >
                      <option value="">Select Service *</option>
                      {preSelectedService && !['Tax Consulting', 'Audit Services', 'Business Registration', 'Financial Advisory', 'Web Development - Basic Website', 'Web Development - Business Website', 'Web Development - E-commerce Website', 'Web Development - Custom Web Application', 'Other'].includes(preSelectedService) && (
                        <option value={preSelectedService}>{preSelectedService}</option>
                      )}
                      <option value="Tax Consulting">Tax Consulting</option>
                      <option value="Audit Services">Audit Services</option>
                      <option value="Business Registration">Business Registration</option>
                      <option value="Financial Advisory">Financial Advisory</option>
                      <optgroup label="Web Development">
                        <option value="Web Development - Basic Website">Basic Website</option>
                        <option value="Web Development - Business Website">Business Website</option>
                        <option value="Web Development - E-commerce Website">E-commerce Website</option>
                        <option value="Web Development - Custom Web Application">Custom Web Application</option>
                      </optgroup>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                      <FaComment size={14} />
                    </div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Briefly describe your requirements..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0B1530] focus:ring-1 focus:ring-[#0B1530] transition-all resize-none text-sm"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0B1530] text-white py-3.5 rounded-xl font-bold text-base hover:bg-[#C9A227] hover:text-[#0B1530] transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                  >
                    {loading ? 'Submitting...' : 'Confirm Booking'}
                  </button>

                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConsultationModal;










