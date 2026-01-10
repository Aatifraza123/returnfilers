import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaEye, FaTrash, FaDownload, FaFileAlt, FaReply } from 'react-icons/fa';
import Loader from '../../components/common/Loader';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('regular'); // 'regular' or 'webdev'

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.get('/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(data.bookings || []);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await api.patch(`/bookings/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Status updated');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const deleteBooking = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Booking deleted successfully');
      fetchBookings();
      setSelectedBooking(null);
    } catch (error) {
      toast.error('Failed to delete booking');
    }
  };

  const downloadDocument = (doc) => {
    const link = document.createElement('a');
    link.href = doc.data;
    link.download = doc.name;
    link.click();
  };

  const openEmailReply = (booking) => {
    const subject = encodeURIComponent(`Re: Your ${booking.service} Booking - ReturnFilers`);
    const body = encodeURIComponent(`Dear ${booking.name},\n\nThank you for booking our ${booking.service} service.\n\n\n\nBest regards,\nReturnFilers Team\n+91 84471 27264`);
    window.open(`mailto:${booking.email}?subject=${subject}&body=${body}`, '_blank');
  };

  // Separate bookings into regular and web development
  const webDevKeywords = ['web development', 'basic website', 'business website', 'e-commerce website', 'custom web application'];
  const isWebDevBooking = (service) => {
    return webDevKeywords.some(keyword => service.toLowerCase().includes(keyword.toLowerCase()));
  };

  const regularBookings = bookings.filter(b => !isWebDevBooking(b.service));
  const webDevBookings = bookings.filter(b => isWebDevBooking(b.service));

  // Apply filter based on active tab
  const currentBookings = activeTab === 'regular' ? regularBookings : webDevBookings;
  const filteredBookings = filter === 'all' 
    ? currentBookings 
    : currentBookings.filter(b => b.status === filter);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    contacted: 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" text="Loading bookings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1530]">Bookings</h1>
          <p className="text-sm text-gray-600">Manage service bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="all">All ({currentBookings.length})</option>
            <option value="pending">Pending ({currentBookings.filter(b => b.status === 'pending').length})</option>
            <option value="contacted">Contacted</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => {
            setActiveTab('regular');
            setFilter('all');
          }}
          className={`px-6 py-3 font-semibold text-sm transition-colors relative ${
            activeTab === 'regular'
              ? 'text-[#C9A227] border-b-2 border-[#C9A227]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Regular Bookings
          <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
            {regularBookings.length}
          </span>
        </button>
        <button
          onClick={() => {
            setActiveTab('webdev');
            setFilter('all');
          }}
          className={`px-6 py-3 font-semibold text-sm transition-colors relative ${
            activeTab === 'webdev'
              ? 'text-[#C9A227] border-b-2 border-[#C9A227]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Web Development Bookings
          <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
            {webDevBookings.length}
          </span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 text-xs font-semibold text-gray-600">Customer</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-600">Service</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-600">Docs</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-600">Status</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-600">Date</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-semibold text-sm text-[#0B1530]">{booking.name}</p>
                      <p className="text-xs text-gray-500">{booking.email}</p>
                      <p className="text-xs text-gray-500">{booking.phone}</p>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium">{booking.service}</span>
                    </td>
                    <td className="p-4">
                      {booking.documents?.length > 0 ? (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <FaFileAlt /> {booking.documents.length}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">None</span>
                      )}
                    </td>
                    <td className="p-4">
                      <select
                        value={booking.status}
                        onChange={(e) => updateStatus(booking._id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColors[booking.status]}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="View Details"
                        >
                          <FaEye size={14} />
                        </button>
                        <button
                          onClick={() => openEmailReply(booking)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Reply via Email"
                        >
                          <FaReply size={14} />
                        </button>
                        <button
                          onClick={() => deleteBooking(booking._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#0B1530]">Booking Details</h2>
                <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-semibold">{selectedBooking.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-semibold">{selectedBooking.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-semibold">{selectedBooking.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Service</p>
                  <p className="font-semibold">{selectedBooking.service}</p>
                </div>
              </div>
              
              {selectedBooking.message && (
                <div>
                  <p className="text-xs text-gray-500">Message</p>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedBooking.message}</p>
                </div>
              )}

              {selectedBooking.documents?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Documents ({selectedBooking.documents.length})</p>
                  <div className="space-y-2">
                    {selectedBooking.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FaFileAlt className="text-[#C9A227]" />
                          <span className="text-sm">{doc.name}</span>
                        </div>
                        <button
                          onClick={() => downloadDocument(doc)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaDownload size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply Button */}
              <button
                onClick={() => openEmailReply(selectedBooking)}
                className="w-full mt-4 py-2.5 bg-[#0B1530] text-white rounded-lg font-semibold text-sm hover:bg-[#C9A227] hover:text-[#0B1530] transition-colors flex items-center justify-center gap-2"
              >
                <FaReply /> Reply via Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
