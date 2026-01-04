import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  FaEye, FaTrash, FaPhone, FaEnvelope, FaCalendarAlt, 
  FaSearch, FaFilter, FaFileAlt, FaDownload, FaTimes,
  FaClipboardList
} from 'react-icons/fa';

const AdminDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewingDoc, setViewingDoc] = useState(null);

  useEffect(() => {
    fetchDocuments();
    const interval = setInterval(fetchDocuments, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data } = await api.get('/documents');
      if (data.success) {
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentDetails = async (id) => {
    try {
      const { data } = await api.get(`/documents/${id}`);
      if (data.success) {
        setViewingDoc(data.data);
      }
    } catch (error) {
      toast.error('Failed to load document details');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const { data } = await api.patch(`/documents/${id}`, { status });
      if (data.success) {
        toast.success('Status updated');
        fetchDocuments();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-medium">Delete this submission?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const { data } = await api.delete(`/documents/${id}`);
                if (data.success) {
                  toast.success('Deleted successfully');
                  fetchDocuments();
                }
              } catch (error) {
                toast.error('Failed to delete');
              }
            }}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  };

  const downloadFile = (doc) => {
    const link = document.createElement('a');
    link.href = doc.data;
    link.download = doc.name;
    link.click();
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.pending;
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
        <h1 className="text-3xl font-bold text-[#0B1530] mb-2">Document Submissions</h1>
        <p className="text-gray-600">Manage client document uploads</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total</p>
          <p className="text-2xl font-bold text-[#0B1530]">{documents.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {documents.filter(d => d.status === 'pending').length}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Reviewing</p>
          <p className="text-2xl font-bold text-blue-600">
            {documents.filter(d => d.status === 'reviewing').length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-2xl font-bold text-green-600">
            {documents.filter(d => d.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-[#C9A227]"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border rounded-lg focus:outline-none focus:border-[#C9A227] appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Files</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDocs.map((doc) => (
                <tr key={doc._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{doc.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <FaEnvelope size={10} /> {doc.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <FaPhone size={10} /> {doc.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-[#0B1530]/10 text-[#0B1530] rounded text-sm font-medium">
                      {doc.service}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm">
                      <FaFileAlt className="text-[#C9A227]" />
                      {doc.documents?.length || 0} file(s)
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt size={10} />
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={doc.status}
                      onChange={(e) => handleStatusUpdate(doc._id, e.target.value)}
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusBadge(doc.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => fetchDocumentDetails(doc._id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDelete(doc._id)}
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

        {filteredDocs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <FaClipboardList className="text-4xl mx-auto mb-3 text-gray-300" />
            No document submissions found
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0B1530] text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Document Details</h2>
              <button onClick={() => setViewingDoc(null)} className="text-white hover:text-[#C9A227]">
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Client Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold">{viewingDoc.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{viewingDoc.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold">{viewingDoc.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-semibold">{viewingDoc.service}</p>
                </div>
              </div>

              {viewingDoc.message && (
                <div>
                  <p className="text-sm text-gray-500">Message</p>
                  <p className="font-semibold">{viewingDoc.message}</p>
                </div>
              )}

              {/* Documents */}
              <div>
                <p className="text-sm text-gray-500 mb-3">Uploaded Documents ({viewingDoc.documents?.length || 0})</p>
                <div className="space-y-2">
                  {viewingDoc.documents?.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FaFileAlt className="text-[#C9A227]" />
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => downloadFile(file)}
                        className="flex items-center gap-1 px-3 py-1 bg-[#0B1530] text-white rounded text-sm hover:bg-[#C9A227] hover:text-[#0B1530] transition-colors"
                      >
                        <FaDownload size={12} /> Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Date */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(viewingDoc.status)}`}>
                    {viewingDoc.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Submitted: {new Date(viewingDoc.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDocuments;
