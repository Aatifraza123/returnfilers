import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaEye, FaTrash, FaDownload, FaCalendarCheck, FaSearch, FaFileAlt, FaReply, FaPaperPlane } from 'react-icons/fa';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyData, setReplyData] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);

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
    if (!window.confirm('Delete this booking?')) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Deleted');
      fetchBookings();
      setSelectedBooking(null);
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const downloadDocument = (doc) => {
    const link = document.createElement('a');
    link.href = doc.data;
    link.download = doc.name;
    link.click();
  };

  const openReplyModal = (booking) => {
    setSelectedBooking(booking);
    setReplyData({
      subject: `Re: Your ${booking.service} Booking - Tax Filer`,
      message: `Dear ${booking.name},\n\nThank you for booking our ${booking.service} service.\n\n[Your message here]\n\nBest regards,\nTax Filer Team\n+91 84471 27264`
    });
    setShowReplyModal(true);
  };

  const sendReply = async () => {
    if (!replyData.subject || !replyData.message) {
      toast.error('Please fill subject and message');
      return;
    }
    setSending(true);
    try {
      const token = localStorage.getItem('token');
      await api.post('/bookings/reply', {
        bookingId: selectedBooking._id,
        to: selectedBooking.email,
        subject: replyData.subject,
        message: replyData.message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Email sent successfully!');
      setShowReplyModal(false);
      setReplyData({ subject: '', message: '' });
      // Update status to contacted
      updateStatus(selectedBooking._id, 'contacted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    contacted: 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
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
            <option value="all">All ({bookings.length})</option>
            <option value="pending">Pending ({bookings.filter(b => b.status === 'pending').length})</option>
            <option value="contacted">Contacted</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
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
                          onClick={() => openReplyModal(booking)}
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

              {/* Reply Button in Detail Modal */}
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  setTimeout(() => openReplyModal(selectedBooking), 100);
                }}
                className="w-full mt-4 py-2.5 bg-[#0B1530] text-white rounded-lg font-semibold text-sm hover:bg-[#C9A227] hover:text-[#0B1530] transition-colors flex items-center justify-center gap-2"
              >
                <FaReply /> Reply via Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b bg-[#0B1530] rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FaReply className="text-[#C9A227]" /> Reply to {selectedBooking.name}
                </h2>
                <button onClick={() => setShowReplyModal(false)} className="text-gray-400 hover:text-white">✕</button>
              </div>
              <p className="text-sm text-gray-400 mt-1">To: {selectedBooking.email}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Subject</label>
                <input
                  type="text"
                  value={replyData.subject}
                  onChange={(e) => setReplyData({ ...replyData, subject: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#C9A227]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Message</label>
                <textarea
                  value={replyData.message}
                  onChange={(e) => setReplyData({ ...replyData, message: e.target.value })}
                  rows={10}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#C9A227] resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={sendReply}
                  disabled={sending}
                  className="flex-1 py-2.5 bg-[#0B1530] text-white rounded-lg font-semibold text-sm hover:bg-[#C9A227] hover:text-[#0B1530] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {sending ? 'Sending...' : <><FaPaperPlane /> Send Email</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
