import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const AdminCustomers = () => {
  const [bookings, setBookings] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [bookingsRes, quotesRes, consultationsRes, contactsRes] = await Promise.all([
        api.get('/bookings', config),
        api.get('/quotes', config),
        api.get('/consultations', config),
        api.get('/contacts')
      ]);

      setBookings(bookingsRes.data.bookings || []);
      setQuotes(quotesRes.data.quotes || quotesRes.data || []);
      setConsultations(consultationsRes.data.consultations || consultationsRes.data || []);
      setContacts(contactsRes.data.contacts || contactsRes.data.data || contactsRes.data || []);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Group all data by user email
  const getUsersData = () => {
    const usersMap = new Map();

    // Add bookings
    bookings.forEach(item => {
      const email = item.email?.toLowerCase();
      if (!email) return;
      
      if (!usersMap.has(email)) {
        usersMap.set(email, {
          email: item.email,
          name: item.name,
          phone: item.phone,
          bookings: [],
          quotes: [],
          consultations: [],
          contacts: []
        });
      }
      usersMap.get(email).bookings.push(item);
    });

    // Add quotes
    quotes.forEach(item => {
      const email = item.email?.toLowerCase();
      if (!email) return;
      
      if (!usersMap.has(email)) {
        usersMap.set(email, {
          email: item.email,
          name: item.name,
          phone: item.phone,
          bookings: [],
          quotes: [],
          consultations: [],
          contacts: []
        });
      }
      usersMap.get(email).quotes.push(item);
    });

    // Add consultations
    consultations.forEach(item => {
      const email = item.email?.toLowerCase();
      if (!email) return;
      
      if (!usersMap.has(email)) {
        usersMap.set(email, {
          email: item.email,
          name: item.name,
          phone: item.phone,
          bookings: [],
          quotes: [],
          consultations: [],
          contacts: []
        });
      }
      usersMap.get(email).consultations.push(item);
    });

    // Add contacts
    contacts.forEach(item => {
      const email = item.email?.toLowerCase();
      if (!email) return;
      
      if (!usersMap.has(email)) {
        usersMap.set(email, {
          email: item.email,
          name: item.name,
          phone: item.phone,
          bookings: [],
          quotes: [],
          consultations: [],
          contacts: []
        });
      }
      usersMap.get(email).contacts.push(item);
    });

    return Array.from(usersMap.values());
  };

  const users = getUsersData();

  // Filter users by search term
  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  const toggleUser = (email) => {
    setExpandedUser(expandedUser === email ? null : email);
  };

  const openEmailReply = (user) => {
    const subject = encodeURIComponent(`ReturnFilers - Customer Update`);
    const body = encodeURIComponent(`Dear ${user.name},\n\nThank you for choosing ReturnFilers.\n\nBest regards,\nReturnFilers Team`);
    window.open(`mailto:${user.email}?subject=${subject}&body=${body}`, '_blank');
  };

  const getTotalInteractions = (user) => {
    return user.bookings.length + user.quotes.length + user.consultations.length + user.contacts.length;
  };

  const getLatestDate = (user) => {
    const dates = [
      ...user.bookings.map(b => new Date(b.createdAt)),
      ...user.quotes.map(q => new Date(q.createdAt)),
      ...user.consultations.map(c => new Date(c.createdAt)),
      ...user.contacts.map(c => new Date(c.createdAt))
    ];
    return dates.length > 0 ? new Date(Math.max(...dates)) : null;
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Customers</h1>
        <p className="text-gray-600">View all customer interactions grouped by user</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <input
          type="text"
          placeholder="Search by email, name, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Customers</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Bookings</p>
          <p className="text-2xl font-bold text-blue-600">{bookings.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Quotes</p>
          <p className="text-2xl font-bold text-purple-600">{quotes.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Consultations</p>
          <p className="text-2xl font-bold text-green-600">{consultations.length}</p>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No customers found</p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const latestDate = getLatestDate(user);
            const totalInteractions = getTotalInteractions(user);
            const isExpanded = expandedUser === user.email;

            return (
              <div 
                key={user.email} 
                className={`bg-white rounded-lg border-2 transition-all ${
                  isExpanded ? 'border-gray-900 shadow-lg' : 'border-gray-200'
                }`}
              >
                {/* User Header */}
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleUser(user.email)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{user.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <FaEnvelope size={12} />
                            {user.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaPhone size={12} />
                            {user.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Interactions</p>
                        <p className="text-xl font-bold text-gray-900">{totalInteractions}</p>
                      </div>
                      {latestDate && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Last Activity</p>
                          <p className="text-sm font-medium text-gray-900">
                            {latestDate.toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      <div className="p-2 rounded-full bg-gray-100">
                        {isExpanded ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Bookings */}
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center justify-between">
                          Bookings
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {user.bookings.length}
                          </span>
                        </h4>
                        {user.bookings.length === 0 ? (
                          <p className="text-sm text-gray-500">No bookings</p>
                        ) : (
                          <div className="space-y-2">
                            {user.bookings.map((booking) => (
                              <div key={booking._id} className="p-2 bg-gray-50 rounded text-sm">
                                <p className="font-medium text-gray-900">{booking.service}</p>
                                <div className="flex items-center justify-between mt-1">
                                  <span className={`px-2 py-0.5 rounded text-xs ${
                                    booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-blue-100 text-blue-700'
                                  }`}>
                                    {booking.status}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(booking.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Quotes */}
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center justify-between">
                          Quote Requests
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                            {user.quotes.length}
                          </span>
                        </h4>
                        {user.quotes.length === 0 ? (
                          <p className="text-sm text-gray-500">No quotes</p>
                        ) : (
                          <div className="space-y-2">
                            {user.quotes.map((quote) => (
                              <div key={quote._id} className="p-2 bg-gray-50 rounded text-sm">
                                <p className="font-medium text-gray-900">{quote.service}</p>
                                <div className="flex items-center justify-between mt-1">
                                  <span className={`px-2 py-0.5 rounded text-xs ${
                                    quote.status === 'converted' ? 'bg-green-100 text-green-700' :
                                    quote.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-purple-100 text-purple-700'
                                  }`}>
                                    {quote.status}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(quote.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Consultations */}
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center justify-between">
                          Consultations
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                            {user.consultations.length}
                          </span>
                        </h4>
                        {user.consultations.length === 0 ? (
                          <p className="text-sm text-gray-500">No consultations</p>
                        ) : (
                          <div className="space-y-2">
                            {user.consultations.map((consultation) => (
                              <div key={consultation._id} className="p-2 bg-gray-50 rounded text-sm">
                                <p className="font-medium text-gray-900">{consultation.service}</p>
                                <div className="flex items-center justify-between mt-1">
                                  <span className={`px-2 py-0.5 rounded text-xs ${
                                    consultation.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    consultation.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-blue-100 text-blue-700'
                                  }`}>
                                    {consultation.status}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(consultation.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Contacts */}
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center justify-between">
                          Contact Messages
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                            {user.contacts.length}
                          </span>
                        </h4>
                        {user.contacts.length === 0 ? (
                          <p className="text-sm text-gray-500">No messages</p>
                        ) : (
                          <div className="space-y-2">
                            {user.contacts.map((contact) => (
                              <div key={contact._id} className="p-2 bg-gray-50 rounded text-sm">
                                <p className="text-gray-900 line-clamp-2">{contact.message}</p>
                                <div className="flex items-center justify-between mt-1">
                                  <span className={`px-2 py-0.5 rounded text-xs ${
                                    contact.status === 'replied' ? 'bg-green-100 text-green-700' :
                                    contact.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-blue-100 text-blue-700'
                                  }`}>
                                    {contact.status}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(contact.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4">
                      <button
                        onClick={() => openEmailReply(user)}
                        className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Send Email to {user.name}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
