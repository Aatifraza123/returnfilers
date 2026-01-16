import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { 
  FaServicestack, 
  FaBlog, 
  FaEnvelope, 
  FaComments,
  FaUsers,
  FaFileInvoice,
  FaCalendarCheck,
  FaCog,
  FaDownload,
  FaFileExcel,
  FaFileCsv,
  FaChartLine,
  FaBell
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import NotificationBell from '../../components/common/NotificationBell';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [stats, setStats] = useState({
    services: 0,
    blogs: 0,
    consultations: 0,
    contacts: 0,
    bookings: 0,
    quotes: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('🔄 Fetching dashboard data...');
      
      const [services, blogs, consultations, contacts, bookings, quotes, users] = await Promise.all([
        api.get('/services'),
        api.get('/blogs'),
        api.get('/consultations'),
        api.get('/contacts'),
        api.get('/bookings'),
        api.get('/quotes'),
        api.get('/users/stats')
      ]);

      console.log('✅ Users stats response:', users.data);

      setStats({
        services: services.data.services?.length || services.data.length || 0,
        blogs: blogs.data.blogs?.length || blogs.data.length || 0,
        consultations: consultations.data.consultations?.length || consultations.data.length || 0,
        contacts: contacts.data.contacts?.length || contacts.data.length || 0,
        bookings: bookings.data.bookings?.length || bookings.data.length || 0,
        quotes: quotes.data.quotes?.length || quotes.data.length || 0,
        users: users.data.stats?.totalUsers || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      console.error('Error response:', error.response?.data);
      
      // Set default values even if API fails
      setStats({
        services: 0,
        blogs: 0,
        consultations: 0,
        contacts: 0,
        bookings: 0,
        quotes: 0,
        users: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Export Functions
  const exportToCSV = async (type) => {
    try {
      toast.loading('Exporting data...');
      let data = [];
      let filename = '';
      
      switch(type) {
        case 'bookings':
          const bookingsRes = await api.get('/bookings');
          data = bookingsRes.data.bookings || bookingsRes.data;
          filename = 'bookings_export.csv';
          break;
        case 'consultations':
          const consultRes = await api.get('/consultations');
          data = consultRes.data.consultations || consultRes.data;
          filename = 'consultations_export.csv';
          break;
        case 'quotes':
          const quotesRes = await api.get('/quotes');
          data = quotesRes.data.quotes || quotesRes.data;
          filename = 'quotes_export.csv';
          break;
        case 'contacts':
          const contactsRes = await api.get('/contacts');
          data = contactsRes.data.contacts || contactsRes.data;
          filename = 'contacts_export.csv';
          break;
        default:
          toast.dismiss();
          toast.error('Invalid export type');
          return;
      }

      if (!data || data.length === 0) {
        toast.dismiss();
        toast.error('No data to export');
        return;
      }

      // Convert to CSV
      const headers = Object.keys(data[0]).filter(key => key !== '__v' && key !== 'password');
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            let value = row[header];
            if (value === null || value === undefined) return '';
            if (typeof value === 'object') value = JSON.stringify(value);
            value = String(value).replace(/"/g, '""');
            return `"${value}"`;
          }).join(',')
        )
      ].join('\n');

      // Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      
      toast.dismiss();
      toast.success('Data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.dismiss();
      toast.error('Failed to export data');
    }
  };

  const exportAllData = async () => {
    try {
      toast.loading('Exporting all data...');
      
      const [bookings, consultations, quotes, contacts] = await Promise.all([
        api.get('/bookings'),
        api.get('/consultations'),
        api.get('/quotes'),
        api.get('/contacts')
      ]);

      const allData = {
        bookings: bookings.data.bookings || bookings.data || [],
        consultations: consultations.data.consultations || consultations.data || [],
        quotes: quotes.data.quotes || quotes.data || [],
        contacts: contacts.data.contacts || contacts.data || []
      };

      // Create comprehensive CSV
      let csvContent = '';
      
      Object.keys(allData).forEach(type => {
        const data = allData[type];
        if (data.length > 0) {
          csvContent += `\n\n=== ${type.toUpperCase()} ===\n`;
          const headers = Object.keys(data[0]).filter(key => key !== '__v' && key !== 'password');
          csvContent += headers.join(',') + '\n';
          csvContent += data.map(row => 
            headers.map(header => {
              let value = row[header];
              if (value === null || value === undefined) return '';
              if (typeof value === 'object') value = JSON.stringify(value);
              value = String(value).replace(/"/g, '""');
              return `"${value}"`;
            }).join(',')
          ).join('\n');
        }
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `all_data_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      toast.dismiss();
      toast.success('All data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.dismiss();
      toast.error('Failed to export data');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const statsCards = [
    { title: 'Users', value: stats.users, icon: <FaUsers />, color: 'blue', link: '/admin/users' },
    { title: 'Services', value: stats.services, icon: <FaServicestack />, color: 'green', link: '/admin/services' },
    { title: 'Blogs', value: stats.blogs, icon: <FaBlog />, color: 'purple', link: '/admin/blogs' },
    { title: 'Bookings', value: stats.bookings, icon: <FaCalendarCheck />, color: 'orange', link: '/admin/bookings' },
    { title: 'Consultations', value: stats.consultations, icon: <FaComments />, color: 'pink', link: '/admin/consultations' },
    { title: 'Quotes', value: stats.quotes, icon: <FaFileInvoice />, color: 'indigo', link: '/admin/quotes' },
    { title: 'Contacts', value: stats.contacts, icon: <FaEnvelope />, color: 'teal', link: '/admin/contacts' },
  ];

  const quickActions = [
    { title: 'Manage Users', link: '/admin/users', icon: <FaUsers />, desc: 'View and manage users' },
    { title: 'Manage Services', link: '/admin/services', icon: <FaServicestack />, desc: 'Add or edit services' },
    { title: 'Manage Blogs', link: '/admin/blogs', icon: <FaBlog />, desc: 'Create and publish blogs' },
    { title: 'View Bookings', link: '/admin/bookings', icon: <FaCalendarCheck />, desc: 'Manage service bookings' },
    { title: 'View Consultations', link: '/admin/consultations', icon: <FaComments />, desc: 'Review consultation requests' },
    { title: 'View Quotes', link: '/admin/quotes', icon: <FaFileInvoice />, desc: 'Manage quote requests' },
    { title: 'View Contacts', link: '/admin/contacts', icon: <FaEnvelope />, desc: 'View contact messages' },
    { title: 'Settings', link: '/admin/settings', icon: <FaCog />, desc: 'Configure system settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <NotificationBell type="admin" />
              <Link
                to="/admin/settings"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Settings"
              >
                <FaCog size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsCards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${card.color}-50 rounded-lg flex items-center justify-center text-${card.color}-600`}>
                  {card.icon}
                </div>
                <FaChartLine className="text-gray-400" size={16} />
              </div>
              <p className="text-sm text-gray-600 mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </Link>
          ))}
        </div>

        {/* Export Section */}
        <div className="bg-blue-600 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <FaDownload />
                Export Data for Analysis
              </h3>
              <p className="text-blue-100 text-sm">
                Download data in CSV format for analysis and visualization
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => exportToCSV('bookings')}
                className="px-4 py-2 bg-white text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <FaFileExcel size={14} />
                Bookings
              </button>
              <button
                onClick={() => exportToCSV('consultations')}
                className="px-4 py-2 bg-white text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <FaFileExcel size={14} />
                Consultations
              </button>
              <button
                onClick={() => exportToCSV('quotes')}
                className="px-4 py-2 bg-white text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <FaFileExcel size={14} />
                Quotes
              </button>
              <button
                onClick={() => exportToCSV('contacts')}
                className="px-4 py-2 bg-white text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <FaFileExcel size={14} />
                Contacts
              </button>
              <button
                onClick={exportAllData}
                className="px-4 py-2 bg-yellow-400 text-blue-900 rounded-lg font-bold text-sm hover:bg-yellow-300 transition-colors flex items-center gap-2"
              >
                <FaFileCsv size={14} />
                Export All
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-900 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 group-hover:bg-gray-900 group-hover:text-white transition-colors mb-3">
                  {action.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
