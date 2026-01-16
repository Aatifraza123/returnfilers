import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaFileInvoice, FaEnvelope, FaPhone, FaBuilding,
  FaClock, FaCheckCircle, FaTimesCircle, FaDollarSign,
  FaSpinner, FaArrowLeft
} from 'react-icons/fa';
import UserAuthContext from '../../context/UserAuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

const MyQuotes = () => {
  const { user, token } = useContext(UserAuthContext);
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchQuotes();
  }, [user, navigate]);

  const fetchQuotes = async () => {
    try {
      const { data } = await api.get('/quotes/my-quotes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.success) {
        setQuotes(data.quotes);
      }
    } catch (error) {
      console.error('Fetch quotes error:', error);
      toast.error('Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'converted':
        return <FaCheckCircle className="text-green-500" />;
      case 'quoted':
        return <FaFileInvoice className="text-blue-500" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-500" />;
      case 'contacted':
        return <FaSpinner className="text-purple-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'converted':
        return 'bg-green-100 text-green-800';
      case 'quoted':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'contacted':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading quotes..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-primary">My Quotes</h1>
          <p className="text-gray-600 mt-2">View all your quote requests</p>
        </div>

        {/* Quotes List */}
        {quotes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <FaFileInvoice className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Quotes Yet</h3>
            <p className="text-gray-500 mb-6">You haven't requested any quotes yet.</p>
            <button
              onClick={() => navigate('/quote')}
              className="px-6 py-3 bg-secondary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Request Quote
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {quotes.map((quote, index) => (
              <motion.div
                key={quote._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                {/* Quote Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-1">{quote.service}</h3>
                    <p className="text-sm text-gray-500">
                      Requested on {new Date(quote.createdAt).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(quote.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(quote.status)}`}>
                      {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Quote Details */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaEnvelope className="text-secondary" />
                      <span className="text-sm">{quote.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaPhone className="text-secondary" />
                      <span className="text-sm">{quote.phone}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {quote.company && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaBuilding className="text-secondary" />
                        <span className="text-sm">{quote.company}</span>
                      </div>
                    )}
                    {quote.budget && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaDollarSign className="text-secondary" />
                        <span className="text-sm">Budget: {quote.budget}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message */}
                {quote.message && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-primary">Message:</span> {quote.message}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQuotes;
