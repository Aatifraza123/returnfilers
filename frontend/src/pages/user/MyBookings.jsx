import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, FaEnvelope, FaPhone, FaFileAlt, 
  FaDownload, FaClock, FaCheckCircle, FaTimesCircle,
  FaSpinner, FaArrowLeft
} from 'react-icons/fa';
import UserAuthContext from '../../context/UserAuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

const MyBookings = () => {
  const { user, token } = useContext(UserAuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Fetch bookings error:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'in-progress':
        return <FaSpinner className="text-blue-500 animate-spin" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'contacted':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleDownloadDocument = (doc) => {
    try {
      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = doc.data;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Document downloaded');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download document');
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
          <h1 className="text-3xl font-bold text-[#0B1530]">My Bookings</h1>
          <p className="text-gray-600 mt-2">View all your service bookings and documents</p>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Yet</h3>
            <p className="text-gray-500 mb-6">You haven't made any service bookings yet.</p>
            <button
              onClick={() => navigate('/services')}
              className="px-6 py-3 bg-[#C9A227] text-[#0B1530] rounded-lg font-semibold hover:bg-[#0B1530] hover:text-white transition-colors"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                {/* Booking Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1530] mb-1">{booking.service}</h3>
                    <p className="text-sm text-gray-500">
                      Booked on {new Date(booking.createdAt).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(booking.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaEnvelope className="text-[#C9A227]" />
                      <span className="text-sm">{booking.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaPhone className="text-[#C9A227]" />
                      <span className="text-sm">{booking.phone}</span>
                    </div>
                  </div>
                  {booking.message && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Message:</span> {booking.message}
                      </p>
                    </div>
                  )}
                </div>

                {/* Documents */}
                {booking.documents && booking.documents.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="font-semibold text-[#0B1530] mb-3 flex items-center gap-2">
                      <FaFileAlt className="text-[#C9A227]" />
                      Uploaded Documents ({booking.documents.length})
                    </h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {booking.documents.map((doc, docIndex) => (
                        <div
                          key={docIndex}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#C9A227] transition-colors"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <FaFileAlt className="text-[#C9A227] flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-700 truncate">{doc.name}</p>
                              <p className="text-xs text-gray-500">
                                {doc.type} • {(doc.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDownloadDocument(doc)}
                            className="ml-2 p-2 text-[#C9A227] hover:bg-[#C9A227] hover:text-white rounded-lg transition-colors flex-shrink-0"
                            title="Download"
                          >
                            <FaDownload size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                {booking.adminNotes && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-[#0B1530]">Admin Notes:</span> {booking.adminNotes}
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

export default MyBookings;
