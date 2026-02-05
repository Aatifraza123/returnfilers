import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaCheckCircle, FaSpinner, FaVideo, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import api from '../api/axios';
import toast from 'react-hot-toast';
import UserAuthContext from '../context/UserAuthContext';
import AuthModal from '../components/common/AuthModal';

const AppointmentBooking = () => {
  const { user, token } = useContext(UserAuthContext);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    appointmentDate: '',
    appointmentTime: '',
    meetingType: 'online',
    message: ''
  });

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Auto-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  // Fetch available slots
  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const fetchAvailableSlots = async () => {
    try {
      setLoadingSlots(true);
      const { data } = await api.get('/appointments/available-slots?days=14');
      setAvailableSlots(data.data || []);
    } catch (error) {
      console.error('Error fetching slots:', error);
      toast.error('Failed to load available slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: digitsOnly });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
    setFormData({ ...formData, appointmentDate: date, appointmentTime: '' });
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setFormData({ ...formData, appointmentTime: time });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.service) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!formData.appointmentDate || !formData.appointmentTime) {
      toast.error('Please select date and time');
      return;
    }

    if (formData.phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/appointments', formData);
      
      if (response.data.success) {
        toast.success('Appointment booked successfully!');
        setSubmitted(true);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to book appointment';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
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
          <h2 className="text-2xl font-bold text-primary mb-3">Appointment Confirmed!</h2>
          <p className="text-gray-600 mb-2">
            Your appointment has been successfully booked for:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="font-semibold text-primary">
              {new Date(formData.appointmentDate).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-gray-600">at {formData.appointmentTime}</p>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            You will receive a confirmation email shortly with meeting details.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
                service: '',
                appointmentDate: '',
                appointmentTime: '',
                meetingType: 'online',
                message: ''
              });
              setSelectedDate('');
              setSelectedTime('');
              fetchAvailableSlots();
            }}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-secondary hover:text-primary transition-colors"
          >
            Book Another Appointment
          </button>
        </motion.div>
      </div>
    );
  }

  // Get available times for selected date
  const availableTimes = selectedDate 
    ? availableSlots.find(slot => slot.date === selectedDate)?.slots || []
    : [];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
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
        message="Login to auto-fill your details"
      />

      {/* Header */}
      <div className="bg-primary py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Book an Appointment</h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Schedule a consultation with our expert CA team
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="container mx-auto px-4 -mt-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-6">
            {/* Login Prompt for Guest Users */}
            {!user && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Already have an account?</p>
                    <p className="text-sm text-gray-600">Login to auto-fill your details</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-secondary hover:text-primary transition-colors"
                >
                  Login
                </button>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column: Personal Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary mb-4">Personal Details</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Service Required <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary transition-colors bg-white"
                    required
                  >
                    <option value="">Select a service</option>
                    <option value="Tax Consultation">Tax Consultation</option>
                    <option value="GST Filing">GST Filing</option>
                    <option value="Company Registration">Company Registration</option>
                    <option value="Audit Services">Audit Services</option>
                    <option value="Financial Planning">Financial Planning</option>
                    <option value="Accounting">Accounting & Bookkeeping</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Meeting Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, meetingType: 'online' })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.meetingType === 'online'
                          ? 'border-secondary bg-secondary/10'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <FaVideo className="mx-auto mb-1" />
                      <p className="text-xs font-semibold">Online</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, meetingType: 'phone' })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.meetingType === 'phone'
                          ? 'border-secondary bg-secondary/10'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <FaPhone className="mx-auto mb-1" />
                      <p className="text-xs font-semibold">Phone</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, meetingType: 'in-person' })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.meetingType === 'in-person'
                          ? 'border-secondary bg-secondary/10'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <FaMapMarkerAlt className="mx-auto mb-1" />
                      <p className="text-xs font-semibold">In-Person</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Any specific requirements..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Right Column: Date & Time Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary mb-4">Select Date & Time</h3>

                {loadingSlots ? (
                  <div className="flex items-center justify-center py-12">
                    <FaSpinner className="animate-spin text-3xl text-primary" />
                  </div>
                ) : (
                  <>
                    {/* Date Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Date <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot.date}
                            type="button"
                            onClick={() => handleDateSelect(slot.date)}
                            className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                              selectedDate === slot.date
                                ? 'border-secondary bg-secondary/10'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <FaCalendarAlt className="text-primary" />
                              <div>
                                <p className="font-semibold text-primary">{slot.dayName}</p>
                                <p className="text-sm text-gray-600">
                                  {new Date(slot.date).toLocaleDateString('en-IN', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                                <p className="text-xs text-gray-500">{slot.slots.length} slots available</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Selection */}
                    {selectedDate && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Select Time <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                          {availableTimes.map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => handleTimeSelect(time)}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                selectedTime === time
                                  ? 'border-secondary bg-secondary/10'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              <FaClock className="mx-auto mb-1 text-primary" />
                              <p className="text-sm font-semibold">{time}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading || !selectedDate || !selectedTime}
                className="w-full py-4 bg-primary text-white rounded-lg font-semibold hover:bg-secondary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><FaSpinner className="animate-spin" /> Booking...</>
                ) : (
                  <><FaCheckCircle /> Confirm Appointment</>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
