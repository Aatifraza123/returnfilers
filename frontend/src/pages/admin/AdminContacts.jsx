import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaEye, FaTrash, FaPhone, FaEnvelope, FaCalendarAlt, FaSearch, FaFilter, FaComment } from 'react-icons/fa';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchContacts();
    const interval = setInterval(fetchContacts, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchContacts = async () => {
    try {
      const { data } = await api.get('/contacts');
      
      if (data.success) {
        setContacts(data.data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const { data } = await api.patch(`/contacts/${id}`, { status });
      
      if (data.success) {
        toast.success('Status updated successfully');
        fetchContacts();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-medium">Delete this contact?</p>
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
      const { data } = await api.delete(`/contacts/${id}`);
      
      if (data.success) {
        toast.success('Contact deleted successfully');
        fetchContacts();
      }
    } catch (error) {
      toast.error('Failed to delete contact');
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || contact.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      read: 'bg-blue-100 text-blue-800',
      replied: 'bg-green-100 text-green-800'
    };
    return statusColors[status] || statusColors.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#0B1530] mb-2">Contact Messages</h1>
        <p className="text-gray-600">Manage all general inquiries and messages</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total</p>
          <p className="text-2xl font-bold text-[#0B1530]">{contacts.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {contacts.filter(c => c.status === 'pending').length}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Read</p>
          <p className="text-2xl font-bold text-blue-600">
            {contacts.filter(c => c.status === 'read').length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Replied</p>
          <p className="text-2xl font-bold text-green-600">
            {contacts.filter(c => c.status === 'replied').length}
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
              placeholder="Search by name, email, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37] appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr key={contact._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <FaEnvelope size={10} />
                        {contact.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <FaPhone size={10} />
                      {contact.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <FaComment className="text-gray-400 mt-1" size={12} />
                      <span className="text-sm text-gray-600 line-clamp-2">{contact.message}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <FaCalendarAlt size={10} />
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={contact.status}
                      onChange={(e) => handleStatusUpdate(contact._id, e.target.value)}
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusBadge(contact.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedContact(contact)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDelete(contact._id)}
                        className="text-red-600 hover:text-red-900"
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

        {filteredContacts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No contacts found
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4 text-[#0B1530]">Contact Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{selectedContact.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{selectedContact.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{selectedContact.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Message</p>
                <p className="font-semibold whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(selectedContact.status)}`}>
                  {selectedContact.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold">{new Date(selectedContact.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedContact(null)}
              className="mt-6 w-full bg-[#0B1530] text-white py-2 rounded-lg hover:bg-[#D4AF37] hover:text-[#0B1530] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;










