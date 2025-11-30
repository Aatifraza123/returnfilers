import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { FaCreditCard, FaCheckCircle, FaTimesCircle, FaClock, FaUndo, FaSearch, FaFilter } from 'react-icons/fa'
import Loader from '../../components/common/Loader'

const AdminPayments = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchPayments()
    // Refresh every 15 seconds for real-time updates
    const interval = setInterval(fetchPayments, 15000)
    return () => clearInterval(interval)
  }, [])

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token')
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const { data } = await axios.get('http://localhost:5000/api/payments', config)
      setPayments(data.payments || [])
      console.log('Fetched payments:', data.payments?.length || 0)
    } catch (error) {
      console.error('Error fetching payments:', error)
      if (payments.length === 0) {
        toast.error('Failed to fetch payments')
      }
    } finally {
      if (isInitialLoad) {
        setLoading(false)
        setIsInitialLoad(false)
      }
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.customerDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerDetails?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.razorpayPaymentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.serviceName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'captured': return <FaCheckCircle className="text-green-600" />
      case 'failed': return <FaTimesCircle className="text-red-600" />
      case 'refunded': return <FaUndo className="text-blue-600" />
      default: return <FaClock className="text-yellow-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'captured': return 'bg-green-100 text-green-800 border-green-200'
      case 'failed': return 'bg-red-100 text-red-800 border-red-200'
      case 'refunded': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading payments...</p>
        </div>
      </div>
    )
  }

  const totalRevenue = payments
    .filter(p => p.status === 'captured')
    .reduce((sum, p) => sum + (p.amount || 0), 0)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1530] mb-1">Payment Management</h1>
          <p className="text-sm text-gray-600">View and manage all payment transactions</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Total Revenue: <span className="font-bold text-[#0B1530]">₹{totalRevenue.toLocaleString()}</span>
          </div>
          <button
            onClick={() => {
              setIsInitialLoad(true)
              setLoading(true)
              fetchPayments()
            }}
            className="px-3 py-1.5 bg-[#0B1530] text-white text-sm rounded-lg hover:bg-[#1a2b5e] transition-colors flex items-center gap-2"
          >
            <span>🔄</span> Refresh
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by customer name, email, payment ID, service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400 text-sm" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="captured">Captured</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Service</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Payment ID</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-gray-500 text-xs">
                      {payment.createdAt 
                        ? format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')
                        : 'N/A'
                      }
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-[#0B1530] text-sm">
                        {payment.customerDetails?.name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {payment.customerDetails?.email || ''}
                      </div>
                      {payment.customerDetails?.phone && (
                        <div className="text-xs text-gray-500">
                          {payment.customerDetails.phone}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700 block">
                          {payment.serviceName || 'General Payment'}
                        </span>
                        {payment.serviceCategory && (
                          <span className="text-xs text-gray-500 mt-1 inline-block">
                            {payment.serviceCategory}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-lg font-bold text-[#0B1530]">
                        ₹{(payment.amount || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-xs font-mono text-gray-600">
                        {payment.razorpayPaymentId || payment.razorpayOrderId || 'N/A'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status || 'pending'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        {payment.status === 'captured' && (
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to refund this payment?')) {
                                toast.info('Refund feature coming soon')
                              }
                            }}
                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded text-xs font-medium hover:bg-red-100 transition-colors flex items-center gap-1"
                          >
                            <FaUndo className="text-xs" />
                            Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    {searchTerm ? 'No payments found matching your search' : 'No payments yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Payments</p>
              <p className="text-2xl font-bold text-[#0B1530]">{payments.length}</p>
            </div>
            <FaCreditCard className="text-3xl text-[#D4AF37]" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <FaCheckCircle className="text-3xl text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Successful</p>
              <p className="text-2xl font-bold text-green-600">
                {payments.filter(p => p.status === 'captured').length}
              </p>
            </div>
            <FaCheckCircle className="text-3xl text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {payments.filter(p => p.status === 'pending').length}
              </p>
            </div>
            <FaClock className="text-3xl text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPayments
