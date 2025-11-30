import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaTrash, FaEye, FaCheckCircle, FaTimesCircle, FaClock, FaEnvelope, FaPhone, FaBriefcase, FaFileAlt } from 'react-icons/fa';

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState(null);

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
      const response = await axios.get('http://localhost:5000/api/quotes', getConfig());
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
      await axios.delete(`http://localhost:5000/api/quotes/${id}`, getConfig());
      toast.success('Quote request deleted');
      fetchQuotes();
    } catch (error) {
      toast.error('Failed to delete quote request');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/quotes/${id}`, { status: newStatus }, getConfig());
      toast.success(`Quote status updated to ${newStatus}`);
      fetchQuotes();
      setSelectedQuote(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      toast.error('Failed to update status');
    }
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

  const filteredQuotes = quotes.filter(quote => {
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
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

      {/* Quotes List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuotes.map((quote) => (
          <div
            key={quote._id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-[#0B1530] text-lg">{quote.name}</h3>
                <p className="text-sm text-gray-500">{quote.company || 'No company'}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(quote.status)}`}>
                {getStatusIcon(quote.status)}
                {quote.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaEnvelope className="text-[#D4AF37]" />
                <span className="truncate">{quote.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaPhone className="text-[#D4AF37]" />
                <span>{quote.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaBriefcase className="text-[#D4AF37]" />
                <span className="capitalize">{quote.service}</span>
              </div>
              {quote.budget && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaFileAlt className="text-[#D4AF37]" />
                  <span className="capitalize">{quote.budget.replace('-', ' - ')}</span>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-700 mb-4 line-clamp-2">{quote.message}</p>

            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedQuote(quote)}
                className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center gap-1"
              >
                <FaEye /> View
              </button>
              <button
                onClick={() => handleDelete(quote._id)}
                className="bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredQuotes.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl mb-2">No quote requests found</p>
          <p className="text-sm">Try adjusting your search or filter criteria</p>
        </div>
      )}

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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuotes;

