import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  FaArrowLeft, 
  FaUsers, 
  FaCheckCircle, 
  FaTimesCircle,
  FaTrash,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaFileInvoice,
  FaComments,
  FaCalendarCheck,
  FaSearch,
  FaUserShield
} from 'react-icons/fa';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0,
    newUsers: 0
  });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      if (data.success) {
        setUsers(data.users);
        setFilteredUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/users/stats');
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { data } = await api.delete(`/users/${userId}`);
      if (data.success) {
        toast.success('User deleted successfully');
        fetchUsers();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div 
        className="border-b border-gray-200 sticky top-0 z-50"
        style={{ backgroundColor: 'var(--color-bg-light)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/admin/dashboard"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft size={20} />
              </Link>
              <div>
                <h1 
                  className="text-xl font-bold flex items-center gap-2"
                  style={{ color: 'var(--color-primary)' }}
                >
                  <FaUsers />
                  User Management
                </h1>
                <p className="text-sm text-gray-600">{filteredUsers.length} total users</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div 
            className="rounded-lg border border-gray-200 p-6"
            style={{ backgroundColor: 'var(--color-bg-light)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <FaUsers style={{ color: 'var(--color-primary)' }} size={24} />
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Users</p>
            <p 
              className="text-3xl font-bold"
              style={{ color: 'var(--color-primary)' }}
            >
              {stats.totalUsers}
            </p>
          </div>
          
          <div 
            className="rounded-lg border border-gray-200 p-6"
            style={{ backgroundColor: 'var(--color-bg-light)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <FaCheckCircle className="text-green-600" size={24} />
            </div>
            <p className="text-sm text-gray-600 mb-1">Verified Users</p>
            <p className="text-3xl font-bold text-gray-900">{stats.verifiedUsers}</p>
          </div>
          
          <div 
            className="rounded-lg border border-gray-200 p-6"
            style={{ backgroundColor: 'var(--color-bg-light)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <FaTimesCircle className="text-orange-600" size={24} />
            </div>
            <p className="text-sm text-gray-600 mb-1">Unverified Users</p>
            <p className="text-3xl font-bold text-gray-900">{stats.unverifiedUsers}</p>
          </div>
          
          <div 
            className="rounded-lg border border-gray-200 p-6"
            style={{ backgroundColor: 'var(--color-bg-light)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <FaCalendarAlt style={{ color: 'var(--color-secondary)' }} size={24} />
            </div>
            <p className="text-sm text-gray-600 mb-1">New (30 days)</p>
            <p 
              className="text-3xl font-bold"
              style={{ color: 'var(--color-primary)' }}
            >
              {stats.newUsers}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div 
          className="rounded-lg border border-gray-200 p-4 mb-6"
          style={{ backgroundColor: 'var(--color-bg-light)' }}
        >
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ 
                '--tw-ring-color': 'var(--color-secondary)',
                backgroundColor: 'var(--color-bg-light)'
              }}
            />
          </div>
        </div>

        {/* Users Table */}
        <div 
          className="rounded-lg shadow-sm overflow-hidden border border-gray-100"
          style={{ backgroundColor: 'var(--color-bg-light)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead 
                className="text-gray-600 uppercase text-xs font-semibold"
                style={{ backgroundColor: 'var(--color-secondary-light)' }}
              >
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Joined</th>
                  <th className="p-3 text-center">Activity</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: 'var(--color-secondary-light)' }}
                          >
                            <span 
                              className="font-bold text-sm"
                              style={{ color: 'var(--color-secondary)' }}
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div 
                              className="font-semibold text-sm flex items-center gap-2"
                              style={{ color: 'var(--color-primary)' }}
                            >
                              {user.name}
                              {user.role === 'admin' && (
                                <FaUserShield className="text-red-500" size={12} title="Admin" />
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {user._id.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FaEnvelope size={12} className="text-gray-400" />
                          <span className="truncate max-w-[200px]">{user.email}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        {user.phone ? (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <FaPhone size={12} className="text-gray-400" />
                            <span>{user.phone}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Not provided</span>
                        )}
                      </td>
                      <td className="p-3">
                        {user.isVerified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            <FaCheckCircle size={10} />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                            <FaTimesCircle size={10} />
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <FaCalendarAlt size={10} className="text-gray-400" />
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-3 text-xs">
                          <div className="flex items-center gap-1" title="Bookings">
                            <FaCalendarCheck className="text-orange-600" size={12} />
                            <span 
                              className="font-semibold"
                              style={{ color: 'var(--color-primary)' }}
                            >
                              {user.bookingsCount || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-1" title="Quotes">
                            <FaFileInvoice className="text-indigo-600" size={12} />
                            <span 
                              className="font-semibold"
                              style={{ color: 'var(--color-primary)' }}
                            >
                              {user.quotesCount || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-1" title="Consultations">
                            <FaComments className="text-pink-600" size={12} />
                            <span 
                              className="font-semibold"
                              style={{ color: 'var(--color-primary)' }}
                            >
                              {user.consultationsCount || 0}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          {user.role !== 'admin' ? (
                            <button
                              onClick={() => handleDelete(user._id, user.name)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete User"
                            >
                              <FaTrash size={14} />
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400 px-2 py-1">Admin</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-12 text-center">
                      <FaUsers className="mx-auto text-gray-400 mb-4" size={48} />
                      <h3 
                        className="text-lg font-bold mb-2"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        No users found
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {searchTerm ? 'Try adjusting your search terms' : 'No users registered yet'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
