import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { FaUser, FaEnvelope, FaPhone, FaStar, FaFilter, FaPaperPlane, FaChartLine } from 'react-icons/fa';

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', priority: '', source: '' });
  const [selectedLead, setSelectedLead] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [filter]);

  const fetchLeads = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.priority) params.append('priority', filter.priority);
      if (filter.source) params.append('source', filter.source);

      const { data } = await axios.get(`/leads?${params.toString()}`);
      setLeads(data.data);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/leads/stats');
      setStats(data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleSendFollowUp = async (leadId) => {
    try {
      await axios.post(`/leads/${leadId}/follow-up`);
      alert('Follow-up email sent successfully!');
      fetchLeads();
    } catch (error) {
      alert('Failed to send follow-up email');
    }
  };

  const handleUpdateLead = async (leadId, updates) => {
    try {
      await axios.patch(`/leads/${leadId}`, updates);
      alert('Lead updated successfully!');
      fetchLeads();
      setShowModal(false);
    } catch (error) {
      alert('Failed to update lead');
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-blue-100 text-blue-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-purple-100 text-purple-800',
      contacted: 'bg-blue-100 text-blue-800',
      qualified: 'bg-green-100 text-green-800',
      proposal: 'bg-yellow-100 text-yellow-800',
      negotiation: 'bg-orange-100 text-orange-800',
      won: 'bg-green-600 text-white',
      lost: 'bg-gray-400 text-white'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lead Management</h1>
        <button
          onClick={() => fetchLeads()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Leads</p>
                <p className="text-2xl font-bold">{stats.totalLeads}</p>
              </div>
              <FaChartLine className="text-blue-500 text-3xl" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">New Leads</p>
                <p className="text-2xl font-bold">{stats.newLeads}</p>
              </div>
              <FaUser className="text-purple-500 text-3xl" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold">{stats.conversionRate}%</p>
              </div>
              <FaStar className="text-yellow-500 text-3xl" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Avg Score</p>
                <p className="text-2xl font-bold">{stats.averageScore}</p>
              </div>
              <FaChartLine className="text-green-500 text-3xl" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FaFilter className="text-gray-600" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
          <select
            value={filter.priority}
            onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={filter.source}
            onChange={(e) => setFilter({ ...filter, source: e.target.value })}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">All Sources</option>
            <option value="contact_form">Contact Form</option>
            <option value="quote_request">Quote Request</option>
            <option value="booking">Booking</option>
            <option value="appointment">Appointment</option>
            <option value="chatbot">Chatbot</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Services</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <FaUser className="text-gray-400" />
                      <span className="font-medium">{lead.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <FaEnvelope className="text-xs" />
                      <span>{lead.email}</span>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <FaPhone className="text-xs" />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {lead.score}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(lead.priority)}`}>
                    {lead.priority.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {lead.source.replace('_', ' ')}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">
                    {lead.interestedServices.slice(0, 2).join(', ')}
                    {lead.interestedServices.length > 2 && ` +${lead.interestedServices.length - 2}`}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedLead(lead);
                        setShowModal(true);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleSendFollowUp(lead._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center gap-1"
                    >
                      <FaPaperPlane className="text-xs" />
                      Follow-up
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lead Detail Modal */}
      {showModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedLead.name}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => setSelectedLead({ ...selectedLead, status: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={selectedLead.notes}
                    onChange={(e) => setSelectedLead({ ...selectedLead, notes: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    rows="4"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Lead Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Email:</strong> {selectedLead.email}</p>
                    <p><strong>Phone:</strong> {selectedLead.phone || 'N/A'}</p>
                    <p><strong>Score:</strong> {selectedLead.score}</p>
                    <p><strong>Priority:</strong> {selectedLead.priority}</p>
                    <p><strong>Budget:</strong> {selectedLead.budget}</p>
                    <p><strong>Follow-ups:</strong> {selectedLead.followUpCount}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Activities ({selectedLead.activities.length})</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedLead.activities.slice(-5).reverse().map((activity, idx) => (
                      <div key={idx} className="text-sm border-l-2 border-blue-500 pl-3">
                        <p className="font-medium">{activity.type.replace('_', ' ')}</p>
                        <p className="text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdateLead(selectedLead._id, {
                      status: selectedLead.status,
                      notes: selectedLead.notes
                    })}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeads;
