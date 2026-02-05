import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle, FaEnvelope, FaPhone } from 'react-icons/fa';
import axios from '../api/axios';

const TrackAppointment = () => {
  const [email, setEmail] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(false);

    try {
      const { data } = await axios.get(`/appointments/by-email/${email.trim()}`);
      setAppointments(data.data || []);
      setSearched(true);
    } catch (err) {
      setError('Failed to fetch appointments. Please try again.');
      console.error('Track appointment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    if (status === 'confirmed' || status === 'completed') {
      return <FaCheckCircle className="text-green-600" />;
    }
    if (status === 'cancelled') {
      return <FaTimesCircle className="text-red-600" />;
    }
    return <FaClock className="text-yellow-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Track Your Appointment
          </h1>
          <p className="text-gray-600">
            Enter your email to view all your appointments
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Searching...
                </>
              ) : (
                <>
                  <FaSearch />
                  Search
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </motion.div>

        {/* Results */}
        {searched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {appointments.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  No Appointments Found
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any appointments with this email address.
                </p>
                <a
                  href="/appointment"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book New Appointment
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Your Appointments ({appointments.length})
                </h2>
                {appointments.map((appointment) => (
                  <motion.div
                    key={appointment._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">
                          {getStatusIcon(appointment.status)}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">
                            {appointment.service}
                          </h3>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${getStatusColor(appointment.status)}`}>
                            {appointment.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaCalendarAlt className="text-blue-600" />
                        <span>
                          {new Date(appointment.appointmentDate).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaClock className="text-blue-600" />
                        <span>{appointment.appointmentTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaEnvelope className="text-blue-600" />
                        <span>{appointment.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaPhone className="text-blue-600" />
                        <span>{appointment.phone}</span>
                      </div>
                    </div>

                    {appointment.meetingLink && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">Meeting Link:</p>
                        <a
                          href={appointment.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {appointment.meetingLink}
                        </a>
                      </div>
                    )}

                    {appointment.message && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Message:</p>
                        <p className="text-gray-800">{appointment.message}</p>
                      </div>
                    )}

                    {appointment.adminNotes && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-700 mb-1 font-semibold">Admin Notes:</p>
                        <p className="text-gray-800">{appointment.adminNotes}</p>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                      Booked on: {new Date(appointment.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-2xl shadow-lg p-6 text-center"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Need Help?
          </h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about your appointment, feel free to contact us.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+918447127264"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FaPhone />
              +91 84471 27264
            </a>
            <a
              href="mailto:info@returnfilers.in"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaEnvelope />
              info@returnfilers.in
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrackAppointment;
