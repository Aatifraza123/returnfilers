import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaEye, FaTrash, FaPhone, FaEnvelope, FaBriefcase, FaCalendarAlt, FaSearch, FaFilter, FaReply } from 'react-icons/fa';

const AdminConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('tax'); // 'tax' or 'webdev'

  useEffect(() => {
    fetchConsultations();
    const interval = setInterval(fetchConsultations, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchConsultations = async () => {
    try {
      const { data } = await api.get('/consultations');
      
      if (data.success) {
        setConsultations(data.consultations || data.data || []);
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
      toast.error('Failed to load consultations');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const { data } = await api.patch(`/consultations/${id}`, { status });
      
      if (data.success) {
        toast.success('Status updated successfully');
        fetchConsultations();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-medium">Delete this consultation?</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              confirmDelete(id);
            }}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  };

  const confirmDelete = async (id) => {
    try {
      console.log('Deleting consultation:', id);
      const { data } = await api.delete(`/consultations/${id}`);
      console.log('Delete response:', data);
      
      if (data.success) {
        toast.success('Consultation deleted successfully');
        fetchConsultations();
      }
    } catch (error) {
      console.error('Delete error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to delete consultation');
    }
  };

  const openEmailReply = (consultation) => {
    const subject = encodeURIComponent(`Re: Your ${consultation.service} Consultation - Tax Filer`);
    const body = encodeURIComponent(`Dear ${consultation.name},\n\nThank you for your interest in our ${consultation.service} service.\n\n\n\nBest regards,\nTax Filer Team\n+91 84471 27264`);
    window.open(`mailto:${consultation.email}?subject=${subject}&body=${body}`, '_blank');
  };

  // Separate consultations into tax and web development
  const webDevKeywords = ['web development', 'basic website', 'business website', 'e-commerce website', 'custom web application', 'web', 'website', 'development'];
  const isWebDevConsultation = (service) => {
    return webDevKeywords.some(keyword => service.toLowerCase().includes(keyword.toLowerCase()));
  };

  const taxConsultations = consultations.filter(c => !isWebDevConsultation(c.service));
  const webDevConsultations = consultations.filter(c => isWebDevConsultation(c.service));

  // Apply filter based on active tab
  const currentConsultations = activeTab === 'tax' ? taxConsultations : webDevConsultations;

  const filteredConsultations = currentConsultations.filter(consultation => {
    const matchesSearch = 
      consultation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || consultation.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return statusColors[status] || statusColors.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#0B1530] mb-2">Consultation Requests</h1>
        <p className="text-gray-600">Manage all consultation requests from clients</p>
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
            {taxConsultations.length}
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
            {webDevConsultations.length}
          </span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total</p>
          <p className="text-2xl font-bold text-[#0B1530]">{currentConsultations.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {currentConsultations.filter(c => c.status === 'pending').length}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Contacted</p>
          <p className="text-2xl font-bold text-blue-600">
            {currentConsultations.filter(c => c.status === 'contacted').length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-2xl font-bold text-green-600">
            {currentConsultations.filter(c => c.status === 'completed').length}
            {consultations.filter(c => c.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A227]"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A227] appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredConsultations.map((consultation) => (
                <tr key={consultation._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{consultation.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <FaEnvelope size={10} />
                        {consultation.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FaBriefcase className="text-[#C9A227]" size={14} />
                      <span className="text-sm text-gray-900">{consultation.service}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <FaPhone size={10} />
                      {consultation.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <FaCalendarAlt size={10} />
                      {new Date(consultation.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={consultation.status}
                      onChange={(e) => handleStatusUpdate(consultation._id, e.target.value)}
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusBadge(consultation.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedConsultation(consultation)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => openEmailReply(consultation)}
                        className="text-green-600 hover:text-green-900"
                        title="Reply via Email"
                      >
                        <FaReply />
                      </button>
                      <button
                        onClick={() => handleDelete(consultation._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredConsultations.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No consultations found
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedConsultation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4 text-[#0B1530]">Consultation Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{selectedConsultation.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{selectedConsultation.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{selectedConsultation.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Service</p>
                <p className="font-semibold">{selectedConsultation.service}</p>
              </div>
              {selectedConsultation.message && (
                <div>
                  <p className="text-sm text-gray-600">Message</p>
                  <p className="font-semibold">{selectedConsultation.message}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(selectedConsultation.status)}`}>
                  {selectedConsultation.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold">{new Date(selectedConsultation.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedConsultation(null)}
              className="mt-6 w-full bg-[#0B1530] text-white py-2 rounded-lg hover:bg-[#C9A227] hover:text-[#0B1530] transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => openEmailReply(selectedConsultation)}
              className="mt-2 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <FaReply /> Reply via Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminConsultations;










