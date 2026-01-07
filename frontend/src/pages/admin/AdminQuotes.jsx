import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaTrash, FaEye, FaCheckCircle, FaTimesCircle, FaClock, FaEnvelope, FaPhone, FaBriefcase, FaFileAlt, FaReply } from 'react-icons/fa';

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [activeTab, setActiveTab] = useState('tax'); // 'tax' or 'webdev'

  const getConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchQuotes();
    const interval = setInterval(fetchQuotes, 15000); // Refresh every 15 seconds for real-time updates
    return () => clearInterval(interval);
  }, []);

  const fetchQuotes = async () => {
    try {
      const response = await api.get('/quotes', getConfig());
      const data = response.data;
      const quotesList = Array.isArray(data) ? data : (data.quotes || []);
      setQuotes(quotesList);
    } catch (error) {
      if (quotes.length === 0) {
        toast.error('Failed to fetch quote requests');
      }
      // Don't clear quotes on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quote request?')) return;

    try {
      await api.delete(`/quotes/${id}`, getConfig());
      toast.success('Quote request deleted');
      fetchQuotes();
    } catch (error) {
      toast.error('Failed to delete quote request');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/quotes/${id}`, { status: newStatus }, getConfig());
      toast.success(`Quote status updated to ${newStatus}`);
      fetchQuotes();
      setSelectedQuote(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const openEmailReply = (quote) => {
    const subject = encodeURIComponent(`Re: Your ${quote.service} Quote Request - ReturnFilers`);
    const body = encodeURIComponent(`Dear ${quote.name},\n\nThank you for requesting a quote for ${quote.service}.\n\n\n\nBest regards,\nReturnFilers Team\n+91 84471 27264`);
    window.open(`mailto:${quote.email}?subject=${subject}&body=${body}`, '_blank');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'quoted': return 'bg-purple-100 text-purple-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="text-xs" />;
      case 'contacted': return <FaEnvelope className="text-xs" />;
      case 'quoted': return <FaFileAlt className="text-xs" />;
      case 'converted': return <FaCheckCircle className="text-xs" />;
      case 'rejected': return <FaTimesCircle className="text-xs" />;
      default: return <FaClock className="text-xs" />;
    }
  };

  // Separate quotes into tax and web development
  const webDevKeywords = ['web-basic', 'web-business', 'web-ecommerce', 'web-custom', 'web development', 'website'];
  const isWebDevQuote = (service) => {
    return webDevKeywords.some(keyword => service.toLowerCase().includes(keyword.toLowerCase()));
  };

  const taxQuotes = quotes.filter(q => !isWebDevQuote(q.service));
  const webDevQuotes = quotes.filter(q => isWebDevQuote(q.service));

  // Apply filter based on active tab
  const currentQuotes = activeTab === 'tax' ? taxQuotes : webDevQuotes;

  const filteredQuotes = currentQuotes.filter(quote => {
    const matchesSearch = 
      quote.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.phone?.includes(searchTerm) ||
      quote.service?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || quote.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="p-10 text-center">Loading quote requests...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1530]">Quote Requests</h1>
          <p className="text-gray-500 mt-1">Total: {quotes.length} | Filtered: {filteredQuotes.length}</p>
        </div>
        <button
          onClick={fetchQuotes}
          className="bg-[#0B1530] text-white px-4 py-2 rounded-lg hover:bg-[#1a2b5c] transition-all text-sm"
        >
          Refresh Data
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6">
        <button
          onClick={() => {
            setActiveTab('tax');
            setFilterStatus('all');
          }}
          className={`px-6 py-3 font-semibold text-sm transition-colors relative ${
            activeTab === 'tax'
              ? 'text-[#C9A227] border-b-2 border-[#C9A227]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Tax Services
          <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
            {taxQuotes.length}
          </span>
        </button>
        <button
          onClick={() => {
            setActiveTab('webdev');
            setFilterStatus('all');
          }}
          className={`px-6 py-3 font-semibold text-sm transition-colors relative ${
            activeTab === 'webdev'
              ? 'text-[#C9A227] border-b-2 border-[#C9A227]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Web Development
          <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
            {webDevQuotes.length}
          </span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by name, email, phone, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1530] focus:border-transparent"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1530] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="quoted">Quoted</option>
            <option value="converted">Converted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 text-xs font-semibold text-gray-600">Customer</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-600">Service</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-600">Budget</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-600">Status</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-600">Date</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredQuotes.length > 0 ? (
                filteredQuotes.map((quote) => (
                  <tr key={quote._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-semibold text-sm text-[#0B1530]">{quote.name}</p>
                      <p className="text-xs text-gray-500">{quote.email}</p>
                      <p className="text-xs text-gray-500">{quote.phone}</p>
                      {quote.company && <p className="text-xs text-gray-400">{quote.company}</p>}
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium capitalize">{quote.service}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-600 capitalize">
                        {quote.budget ? quote.budget.replace('-', ' - ') : 'Not specified'}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={quote.status}
                        onChange={(e) => handleUpdateStatus(quote._id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(quote.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="quoted">Quoted</option>
                        <option value="converted">Converted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      {new Date(quote.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedQuote(quote)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="View Details"
                        >
                          <FaEye size={14} />
                        </button>
                        <button
                          onClick={() => openEmailReply(quote)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Reply via Email"
                        >
                          <FaReply size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(quote._id)}
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
                    No quote requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedQuote(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#0B1530]">Quote Request Details</h2>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Name</label>
                  <p className="text-[#0B1530] font-semibold">{selectedQuote.name}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
                  <p className="text-[#0B1530]">{selectedQuote.email}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
                  <p className="text-[#0B1530]">{selectedQuote.phone}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Company</label>
                  <p className="text-[#0B1530]">{selectedQuote.company || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Service</label>
                  <p className="text-[#0B1530] capitalize">{selectedQuote.service}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Budget</label>
                  <p className="text-[#0B1530] capitalize">{selectedQuote.budget ? selectedQuote.budget.replace('-', ' - ') : 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
                  <select
                    value={selectedQuote.status}
                    onChange={(e) => handleUpdateStatus(selectedQuote._id, e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1530]"
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="quoted">Quoted</option>
                    <option value="converted">Converted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Date</label>
                  <p className="text-[#0B1530]">{new Date(selectedQuote.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Message</label>
                <p className="text-[#0B1530] mt-1 bg-gray-50 p-3 rounded-lg">{selectedQuote.message}</p>
              </div>
              <button
                onClick={() => openEmailReply(selectedQuote)}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
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

export default AdminQuotes;

