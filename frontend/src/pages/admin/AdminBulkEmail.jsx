import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaPaperPlane, FaEye, FaArrowLeft, FaUsers } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminBulkEmail = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState([]);
  const [allEmailsRaw, setAllEmailsRaw] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [bulkEmailData, setBulkEmailData] = useState({
    subject: '',
    message: '',
    template: 'blank'
  });
  const [sendingBulkEmail, setSendingBulkEmail] = useState(false);
  const [htmlMode, setHtmlMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Email templates
  const emailTemplates = {
    blank: { subject: '', message: '' },
    welcome: {
      subject: 'Welcome to ReturnFilers',
      message: `<h2 style="color: #0B1530;">Welcome!</h2>
<p>Thank you for reaching out to ReturnFilers. We're excited to work with you!</p>
<p>Our team of professional tax and business consultants is dedicated to providing you with exceptional service.</p>
<p>We will be in touch with you soon.</p>
<br>
<p>Best regards,<br><strong>ReturnFilers Team</strong></p>`
    },
    followup: {
      subject: 'Following up on your inquiry',
      message: `<h2 style="color: #0B1530;">Following Up</h2>
<p>We wanted to follow up regarding your recent inquiry with ReturnFilers.</p>
<p>If you have any questions or need further assistance, please don't hesitate to reach out to us.</p>
<p>We're here to help!</p>
<br>
<p>Best regards,<br><strong>ReturnFilers Team</strong></p>`
    },
    thankyou: {
      subject: 'Thank you for choosing ReturnFilers',
      message: `<h2 style="color: #0B1530;">Thank You!</h2>
<p>We sincerely appreciate you choosing ReturnFilers for your financial needs.</p>
<p>Your trust in our services means a lot to us, and we're committed to delivering the best results.</p>
<p>If you have any questions, feel free to contact us anytime.</p>
<br>
<p>Best regards,<br><strong>ReturnFilers Team</strong></p>`
    },
    reminder: {
      subject: 'Reminder: Important Update from ReturnFilers',
      message: `<h2 style="color: #0B1530;">Reminder</h2>
<p>This is a friendly reminder regarding your pending matters with ReturnFilers.</p>
<p>Please review the details and let us know if you need any clarification.</p>
<p>We're here to assist you!</p>
<br>
<p>Best regards,<br><strong>ReturnFilers Team</strong></p>`
    },
    newsletter: {
      subject: 'ReturnFilers Newsletter - Latest Updates',
      message: `<h2 style="color: #0B1530;">Newsletter</h2>
<p>Welcome to our latest newsletter!</p>
<p>Here are some important updates and insights from ReturnFilers:</p>
<ul>
  <li>Tax planning tips for the upcoming quarter</li>
  <li>Recent regulatory changes</li>
  <li>New services we're offering</li>
</ul>
<p>Stay informed and reach out if you need any assistance.</p>
<br>
<p>Best regards,<br><strong>ReturnFilers Team</strong></p>`
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [consultationsRes, contactsRes, quotesRes, bookingsRes, newsletterRes] = await Promise.all([
        api.get('/consultations', config).catch(() => ({ data: { consultations: [] } })),
        api.get('/contacts', config).catch(() => ({ data: { contacts: [] } })),
        api.get('/quotes', config).catch(() => ({ data: { quotes: [] } })),
        api.get('/bookings', config).catch(() => ({ data: { bookings: [] } })),
        api.get('/newsletter', config).catch(() => ({ data: { subscribers: [] } }))
      ]);
      
      const consultations = consultationsRes.data.consultations || [];
      const contacts = contactsRes.data.contacts || [];
      const quotes = quotesRes.data.quotes || [];
      const bookings = bookingsRes.data.bookings || [];
      const newsletters = newsletterRes.data.subscribers || [];
      
      const allEmailsRaw = [
        ...consultations.map(c => ({ ...c, emailType: 'consultation', name: c.name || 'N/A' })),
        ...contacts.map(c => ({ ...c, emailType: 'contact', name: c.name || 'N/A' })),
        ...quotes.map(q => ({ ...q, emailType: 'quote', name: q.name || 'N/A' })),
        ...bookings.map(b => ({ ...b, emailType: 'booking', name: b.name || 'N/A' })),
        ...newsletters.map(n => ({ ...n, emailType: 'newsletter', name: 'Newsletter Subscriber', email: n.email || n._id }))
      ];
      
      const seenEmails = new Set();
      const allEmails = allEmailsRaw.filter(item => {
        const email = (item.email || '').toLowerCase().trim();
        if (!email || seenEmails.has(email)) return false;
        seenEmails.add(email);
        return true;
      });
      
      setEmails(allEmails);
      setAllEmailsRaw(allEmailsRaw);
    } catch (error) {
      console.error('Error fetching emails:', error);
      toast.error('Failed to fetch emails');
    } finally {
      setLoading(false);
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

  const getFilteredEmails = () => {
    const sourceData = filterType === 'all' ? emails : allEmailsRaw;
    if (!sourceData || !Array.isArray(sourceData)) return [];
    
    let filtered = sourceData;
    if (filterType !== 'all') {
      filtered = filtered.filter(email => email.emailType === filterType);
    }
    
    return filtered;
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

    const confirmSend = window.confirm(`Send email to ${filteredEmailsList.length} recipients?`);
    if (!confirmSend) return;

    setSendingBulkEmail(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const recipients = filteredEmailsList.map(e => ({
        email: e.email,
        name: e.name
      }));

      let cleanMessage = bulkEmailData.message;
      
      if (cleanMessage.includes('&lt;') && cleanMessage.includes('&gt;')) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cleanMessage;
        cleanMessage = tempDiv.textContent || tempDiv.innerText || cleanMessage;
      }

      await api.post('/contacts/bulk-email', {
        recipients,
        subject: bulkEmailData.subject,
        message: cleanMessage
      }, config);

      toast.success('Bulk email sent successfully!');
      navigate('/admin/emails');
    } catch (error) {
      console.error('Bulk email error:', error);
      toast.error(error.response?.data?.message || 'Failed to send bulk email');
    } finally {
      setSendingBulkEmail(false);
    }
  };

  const filteredEmails = getFilteredEmails();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/emails')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-xl text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-primary">Send Bulk Email</h1>
            <p className="text-gray-600 mt-1">Compose and send emails to multiple recipients</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Email Composer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recipients Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaUsers className="text-secondary text-xl" />
              <h2 className="text-xl font-bold text-gray-800">Recipients</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Select Recipient Group
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white text-base font-medium"
                  disabled={sendingBulkEmail}
                >
                  <option value="all">All Recipients ({emails?.length || 0} unique)</option>
                  <option value="contact">Contacts Only ({allEmailsRaw?.filter(e => e.emailType === 'contact')?.length || 0})</option>
                  <option value="consultation">Consultations Only ({allEmailsRaw?.filter(e => e.emailType === 'consultation')?.length || 0})</option>
                  <option value="quote">Quotes Only ({allEmailsRaw?.filter(e => e.emailType === 'quote')?.length || 0})</option>
                  <option value="booking">Bookings Only ({allEmailsRaw?.filter(e => e.emailType === 'booking')?.length || 0})</option>
                  <option value="newsletter">Newsletter Subscribers ({allEmailsRaw?.filter(e => e.emailType === 'newsletter')?.length || 0})</option>
                </select>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-semibold mb-2">
                  📧 {filteredEmails.length} recipients selected
                </p>
                {filteredEmails.length > 0 && (
                  <p className="text-xs text-blue-600">
                    {filteredEmails.slice(0, 5).map(e => e.email).join(', ')}
                    {filteredEmails.length > 5 && ` and ${filteredEmails.length - 5} more...`}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Email Content Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Email Content</h2>
            
            <div className="space-y-4">
              {/* Template Selector */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Select Template
                </label>
                <select
                  value={bulkEmailData.template}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
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
                  Subject *
                </label>
                <input
                  type="text"
                  value={bulkEmailData.subject}
                  onChange={(e) => setBulkEmailData({ ...bulkEmailData, subject: e.target.value })}
                  placeholder="Enter email subject"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  disabled={sendingBulkEmail}
                />
              </div>

              {/* Message Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Message *
                  </label>
                  <button
                    type="button"
                    onClick={() => setHtmlMode(!htmlMode)}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                    disabled={sendingBulkEmail}
                  >
                    {htmlMode ? '📝 Visual Editor' : '💻 HTML Mode'}
                  </button>
                </div>
                
                {htmlMode ? (
                  <div>
                    <textarea
                      value={bulkEmailData.message}
                      onChange={(e) => setBulkEmailData({ ...bulkEmailData, message: e.target.value })}
                      placeholder="Paste your HTML code here..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent font-mono text-sm"
                      rows="20"
                      disabled={sendingBulkEmail}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      💻 HTML Mode: Paste your complete HTML email template here
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
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
                        style={{ minHeight: '400px' }}
                        readOnly={sendingBulkEmail}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      📝 Visual Mode: Use the toolbar to format your email
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Actions & Preview */}
        <div className="space-y-6">
          {/* Actions Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Actions</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => setShowPreview(true)}
                disabled={!bulkEmailData.subject || !bulkEmailData.message}
                className="w-full px-4 py-3 border-2 border-secondary text-secondary rounded-lg hover:bg-secondary hover:text-white transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaEye />
                Preview Email
              </button>

              <button
                onClick={handleSendBulkEmail}
                disabled={sendingBulkEmail || !bulkEmailData.subject || !bulkEmailData.message || filteredEmails.length === 0}
                className="w-full px-4 py-3 bg-secondary text-white rounded-lg hover:bg-[#C5A028] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingBulkEmail ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Send to {filteredEmails.length} Recipients
                  </>
                )}
              </button>

              <button
                onClick={() => navigate('/admin/emails')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={sendingBulkEmail}
              >
                Cancel
              </button>
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs font-semibold text-yellow-800 mb-2">💡 Tips:</p>
              <ul className="text-xs text-yellow-700 space-y-1 ml-4 list-disc">
                <li>Preview before sending</li>
                <li>Test with small group first</li>
                <li>Check all links work</li>
                <li>Verify images display</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                    <FaEye />
                    Email Preview
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    This is how your email will look to recipients
                  </p>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600 text-3xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Email Header */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                <div className="flex items-start gap-3">
                  <span className="text-sm font-semibold text-gray-600 min-w-[80px]">From:</span>
                  <span className="text-sm text-gray-900">ReturnFilers &lt;info@returnfilers.in&gt;</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-sm font-semibold text-gray-600 min-w-[80px]">To:</span>
                  <span className="text-sm text-gray-900">
                    {filteredEmails.length} recipients
                    {filteredEmails.length > 0 && (
                      <span className="text-gray-500 ml-2">
                        ({filteredEmails.slice(0, 3).map(e => e.email).join(', ')}
                        {filteredEmails.length > 3 && ` +${filteredEmails.length - 3} more`})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-sm font-semibold text-gray-600 min-w-[80px]">Subject:</span>
                  <span className="text-sm text-gray-900 font-semibold">{bulkEmailData.subject || '(No subject)'}</span>
                </div>
              </div>

              {/* Email Body */}
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Email Body</p>
                </div>
                <div className="bg-white p-6">
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: bulkEmailData.message }}
                    style={{
                      fontFamily: 'Arial, sans-serif',
                      lineHeight: '1.6',
                      color: '#333'
                    }}
                  />
                </div>
              </div>

              {/* Preview Tips */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-semibold mb-2">📧 Preview Checklist:</p>
                <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
                  <li>✓ Images displaying correctly</li>
                  <li>✓ Links working properly</li>
                  <li>✓ Text formatting looks professional</li>
                  <li>✓ Subject line is clear</li>
                  <li>✓ Recipient count is correct</li>
                </ul>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  setShowPreview(false);
                  handleSendBulkEmail();
                }}
                className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-[#C5A028] transition-colors font-medium flex items-center gap-2"
              >
                <FaPaperPlane />
                Looks Good, Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBulkEmail;
