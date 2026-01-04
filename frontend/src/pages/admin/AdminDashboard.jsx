import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { 
  FaServicestack, 
  FaBlog, 
  FaEnvelope, 
  FaPlus, 
  FaArrowRight, 
  FaBriefcase,
  FaComments,
  FaArrowUp,
  FaClock,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    services: 0,
    blogs: 0,
    consultations: 0,
    portfolio: 0,
    contact: 0
  });
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    // Refresh data every 15 seconds for real-time updates
    const interval = setInterval(fetchDashboardData, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [servicesRes, blogsRes, consultRes, contactRes, portfolioRes, quotesRes] = await Promise.all([
        api.get('/admin/services', config).catch(() => ({ data: { services: [] } })),
        api.get('/admin/blogs', config).catch(() => ({ data: [] })),
        api.get('/consultations', config).catch(() => ({ data: { data: [] } })),
        api.get('/contacts', config).catch(() => ({ data: { data: [] } })),
        api.get('/portfolio', config).catch(() => ({ data: { portfolio: [] } })),
        api.get('/quotes', config).catch(() => ({ data: [] }))
      ]);

      // Handle different response formats from different endpoints
      const services = Array.isArray(servicesRes.data) 
        ? servicesRes.data 
        : (servicesRes.data.services || []);
      
      // Admin blogs returns array directly
      const blogs = Array.isArray(blogsRes.data) ? blogsRes.data : [];
      
      // Handle different response formats
      const consultations = consultRes?.data?.data || consultRes?.data?.consultations || [];
      const contacts = contactRes?.data?.data || contactRes?.data?.contacts || [];
      const quotes = Array.isArray(quotesRes.data) ? quotesRes.data : (quotesRes.data?.quotes || []);
      
      console.log('Dashboard - Consultations:', consultations.length, '| Contacts:', contacts.length, '| Quotes:', quotes.length);
      
      // Portfolio
      const portfolio = portfolioRes.data.portfolio || [];

      setStats({
        services: services.length,
        blogs: blogs.length,
        consultations: consultations.length,
        portfolio: portfolio.length,
        contact: contacts.length
      });

      // Set recent activity - combine all recent items
      const recent = [
        ...consultations.map(c => ({ 
          type: 'consultation', 
          name: c.name,
          detail: c.service || 'Consultation Request',
          status: c.status,
          time: c.createdAt,
          link: '/admin/consultations'
        })),
        ...contacts.map(c => ({ 
          type: 'contact', 
          name: c.name,
          detail: c.message?.substring(0, 50) + '...' || 'Contact Message',
          status: c.status,
          time: c.createdAt,
          link: '/admin/contacts'
        })),
        ...quotes.map(q => ({ 
          type: 'quote', 
          name: q.name,
          detail: q.service || 'Quote Request',
          status: q.status,
          time: q.createdAt,
          link: '/admin/quotes'
        })),
        ...blogs.slice(0, 5).map(b => ({ 
          type: 'blog', 
          name: b.title,
          detail: 'Blog Published',
          status: 'published',
          time: b.createdAt,
          link: '/admin/blogs'
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

      setRecentActivity(recent);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
        setIsInitialLoad(false);
      }
    }
  };

  const statCards = [
    { 
      title: 'Total Services', 
      count: stats.services, 
      icon: <FaServicestack />, 
      color: 'from-blue-500 to-blue-600', 
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      link: '/admin/services',
      trend: '+12%'
    },
    { 
      title: 'Published Blogs', 
      count: stats.blogs, 
      icon: <FaBlog />, 
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      link: '/admin/blogs',
      trend: '+5%'
    },
    { 
      title: 'Consultations', 
      count: stats.consultations, 
      icon: <FaComments />, 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      link: '/admin/consultations',
      trend: '+23%'
    },
    { 
      title: 'Portfolio Items', 
      count: stats.portfolio, 
      icon: <FaBriefcase />, 
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      link: '/admin/portfolio',
      trend: '+3%'
    },
    { 
      title: 'Contact Messages', 
      count: stats.contact, 
      icon: <FaEnvelope />, 
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
      link: '/admin/contacts',
      trend: '+15%'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#0B1530] to-[#1a2b5e] rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name || 'Admin'}! 👋
            </h1>
            <p className="text-gray-300">
              Here's what's happening with your business today.
            </p>
          </div>
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#C9A227] text-[#0B1530] rounded-lg font-semibold hover:bg-white transition-colors shadow-lg"
          >
            <FaExternalLinkAlt size={14} />
            Visit Website
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <Link 
            key={idx} 
            to={card.link}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-4 rounded-xl ${card.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                <span className={`text-2xl ${card.iconColor}`}>
                  {card.icon}
                </span>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[#0B1530] mb-1">
                  {loading ? (
                    <span className="inline-block w-8 h-8 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    card.count
                  )}
                </p>
                <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                  <FaArrowUp className="text-xs" />
                  <span>{card.trend}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <h3 className="text-gray-600 font-medium">{card.title}</h3>
              <FaArrowRight className="text-gray-300 group-hover:text-[#0B1530] group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#0B1530] mb-6 flex items-center gap-2">
            <FaPlus className="text-[#C9A227]" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              to="/admin/services/add" 
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-[#C9A227] hover:bg-[#C9A227]/5 transition-all group"
            >
              <div className="bg-blue-100 text-blue-600 p-3 rounded-lg group-hover:scale-110 transition-transform">
                <FaPlus />
              </div>
              <div>
                <p className="font-semibold text-[#0B1530]">Add Service</p>
                <p className="text-xs text-gray-500">Create new service</p>
              </div>
            </Link>

            <Link 
              to="/admin/blogs" 
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-[#C9A227] hover:bg-[#C9A227]/5 transition-all group"
            >
              <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg group-hover:scale-110 transition-transform">
                <FaBlog />
              </div>
              <div>
                <p className="font-semibold text-[#0B1530]">Write Blog</p>
                <p className="text-xs text-gray-500">Publish new article</p>
              </div>
            </Link>

            <Link 
              to="/admin/consultations" 
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-[#C9A227] hover:bg-[#C9A227]/5 transition-all group"
            >
              <div className="bg-green-100 text-green-600 p-3 rounded-lg group-hover:scale-110 transition-transform">
                <FaComments />
              </div>
              <div>
                <p className="font-semibold text-[#0B1530]">View Messages</p>
                <p className="text-xs text-gray-500">Check consultations</p>
              </div>
            </Link>

            <Link 
              to="/admin/portfolio" 
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-[#C9A227] hover:bg-[#C9A227]/5 transition-all group"
            >
              <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg group-hover:scale-110 transition-transform">
                <FaBriefcase />
              </div>
              <div>
                <p className="font-semibold text-[#0B1530]">Portfolio</p>
                <p className="text-xs text-gray-500">Manage portfolio</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#0B1530] mb-6 flex items-center gap-2">
            <FaClock className="text-[#C9A227]" />
            Recent Activity
          </h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, idx) => (
                <Link 
                  key={idx} 
                  to={activity.link}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 ${
                    activity.type === 'consultation' ? 'bg-green-500' : 
                    activity.type === 'contact' ? 'bg-pink-500' :
                    activity.type === 'quote' ? 'bg-purple-500' :
                    'bg-yellow-500'
                  }`}>
                    {activity.type === 'consultation' ? <FaComments size={14} /> : 
                     activity.type === 'contact' ? <FaEnvelope size={14} /> :
                     activity.type === 'quote' ? <FaBriefcase size={14} /> :
                     <FaBlog size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#0B1530] truncate">
                        {activity.name}
                      </p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        activity.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                        activity.status === 'completed' || activity.status === 'published' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {activity.status || 'new'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{activity.detail}</p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(activity.time).toLocaleString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-8">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
