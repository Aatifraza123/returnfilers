import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaComments, FaEnvelope, FaPhone,
  FaClock, FaCheckCircle, FaTimesCircle,
  FaSpinner, FaArrowLeft
} from 'react-icons/fa';
import UserAuthContext from '../../context/UserAuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

const MyConsultations = () => {
  const { user, token } = useContext(UserAuthContext);
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchConsultations();
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
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
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#0B1530] mb-4"
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-[#0B1530]">My Consultations</h1>
          <p className="text-gray-600 mt-2">View all your consultation requests</p>
        </div>

        {/* Consultations List */}
        {consultations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <FaComments className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Consultations Yet</h3>
            <p className="text-gray-500 mb-6">You haven't requested any consultations yet.</p>
            <button
              onClick={() => navigate('/services')}
              className="px-6 py-3 bg-[#C9A227] text-[#0B1530] rounded-lg font-semibold hover:bg-[#0B1530] hover:text-white transition-colors"
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
                {/* Consultation Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1530] mb-1">{consultation.service}</h3>
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

                {/* Consultation Details */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaEnvelope className="text-[#C9A227]" />
                      <span className="text-sm">{consultation.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaPhone className="text-[#C9A227]" />
                      <span className="text-sm">{consultation.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Message */}
                {consultation.message && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-[#0B1530]">Message:</span> {consultation.message}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyConsultations;
