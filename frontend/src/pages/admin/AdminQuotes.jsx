import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaEye, FaTrash, FaEnvelope, FaTimes } from 'react-icons/fa';

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [filter, setFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('');

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.get('/quotes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuotes(data.quotes || data || []);
    } catch (error) {
      toast.error('Failed to fetch quotes');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await api.patch(`/quotes/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Status updated');
      fetchQuotes();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const deleteQuote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quote?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/quotes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Quote deleted');
      fetchQuotes();
      setSelectedQuote(null);
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const openEmailReply = (quote) => {
    const subject = encodeURIComponent(`Re: Your ${quote.service} Quote Request`);
    const body = encodeURIComponent(`Dear ${quote.name},\n\nThank you for requesting a quote for ${quote.service}.\n\nBest regards,\nReturnFilers Team`);
    window.open(`mailto:${quote.email}?subject=${subject}&body=${body}`, '_blank');
  };

  const filteredQuotes = quotes.filter(q => {
    const matchesStatus = filter === 'all' || q.status === filter;
    const matchesUser = !userFilter || 
      q.email?.toLowerCase().includes(userFilter.toLowerCase()) ||
      q.name?.toLowerCase().includes(userFilter.toLowerCase()) ||
      q.phone?.includes(userFilter);
    return matchesStatus && matchesUser;
  });

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    contacted: 'bg-blue-100 text-blue-800 border-blue-200',
    quoted: 'bg-purple-100 text-purple-800 border-purple-200',
    converted: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Quote Requests</h1>
        <p className="text-gray-600">Manage all quote requests</p>
      </div>

      {/* Search by User */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <input
          type="text"
          placeholder="Search by user email, name, or phone..."
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({quotes.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'pending' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            }`}
          >
            Pending ({quotes.filter(q => q.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('converted')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'converted' 
                ? 'bg-green-600 text-white' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            Converted ({quotes.filter(q => q.status === 'converted').length})
          </button>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No quotes found
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((quote) => (
                  <tr key={quote._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{quote.name}</p>
                        <p className="text-sm text-gray-500">{quote.email}</p>
                        <p className="text-sm text-gray-500">{quote.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{quote.service}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{quote.budget || 'Not specified'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={quote.status}
                        onChange={(e) => updateStatus(quote._id, e.target.value)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border ${statusColors[quote.status]}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="quoted">Quoted</option>
                        <option value="converted">Converted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedQuote(quote)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => openEmailReply(quote)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Send Email"
                        >
                          <FaEnvelope size={16} />
                        </button>
                        <button
                          onClick={() => deleteQuote(quote._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Quote Details</h2>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Customer Name</label>
                <p className="text-gray-900">{selectedQuote.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{selectedQuote.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{selectedQuote.phone}</p>
              </div>
              {selectedQuote.company && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Company</label>
                  <p className="text-gray-900">{selectedQuote.company}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Service</label>
                <p className="text-gray-900">{selectedQuote.service}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Budget</label>
                <p className="text-gray-900">{selectedQuote.budget || 'Not specified'}</p>
              </div>
              {selectedQuote.message && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Message</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedQuote.message}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className={`inline-block px-3 py-1 rounded-lg text-sm font-medium border ${statusColors[selectedQuote.status]}`}>
                  {selectedQuote.status}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Request Date</label>
                <p className="text-gray-900">
                  {new Date(selectedQuote.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => openEmailReply(selectedQuote)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Email
              </button>
              <button
                onClick={() => setSelectedQuote(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuotes;
