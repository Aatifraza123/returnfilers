import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { 
  FaEnvelope, 
  FaPhone, 
  FaTrash, 
  FaEye,
  FaSearch,
  FaBriefcase,
  FaClock,
  FaPaperPlane
} from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminEmails = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showBulkEmailModal, setShowBulkEmailModal] = useState(false);
  const [bulkEmailData, setBulkEmailData] = useState({
    subject: '',
    message: '',
    template: 'blank'
  });
  const [sendingBulkEmail, setSendingBulkEmail] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all', 'contact', 'consultation', 'newsletter'

  // Email templates
  const emailTemplates = {
    blank: {
      subject: '',
      message: ''
    },
    welcome: {
      subject: 'Welcome to CA Associates',
      message: `
        <h2 style="color: #0B1530;">Welcome!</h2>
        <p>Thank you for reaching out to CA Associates. We're excited to work with you!</p>
        <p>Our team of professional chartered accountants is dedicated to providing you with exceptional service.</p>
        <p>We will be in touch with you soon.</p>
        <br>
        <p>Best regards,<br><strong>CA Associates Team</strong></p>
      `
    },
    followup: {
      subject: 'Following up on your inquiry',
      message: `
        <h2 style="color: #0B1530;">Following Up</h2>
        <p>We wanted to follow up regarding your recent inquiry with CA Associates.</p>
        <p>If you have any questions or need further assistance, please don't hesitate to reach out to us.</p>
        <p>We're here to help!</p>
        <br>
        <p>Best regards,<br><strong>CA Associates Team</strong></p>
      `
    },
    thankyou: {
      subject: 'Thank you for choosing CA Associates',
      message: `
        <h2 style="color: #0B1530;">Thank You!</h2>
        <p>We sincerely appreciate you choosing CA Associates for your financial needs.</p>
        <p>Your trust in our services means a lot to us, and we're committed to delivering the best results.</p>
        <p>If you have any questions, feel free to contact us anytime.</p>
        <br>
        <p>Best regards,<br><strong>CA Associates Team</strong></p>
      `
    },
    reminder: {
      subject: 'Reminder: Important Update from CA Associates',
      message: `
        <h2 style="color: #0B1530;">Reminder</h2>
        <p>This is a friendly reminder regarding your pending matters with CA Associates.</p>
        <p>Please review the details and let us know if you need any clarification.</p>
        <p>We're here to assist you!</p>
        <br>
        <p>Best regards,<br><strong>CA Associates Team</strong></p>
      `
    },
    newsletter: {
      subject: 'CA Associates Newsletter - Latest Updates',
      message: `
        <h2 style="color: #0B1530;">Newsletter</h2>
        <p>Welcome to our latest newsletter!</p>
        <p>Here are some important updates and insights from CA Associates:</p>
        <ul>
          <li>Tax planning tips for the upcoming quarter</li>
          <li>Recent regulatory changes</li>
          <li>New services we're offering</li>
        </ul>
        <p>Stay informed and reach out if you need any assistance.</p>
        <br>
        <p>Best regards,<br><strong>CA Associates Team</strong></p>
      `
    }
  };

  useEffect(() => {
    fetchEmails();
    // Refresh every 15 seconds for real-time updates
    const interval = setInterval(fetchEmails, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchEmails = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Fetch consultations, contacts, and newsletter subscribers
      const [consultationsRes, contactsRes, newsletterRes] = await Promise.all([
        api.get('/consultations', config).catch(() => ({ data: { consultations: [] } })),
        api.get('/contacts', config).catch(() => ({ data: { contacts: [] } })),
        api.get('/newsletter', config).catch(() => ({ data: { subscribers: [] } }))
      ]);
      
      const consultations = consultationsRes.data.consultations || [];
      const contacts = contactsRes.data.contacts || [];
      const newsletters = newsletterRes.data.subscribers || [];
      
      console.log('📧 Fetched data:', {
        consultations: consultations.length,
        contacts: contacts.length,
        newsletters: newsletters.length
      });
      
      // Combine all and mark type with proper field mapping
      const allEmails = [
        ...consultations.map(c => ({ 
          ...c, 
          emailType: 'consultation', 
          name: c.name || 'N/A',
          topic: c.service || '-', // Map service to topic for display
          message: c.message || '-'
        })),
        ...contacts.map(c => ({ 
          ...c, 
          emailType: 'contact', 
          name: c.name || 'N/A',
          topic: '-', // Contacts don't have topic/service
          message: c.message || '-'
        })),
        ...newsletters.map(n => ({ 
          ...n, 
          emailType: 'newsletter', 
          name: 'Newsletter Subscriber',
          topic: 'Newsletter',
          message: '-',
          email: n.email || n._id
        }))
      ].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      
      setEmails(allEmails);
    } catch (error) {
      console.error('Error fetching emails:', error);
      if (emails.length === 0) {
        toast.error('Failed to fetch emails');
      }
      // Don't clear emails on error
    } finally {
      if (isInitialLoad) {
        setLoading(false);
        setIsInitialLoad(false);
      }
    }
  };

  const handleDelete = async (id, emailType) => {
    if (!window.confirm('Are you sure you want to delete this email?')) return;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Delete from appropriate endpoint based on type
      let endpoint = '';
      if (emailType === 'contact') {
        endpoint = `/contacts/${id}`;
      } else if (emailType === 'consultation') {
        endpoint = `/consultations/${id}`;
      } else if (emailType === 'newsletter') {
        endpoint = `/newsletter/${id}`;
      }
      
      await api.delete(endpoint, config);
      toast.success('Email deleted');
      fetchEmails();
    } catch (error) {
      toast.error('Failed to delete email');
    }
  };

  const handleTemplateChange = (templateName) => {
    const template = emailTemplates[templateName];
    setBulkEmailData({
      template: templateName,
      subject: template.subject,
      message: template.message
    });
  };

  const handleSendBulkEmail = async () => {
    if (!bulkEmailData.subject || !bulkEmailData.message) {
      toast.error('Please enter subject and message');
      return;
    }

    const filteredEmailsList = getFilteredEmails();
    
    if (filteredEmailsList.length === 0) {
      toast.error('No recipients found');
      return;
    }

    if (!window.confirm(`Send email to ${filteredEmailsList.length} recipients?`)) return;

    setSendingBulkEmail(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const recipients = filteredEmailsList.map(e => ({
        email: e.email,
        name: e.name
      }));

      await api.post('/contacts/bulk-email', {
        recipients,
        subject: bulkEmailData.subject,
        message: bulkEmailData.message
      }, config);

      toast.success('Bulk email sent successfully!');
      setShowBulkEmailModal(false);
      setBulkEmailData({ subject: '', message: '', template: 'blank' });
    } catch (error) {
      console.error('Bulk email error:', error);
      toast.error(error.response?.data?.message || 'Failed to send bulk email');
    } finally {
      setSendingBulkEmail(false);
    }
  };

  const getFilteredEmails = () => {
    let filtered = emails;
    
    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(email => email.emailType === filterType);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(email => {
        return (
          email.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.message?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    
    return filtered;
  };

  const filteredEmails = getFilteredEmails();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading emails...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1530] mb-1">Emails</h1>
          <p className="text-sm text-gray-600">View all email inquiries and consultation requests</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            Total: <span className="font-bold text-[#0B1530]">{filteredEmails.length}</span>
          </div>
          <button
            onClick={() => setShowBulkEmailModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C5A028] transition-colors text-sm font-medium"
          >
            <FaPaperPlane className="text-sm" />
            Send Bulk Email
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Type Filter Dropdown */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-sm min-w-[200px]"
          >
            <option value="all">All Emails ({emails.length})</option>
            <option value="contact">Contacts ({emails.filter(e => e.emailType === 'contact').length})</option>
            <option value="consultation">Consultations ({emails.filter(e => e.emailType === 'consultation').length})</option>
            <option value="newsletter">Newsletter ({emails.filter(e => e.emailType === 'newsletter').length})</option>
          </select>

          {/* Search */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by name, email, phone, topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Emails Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Name</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Topic/Service</th>
                <th className="p-3">Message</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEmails.length > 0 ? (
                filteredEmails.map((email) => (
                  <tr key={email._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-gray-500 text-xs">
                      {email.createdAt 
                        ? format(new Date(email.createdAt), 'MMM dd, yyyy')
                        : 'N/A'
                      }
                    </td>
                    <td className="p-3 font-medium text-[#0B1530] text-sm">
                      <div className="flex items-center gap-2">
                        {email.name}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          email.emailType === 'newsletter' ? 'bg-purple-100 text-purple-700' :
                          email.emailType === 'consultation' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {email.emailType === 'newsletter' ? 'Newsletter' :
                           email.emailType === 'consultation' ? 'Consultation' :
                           'Contact'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-xs text-gray-900">{email.email}</div>
                      {email.phone && (
                        <div className="text-xs text-gray-500">{email.phone}</div>
                      )}
                    </td>
                    <td className="p-3">
                      {email.topic && email.topic !== '-' ? (
                        <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          <FaBriefcase className="text-xs" />
                          {email.topic}
                        </span>
                      ) : email.emailType === 'newsletter' ? (
                        <span className="text-xs text-gray-400">Newsletter</span>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-3 text-gray-600 text-xs max-w-xs truncate" title={email.message && email.message !== '-' ? email.message : ''}>
                      {email.message && email.message !== '-' ? (
                        <span className="line-clamp-2">{email.message}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        email.status === 'closed' ? 'bg-green-100 text-green-800' :
                        email.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {email.status || 'pending'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedEmail(email)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <FaEye className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(email._id, email.emailType)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    {searchTerm ? 'No emails found matching your search' : 'No emails yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEmail(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#0B1530]">Email Details</h2>
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Name</label>
                  <p className="text-[#0B1530] font-semibold">{selectedEmail.name}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Email</label>
                  <p className="text-[#0B1530]">{selectedEmail.email}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Phone</label>
                  <p className="text-[#0B1530]">{selectedEmail.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Date</label>
                  <p className="text-[#0B1530] text-sm">
                    {selectedEmail.createdAt 
                      ? format(new Date(selectedEmail.createdAt), 'PPpp')
                      : 'Unknown'
                    }
                  </p>
                </div>
                {selectedEmail.topic && (
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Topic/Service</label>
                    <p className="text-[#0B1530] font-semibold">{selectedEmail.topic}</p>
                  </div>
                )}
              </div>
              {selectedEmail.message && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Message</label>
                  <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-[#D4AF37]">
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {selectedEmail.message}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setSelectedEmail(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Close
              </button>
              <a
                href={`mailto:${selectedEmail.email}`}
                className="px-4 py-2 bg-[#0B1530] text-white rounded-lg hover:bg-[#1a2b5e] transition-colors text-sm"
              >
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Email Modal */}
      {showBulkEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowBulkEmailModal(false)}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#0B1530]">Send Bulk Email</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Send email to {filteredEmails.length} recipients 
                    {filterType !== 'all' && <span className="font-semibold"> ({filterType})</span>}
                  </p>
                </div>
                <button
                  onClick={() => setShowBulkEmailModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-3xl"
                  disabled={sendingBulkEmail}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* Recipient Type Selector */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Send To
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent bg-white"
                  disabled={sendingBulkEmail}
                >
                  <option value="all">All Recipients ({emails.length})</option>
                  <option value="contact">Contacts Only ({emails.filter(e => e.emailType === 'contact').length})</option>
                  <option value="consultation">Consultations Only ({emails.filter(e => e.emailType === 'consultation').length})</option>
                  <option value="newsletter">Newsletter Subscribers ({emails.filter(e => e.emailType === 'newsletter').length})</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Selected: <span className="font-semibold text-[#0B1530]">{filteredEmails.length} recipients</span>
                </p>
              </div>

              {/* Template Selector */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Select Template
                </label>
                <select
                  value={bulkEmailData.template}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  disabled={sendingBulkEmail}
                >
                  <option value="blank">Blank Template</option>
                  <option value="welcome">Welcome Email</option>
                  <option value="followup">Follow-up Email</option>
                  <option value="thankyou">Thank You Email</option>
                  <option value="reminder">Reminder Email</option>
                  <option value="newsletter">Newsletter</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Subject
                </label>
                <input
                  type="text"
                  value={bulkEmailData.subject}
                  onChange={(e) => setBulkEmailData({ ...bulkEmailData, subject: e.target.value })}
                  placeholder="Enter email subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  disabled={sendingBulkEmail}
                />
              </div>

              {/* HTML Editor */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Message
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={bulkEmailData.message}
                    onChange={(value) => setBulkEmailData({ ...bulkEmailData, message: value })}
                    placeholder="Write your email message here..."
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'align': [] }],
                        ['link', 'image'],
                        ['clean']
                      ]
                    }}
                    style={{ minHeight: '250px' }}
                    readOnly={sendingBulkEmail}
                  />
                </div>
              </div>

              {/* Recipients Preview */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Recipients:</strong> This email will be sent to {filteredEmails.length} 
                  {filterType !== 'all' ? ` ${filterType}` : ''} contacts in your list.
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowBulkEmailModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                disabled={sendingBulkEmail}
              >
                Cancel
              </button>
              <button
                onClick={handleSendBulkEmail}
                disabled={sendingBulkEmail || !bulkEmailData.subject || !bulkEmailData.message}
                className="px-6 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C5A028] transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingBulkEmail ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Send to All
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmails;
