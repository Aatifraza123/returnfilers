import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { 
  FaServicestack, 
  FaBlog, 
  FaEnvelope, 
  FaComments,
  FaArrowRight,
  FaChartLine,
  FaClock,
  FaCalendarAlt,
  FaFileInvoice,
  FaArrowUp,
  FaArrowDown,
  FaUsers,
  FaDollarSign,
  FaShoppingCart,
  FaEye,
  FaGlobe,
  FaChrome,
  FaFirefox,
  FaSafari,
  FaEdge
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import NotificationBell from '../../components/common/NotificationBell';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    services: 0,
    blogs: 0,
    consultations: 0,
    contact: 0,
    bookings: 0,
    quotes: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartPeriod, setChartPeriod] = useState('week'); // 'week' or 'month'

  // Get brand colors from settings or use defaults
  const primaryColor = settings?.brandColors?.primary || '#0B1530';
  const secondaryColor = settings?.brandColors?.secondary || '#C9A227';

  // Convert hex to RGB for Tailwind classes
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 11, g: 21, b: 48 }; // default navy blue
  };

  const primaryRgb = hexToRgb(primaryColor);
  const primaryColorStyle = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;
  const primaryColorLight = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`;
  const primaryColorMedium = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.6)`;
  const primaryColorDark = `rgba(${Math.max(0, primaryRgb.r - 20)}, ${Math.max(0, primaryRgb.g - 20)}, ${Math.max(0, primaryRgb.b - 20)}, 1)`;
  
  const secondaryRgb = hexToRgb(secondaryColor);
  const secondaryColorStyle = `rgb(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b})`;

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [servicesRes, blogsRes, consultRes, contactRes, bookingsRes, quotesRes] = await Promise.all([
        api.get('/admin/services', config).catch(() => ({ data: { services: [] } })),
        api.get('/admin/blogs', config).catch(() => ({ data: [] })),
        api.get('/consultations', config).catch(() => ({ data: { data: [] } })),
        api.get('/contacts', config).catch(() => ({ data: { data: [] } })),
        api.get('/bookings', config).catch(() => ({ data: { data: [] } })),
        api.get('/quotes', config).catch(() => ({ data: { data: [] } }))
      ]);

      const services = Array.isArray(servicesRes.data) ? servicesRes.data : (servicesRes.data.services || []);
      const blogs = Array.isArray(blogsRes.data) ? blogsRes.data : [];
      const consultations = consultRes?.data?.data || consultRes?.data?.consultations || [];
      const contacts = contactRes?.data?.data || contactRes?.data?.contacts || [];
      const bookings = bookingsRes?.data?.data || bookingsRes?.data?.bookings || [];
      const quotes = quotesRes?.data?.data || quotesRes?.data?.quotes || [];
      
      setStats({
        services: services.length,
        blogs: blogs.length,
        consultations: consultations.length,
        contact: contacts.length,
        bookings: bookings.length,
        quotes: quotes.length
      });

      const recent = [
        ...consultations.map(c => ({ 
          type: 'consultation', 
          name: c.name,
          detail: c.service || 'Consultation Request',
          time: c.createdAt,
          link: '/admin/consultations'
        })),
        ...contacts.map(c => ({ 
          type: 'contact', 
          name: c.name,
          detail: 'Contact Message',
          time: c.createdAt,
          link: '/admin/contacts'
        })),
        ...bookings.map(b => ({ 
          type: 'booking', 
          name: b.name,
          detail: b.service || 'Service Booking',
          time: b.createdAt,
          link: '/admin/bookings'
        })),
        ...quotes.map(q => ({ 
          type: 'quote', 
          name: q.name,
          detail: 'Quote Request',
          time: q.createdAt,
          link: '/admin/quotes'
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

      setRecentActivity(recent);
      
      // Calculate chart data based on period
      calculateChartData(bookings, quotes, consultations, contacts, chartPeriod);
      
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const calculateChartData = (bookings, quotes, consultations, contacts, period) => {
    const allData = [...bookings, ...quotes, ...consultations, ...contacts];
    const days = period === 'week' ? 7 : 30;
    const labels = [];
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      // Count items created on this date
      const count = allData.filter(item => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= date && itemDate < nextDate;
      }).length;

      if (period === 'week') {
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      } else {
        labels.push(date.getDate());
      }
      data.push(count);
    }

    // Calculate max for percentage
    const maxCount = Math.max(...data, 1);
    const percentages = data.map(count => Math.round((count / maxCount) * 100));

    setChartData({ labels, data, percentages, maxCount });
  };

  const handlePeriodChange = async (period) => {
    setChartPeriod(period);
    // Recalculate with existing data
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const [bookingsRes, quotesRes, consultRes, contactRes] = await Promise.all([
      api.get('/bookings', config).catch(() => ({ data: { data: [] } })),
      api.get('/quotes', config).catch(() => ({ data: { data: [] } })),
      api.get('/consultations', config).catch(() => ({ data: { data: [] } })),
      api.get('/contacts', config).catch(() => ({ data: { data: [] } }))
    ]);

    const bookings = bookingsRes?.data?.data || bookingsRes?.data?.bookings || [];
    const quotes = quotesRes?.data?.data || quotesRes?.data?.quotes || [];
    const consultations = consultRes?.data?.data || consultRes?.data?.consultations || [];
    const contacts = contactRes?.data?.data || contactRes?.data?.contacts || [];

    calculateChartData(bookings, quotes, consultations, contacts, period);
  };

  // Analytics data
  const analyticsCards = [
    { 
      title: 'Total Bookings',
      value: stats.bookings,
      change: '+12.5%',
      trend: 'up',
      icon: <FaShoppingCart className="text-xl" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      title: 'Total Quotes',
      value: stats.quotes,
      change: '+8.2%',
      trend: 'up',
      icon: <FaDollarSign className="text-xl" />,
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      title: 'Consultations',
      value: stats.consultations,
      change: '+23.1%',
      trend: 'up',
      icon: <FaUsers className="text-xl" />,
      color: 'from-blue-700 to-blue-800',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      title: 'Messages',
      value: stats.contact,
      change: '-2.4%',
      trend: 'down',
      icon: <FaEye className="text-xl" />,
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    }
  ];

  const browserData = [
    { name: 'Chrome', value: 45, color: 'bg-blue-500', icon: <FaChrome /> },
    { name: 'Safari', value: 28, color: 'bg-blue-600', icon: <FaSafari /> },
    { name: 'Firefox', value: 18, color: 'bg-blue-700', icon: <FaFirefox /> },
    { name: 'Edge', value: 9, color: 'bg-blue-400', icon: <FaEdge /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Premium Glassmorphic Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 border-b border-gray-200/50 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-slate-500 font-medium">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <NotificationBell type="admin" />
              
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30">
                <FaClock className="text-sm" />
                <span className="font-mono text-sm font-semibold">
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8">

        {/* Premium Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {analyticsCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="group"
            >
              <div className="relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                {/* Glassmorphic overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-all duration-300"></div>
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center ${card.textColor} group-hover:scale-110 transition-transform duration-300`}>
                      {card.icon}
                    </div>
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      card.trend === 'up' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'
                    }`}>
                      {card.trend === 'up' ? <FaArrowUp className="text-[10px]" /> : <FaArrowDown className="text-[10px]" />}
                      {card.change}
                    </div>
                  </div>
                  
                  <h3 className="text-slate-500 text-sm font-medium mb-2">{card.title}</h3>
                  <p className="text-3xl font-bold text-slate-900 mb-1">{card.value.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className={`h-1.5 flex-1 bg-gradient-to-r ${card.color} rounded-full`}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Chart Card - Glassmorphic */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Activity Overview</h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {chartPeriod === 'week' ? 'Last 7 days' : 'Last 30 days'} performance
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handlePeriodChange('week')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      chartPeriod === 'week' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Week
                  </button>
                  <button 
                    onClick={() => handlePeriodChange('month')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      chartPeriod === 'month' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Month
                  </button>
                </div>
              </div>
              
              {/* Real Data Chart Visualization */}
              <div className="relative h-64">
                {chartData.labels && chartData.labels.length > 0 ? (
                  <>
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-slate-400">
                      <span>{chartData.maxCount}</span>
                      <span>{Math.round(chartData.maxCount / 2)}</span>
                      <span>0</span>
                    </div>
                    
                    {/* Chart bars */}
                    <div className="absolute inset-0 left-8 bottom-8 flex items-end justify-between gap-2">
                      {chartData.percentages.map((percentage, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(percentage, 3)}%` }}
                            transition={{ delay: i * 0.05, duration: 0.6 }}
                            className="w-full rounded-t-lg relative group cursor-pointer transition-all shadow-sm"
                            style={{
                              background: `linear-gradient(to top, ${primaryColorStyle}, ${primaryColorMedium})`,
                              minHeight: '8px'
                            }}
                          >
                            {/* Tooltip on hover */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-10 shadow-lg">
                              <div className="font-semibold">{chartData.data[i]} {chartData.data[i] === 1 ? 'item' : 'items'}</div>
                            </div>
                            
                            {/* Value on top of bar */}
                            {chartData.data[i] > 0 && (
                              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-700">
                                {chartData.data[i]}
                              </div>
                            )}
                          </motion.div>
                          <span className="text-xs text-slate-500 font-medium truncate w-full text-center">
                            {chartData.labels[i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FaChartLine className="text-slate-400 text-2xl" />
                      </div>
                      <p className="text-sm text-slate-500">No data available</p>
                      <p className="text-xs text-slate-400 mt-1">Data will appear once you have activity</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Browser Stats - Donut Chart */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Browser Usage</h2>
            <p className="text-sm text-slate-500 mb-6">Traffic sources</p>
            
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-40 h-40">
                {/* Donut Chart */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {browserData.map((browser, i) => {
                    const total = browserData.reduce((sum, b) => sum + b.value, 0);
                    const percentage = (browser.value / total) * 100;
                    const offset = browserData.slice(0, i).reduce((sum, b) => sum + (b.value / total) * 100, 0);
                    const circumference = 2 * Math.PI * 35;
                    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = -((offset / 100) * circumference);
                    
                    const colorMap = {
                      'bg-blue-500': '#3b82f6',
                      'bg-blue-600': '#2563eb',
                      'bg-blue-700': '#1d4ed8',
                      'bg-blue-400': '#60a5fa'
                    };
                    
                    return (
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke={colorMap[browser.color]}
                        strokeWidth="12"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-300 hover:stroke-[14]"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">100%</p>
                    <p className="text-xs text-slate-500">Total</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {browserData.map((browser, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${browser.color} flex items-center justify-center text-white text-sm`}>
                      {browser.icon}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{browser.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{browser.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions - Neumorphic Style */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-200/50">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FaChartLine className="text-blue-500" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: 'Services', link: '/admin/services', icon: <FaServicestack />, color: 'from-blue-500 to-blue-600' },
                  { title: 'Blogs', link: '/admin/blogs', icon: <FaBlog />, color: 'from-blue-600 to-blue-700' },
                  { title: 'Messages', link: '/admin/contacts', icon: <FaEnvelope />, color: 'from-blue-700 to-blue-800' },
                  { title: 'Consults', link: '/admin/consultations', icon: <FaComments />, color: 'from-blue-400 to-blue-500' }
                ].map((action, i) => (
                  <Link
                    key={i}
                    to={action.link}
                    className="group relative overflow-hidden p-5 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 hover:from-white hover:to-slate-50 border border-slate-200/50 hover:border-slate-300 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center text-white text-lg mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                      {action.icon}
                    </div>
                    <p className="font-semibold text-slate-900 text-sm">{action.title}</p>
                    <FaArrowRight className="absolute bottom-4 right-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all text-xs" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity - Premium List */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FaClock className="text-blue-500" />
              Recent Activity
            </h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, idx) => (
                  <Link
                    key={idx}
                    to={activity.link}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'consultation' ? 'bg-blue-100 text-blue-600' : 
                      activity.type === 'contact' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'booking' ? 'bg-blue-100 text-blue-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {activity.type === 'consultation' ? <FaComments size={14} /> : 
                       activity.type === 'contact' ? <FaEnvelope size={14} /> :
                       activity.type === 'booking' ? <FaCalendarAlt size={14} /> :
                       <FaFileInvoice size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {activity.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{activity.detail}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(activity.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaClock className="text-slate-400 text-2xl" />
                  </div>
                  <p className="text-sm text-slate-500">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
