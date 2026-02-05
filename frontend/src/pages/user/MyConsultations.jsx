import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaComments, FaEnvelope, FaPhone, FaCalendarAlt,
  FaClock, FaCheckCircle, FaTimesCircle,
  FaSpinner, FaArrowLeft, FaVideo, FaMapMarkerAlt
} from 'react-icons/fa';
import UserAuthContext from '../../context/UserAuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

const MyConsultations = () => {
  const { user, token } = useContext(UserAuthContext);
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('consultations');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchConsultations();
    fetchAppointments();
  }, [user, navigate]);

  const fetchConsultations = async () => {
    try {
      const { data } = await api.get('/consultations/my-consultations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.success) {
        setConsultations(data.consultations);
      }
    } catch (error) {
      console.error('Fetch consultations error:', error);
      toast.error('Failed to load consultations');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get(`/appointments/by-email/${user.email}`);
      
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (error) {
      console.error('Fetch appointments error:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'confirmed':
        return <FaCheckCircle className="text-green-500" />;
      case 'closed':
        return <FaCheckCircle className="text-blue-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      case 'contacted':
        return <FaSpinner className="text-purple-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'contacted':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-primary">My Consultations & Appointments</h1>
          <p className="text-gray-600 mt-2">View all your consultation requests and appointments</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('consultations')}
            className={`pb-3 px-4 font-semibold transition-colors ${
              activeTab === 'consultations'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaComments className="inline mr-2" />
            Consultations ({consultations.length})
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`pb-3 px-4 font-semibold transition-colors ${
              activeTab === 'appointments'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaCalendarAlt className="inline mr-2" />
            Appointments ({appointments.length})
          </button>
        </div>

        {/* Consultations Tab */}
        {activeTab === 'consultations' && (
          consultations.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <FaComments className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Consultations Yet</h3>
              <p className="text-gray-500 mb-6">You haven't requested any consultations yet.</p>
              <button
                onClick={() => navigate('/services')}
                className="px-6 py-3 bg-secondary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                Browse Services
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {consultations.map((consultation, index) => (
                <motion.div
                  key={consultation._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-1">{consultation.service}</h3>
                      <p className="text-sm text-gray-500">
                        Requested on {new Date(consultation.createdAt).toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(consultation.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(consultation.status)}`}>
                        {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaEnvelope className="text-secondary" />
                        <span className="text-sm">{consultation.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaPhone className="text-secondary" />
                        <span className="text-sm">{consultation.phone}</span>
                      </div>
                    </div>
                  </div>

                  {consultation.message && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold text-primary">Message:</span> {consultation.message}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          appointments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Appointments Yet</h3>
              <p className="text-gray-500 mb-6">You haven't booked any appointments yet.</p>
              <button
                onClick={() => navigate('/appointment')}
                className="px-6 py-3 bg-secondary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                Book Appointment
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {appointments.map((appointment, index) => (
                <motion.div
                  key={appointment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-1">{appointment.service}</h3>
                      <p className="text-sm text-gray-500">
                        Booked on {new Date(appointment.createdAt).toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(appointment.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaCalendarAlt className="text-blue-600" />
                        <span className="text-sm font-semibold">
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
                        <span className="text-sm font-semibold">{appointment.appointmentTime}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        {appointment.meetingType === 'online' && <FaVideo className="text-green-600" />}
                        {appointment.meetingType === 'phone' && <FaPhone className="text-green-600" />}
                        {appointment.meetingType === 'in-person' && <FaMapMarkerAlt className="text-green-600" />}
                        <span className="text-sm capitalize">{appointment.meetingType} Meeting</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaPhone className="text-secondary" />
                        <span className="text-sm">{appointment.phone}</span>
                      </div>
                    </div>
                  </div>

                  {appointment.meetingLink && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2 font-semibold">Meeting Link:</p>
                      <a
                        href={appointment.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all text-sm"
                      >
                        {appointment.meetingLink}
                      </a>
                    </div>
                  )}

                  {appointment.message && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold text-primary">Message:</span> {appointment.message}
                      </p>
                    </div>
                  )}

                  {appointment.adminNotes && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700 mb-1 font-semibold">Admin Notes:</p>
                      <p className="text-gray-800 text-sm">{appointment.adminNotes}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MyConsultations;
