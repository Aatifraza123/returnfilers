import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaTrash, FaEdit, FaPlus, FaTable } from 'react-icons/fa';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize';

// Register ImageResize module
Quill.register('modules/imageResize', ImageResize);

// Custom Link Handler for better link functionality
const Link = Quill.import('formats/link');
Link.sanitize = function(url) {
  // Allow http, https, mailto, and tel protocols
  const protocols = ['http', 'https', 'mailto', 'tel'];
  const protocol = url.split(':')[0];
  if (protocols.includes(protocol) || !protocol) {
    return url;
  }
  return `https://${url}`;
};
Quill.register(Link, true);

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableData, setTableData] = useState([]);
  const [htmlMode, setHtmlMode] = useState(false); // HTML Mode toggle
  const [formData, setFormData] = useState({
    title: '', content: '', image: ''
  });
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize table data when modal opens
  const initTableData = (rows, cols) => {
    const data = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        row.push(r === 0 ? `Header ${c + 1}` : 'Cell');
      }
      data.push(row);
    }
    setTableData(data);
  };

  // Update cell value
  const updateCell = (rowIndex, colIndex, value) => {
    const newData = [...tableData];
    newData[rowIndex][colIndex] = value;
    setTableData(newData);
  };

  // Add row
  const addRow = () => {
    const newRow = tableData[0].map(() => 'Cell');
    setTableData([...tableData, newRow]);
  };

  // Remove row
  const removeRow = (index) => {
    if (tableData.length <= 2) {
      toast.error('Table must have at least 2 rows');
      return;
    }
    const newData = tableData.filter((_, i) => i !== index);
    setTableData(newData);
  };

  // Add column
  const addColumn = () => {
    const newData = tableData.map((row, i) => [...row, i === 0 ? 'Header' : 'Cell']);
    setTableData(newData);
  };

  // Remove column
  const removeColumn = (index) => {
    if (tableData[0].length <= 2) {
      toast.error('Table must have at least 2 columns');
      return;
    }
    const newData = tableData.map(row => row.filter((_, i) => i !== index));
    setTableData(newData);
  };

  // Helper for Token Headers
  const getConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchBlogs();
    // Refresh every 15 seconds for real-time updates
    const interval = setInterval(fetchBlogs, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchBlogs = async () => {
    try {
      // FIX: Use full URL and Config
      const { data } = await api.get('/admin/blogs', getConfig());
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      if (blogs.length === 0) {
        toast.error('Failed to fetch blogs');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold">Delete Blog?</p>
        <p className="text-sm text-gray-600">This action cannot be undone.</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await api.delete(`/admin/blogs/${id}`, getConfig());
                toast.success('Blog deleted');
                fetchBlogs();
              } catch (error) {
                toast.error('Failed to delete');
              }
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        // Update existing blog
        const blogId = editingBlog._id;
        const response = await api.put(`/blogs/${blogId}`, formData, getConfig());
        toast.success('Blog updated successfully!');
      } else {
        // Create new blog
        const response = await api.post('/admin/blogs', formData, getConfig());
        toast.success('Blog published successfully!');
      }
      setShowForm(false);
      setEditingBlog(null);
      setFormData({ title: '', content: '', image: '' });
      fetchBlogs();
    } catch (error) {
      console.error('Blog error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
      toast.error(`Error: ${errorMessage} (Status: ${error.response?.status || 'N/A'})`);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '',
      content: blog.content || '',
      image: blog.image || ''
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBlog(null);
    setFormData({ title: '', content: '', image: '' });
  };

  // Custom handlers for image and link
  const handleImageClick = useCallback(() => {
    // Trigger file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleImageSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result;
      const quill = quillRef.current?.getEditor();
      const range = quill?.getSelection(true);
      
      if (range) {
        quill.insertEmbed(range.index, 'image', imageUrl, 'user');
        quill.setSelection(range.index + 1);
      }
    };
    reader.onerror = () => {
      toast.error('Error reading image file');
    };
    reader.readAsDataURL(file);

    // Reset file input
    e.target.value = '';
  }, []);

  const handleLinkClick = useCallback(() => {
    const quill = quillRef.current?.getEditor();
    const range = quill?.getSelection();
    if (range && range.length > 0) {
      const text = quill.getText(range.index, range.length);
      const url = prompt('Enter link URL:', text);
      if (url) {
        quill.formatText(range.index, range.length, 'link', url);
      }
    } else if (range) {
      const url = prompt('Enter link URL:');
      if (url) {
        const text = prompt('Enter link text:', url);
        if (text) {
          quill.insertText(range.index, text, 'link', url, 'user');
          quill.setSelection(range.index + text.length);
        }
      }
    }
  }, []);

  // Function to move selected content up/down
  const moveContent = useCallback((direction) => {
    const quill = quillRef.current?.getEditor();
    const range = quill?.getSelection();
    if (!range || !quill) return;

    const [line, offset] = quill.getLine(range.index);
    const lineIndex = quill.getIndex(line);
    const prevLine = lineIndex > 0 ? quill.getLine(lineIndex - 1)?.[0] : null;
    const nextLine = quill.getLine(lineIndex + 1)?.[0];

    if (direction === 'up' && prevLine) {
      const content = quill.getContents(lineIndex, line.length());
      quill.deleteText(lineIndex, line.length());
      const newIndex = quill.getIndex(prevLine);
      quill.insertContents(newIndex, content);
      quill.setSelection(newIndex + offset);
    } else if (direction === 'down' && nextLine) {
      const content = quill.getContents(lineIndex, line.length());
      quill.deleteText(lineIndex, line.length());
      const newIndex = quill.getIndex(nextLine) + nextLine.length();
      quill.insertContents(newIndex, content);
      quill.setSelection(newIndex + offset);
    }
  }, []);

  // Function to insert table
  const insertTable = useCallback(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection(true);
    
    // Create table HTML from tableData
    let tableHtml = '<table><thead><tr>';
    // First row is header
    tableData[0].forEach(cell => {
      tableHtml += `<th>${cell}</th>`;
    });
    tableHtml += '</tr></thead><tbody>';
    // Rest are body rows
    for (let r = 1; r < tableData.length; r++) {
      tableHtml += '<tr>';
      tableData[r].forEach(cell => {
        tableHtml += `<td>${cell}</td>`;
      });
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table><p><br></p>';

    // Insert at cursor position
    quill.clipboard.dangerouslyPasteHTML(range.index, tableHtml);
    setShowTableModal(false);
    setTableData([]);
    toast.success('Table inserted!');
  }, [tableData]);

  // Advanced Quill modules configuration
  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['blockquote', 'code-block'],
        ['clean']
      ],
      handlers: {
        'image': handleImageClick,
        'link': handleLinkClick
      }
    },
    keyboard: {
      bindings: {
        moveContentUp: {
          key: 'ArrowUp',
          shiftKey: true,
          altKey: true,
          handler: () => {
            moveContent('up');
            return false;
          }
        },
        moveContentDown: {
          key: 'ArrowDown',
          shiftKey: true,
          altKey: true,
          handler: () => {
            moveContent('down');
            return false;
          }
        }
      }
    },
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize', 'Toolbar']
    },
    clipboard: {
      matchVisual: false
    }
  }), [handleImageClick, handleLinkClick, moveContent]);

  if (loading) return <div className="p-10 text-center">Loading Blogs...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#0B1530]">Manage Blogs</h1>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-[#0B1530] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#C9A227] hover:text-[#0B1530] transition-all"
          >
            <FaPlus /> Write New Blog
          </button>
        )}
      </div>

      {/* Blog Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#0B1530]">
              {editingBlog ? 'Edit Blog' : 'Write New Blog'}
            </h2>
            <button 
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              className="w-full border p-3 rounded-lg" 
              placeholder="Blog Title" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
            />
            <input 
              className="w-full border p-3 rounded-lg" 
              placeholder="Image URL (Optional)" 
              value={formData.image}
              onChange={e => setFormData({...formData, image: e.target.value})}
            />
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Blog Content</label>
              {/* Hidden file input for image selection */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageSelect}
              />
              
              {/* Editor Styles */}
              <style>{`
                .ql-toolbar.ql-snow {
                  border: none !important;
                  border-bottom: 2px solid #e5e7eb !important;
                  background: #f9fafb;
                  padding: 12px !important;
                  border-radius: 8px 8px 0 0;
                  display: flex;
                  flex-wrap: wrap;
                  gap: 4px;
                }
                .ql-toolbar .ql-formats {
                  margin-right: 8px !important;
                }
                .ql-toolbar button {
                  width: 32px !important;
                  height: 32px !important;
                  border-radius: 6px !important;
                }
                .ql-toolbar button:hover {
                  background: #e5e7eb !important;
                }
                .ql-toolbar button.ql-active {
                  background: #C9A227 !important;
                  color: white !important;
                }
                .ql-toolbar button.ql-active .ql-stroke {
                  stroke: white !important;
                }
                .ql-toolbar button.ql-active .ql-fill {
                  fill: white !important;
                }
                .ql-container.ql-snow {
                  border: none !important;
                  font-size: 1rem;
                }
                .ql-editor {
                  min-height: 400px;
                  padding: 20px !important;
                  color: #374151;
                  line-height: 1.8;
                }
                .ql-editor p { 
                  margin-bottom: 1em; 
                  line-height: 1.75;
                }
                .ql-editor h1 {
                  font-size: 2rem;
                  font-weight: 700;
                  color: #0B1530;
                  margin: 1.5em 0 0.5em;
                  font-family: Georgia, serif;
                }
                .ql-editor h2 { 
                  font-size: 1.5rem; 
                  font-weight: 700; 
                  color: #0B1530; 
                  margin: 1.5em 0 0.5em;
                  font-family: Georgia, serif;
                }
                .ql-editor h3 { 
                  font-size: 1.25rem; 
                  font-weight: 600; 
                  color: #0B1530; 
                  margin: 1.25em 0 0.5em;
                }
                .ql-editor blockquote {
                  border-left: 4px solid #C9A227;
                  padding: 1rem;
                  margin: 1.5em 0;
                  background: #fefce8;
                  border-radius: 0 8px 8px 0;
                }
                .ql-editor ul, .ql-editor ol {
                  padding-left: 1.5em;
                  margin: 1em 0;
                }
                .ql-editor li {
                  margin-bottom: 0.5em;
                }
                .ql-editor a {
                  color: #C9A227;
                  text-decoration: underline;
                }
                .ql-editor img {
                  max-width: 100%;
                  border-radius: 8px;
                  margin: 1em 0;
                  cursor: pointer;
                }
                .ql-editor table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 1em 0;
                }
                .ql-editor th, .ql-editor td {
                  border: 1px solid #e5e7eb;
                  padding: 0.75rem;
                }
                .ql-editor th {
                  background: #0B1530;
                  color: white;
                }
                .ql-snow .ql-picker.ql-header .ql-picker-label::before,
                .ql-snow .ql-picker.ql-header .ql-picker-item::before {
                  content: 'Normal';
                }
                .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
                .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
                  content: 'Heading 1';
                }
                .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
                .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
                  content: 'Heading 2';
                }
                .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
                .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
                  content: 'Heading 3';
                }
              `}</style>
              
              {/* HTML Mode Toggle */}
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={() => setHtmlMode(!htmlMode)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    htmlMode 
                      ? 'bg-[#C9A227] text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {htmlMode ? '📝 Visual Editor' : '💻 HTML Mode'}
                </button>
              </div>

              {htmlMode ? (
                /* HTML Mode - Direct Textarea */
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Paste your HTML content here..."
                  className="w-full min-h-[500px] p-4 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                  style={{ fontFamily: 'Monaco, Consolas, monospace' }}
                />
              ) : (
                /* Visual Editor - ReactQuill */
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={formData.content}
                    onChange={(value) => setFormData({...formData, content: value})}
                    placeholder="Write your blog content here..."
                    modules={quillModules}
                    style={{ minHeight: '400px' }}
                    formats={[
                      'header', 'font', 'size',
                      'bold', 'italic', 'underline', 'strike',
                      'script', 'color', 'background',
                      'list', 'bullet', 'indent', 'direction', 'align',
                      'link', 'image', 'video',
                      'blockquote', 'code-block', 'formula'
                    ]}
                  />
                </div>
              )}

              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-500">
                  💡 <strong>Tips:</strong> 
                  <span className="ml-2">• Click image icon to upload image from your computer</span>
                  <span className="ml-2">• Select text and click Link button to add hyperlinks</span>
                  <span className="ml-2">• Use Shift+Alt+↑/↓ to move content up/down</span>
                  <span className="ml-2">• Drag images to resize them</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTableModal(true)}
                    className="px-3 py-1.5 text-xs bg-[#0B1530] text-white hover:bg-[#1a2b5c] rounded border border-[#0B1530] transition-colors flex items-center gap-1"
                    title="Insert Table"
                  >
                    <FaTable /> Insert Table
                  </button>
                  <button
                    type="button"
                    onClick={() => moveContent('up')}
                    className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 transition-colors"
                    title="Move content up (Shift+Alt+↑)"
                  >
                    ⬆️ Move Up
                  </button>
                  <button
                    type="button"
                    onClick={() => moveContent('down')}
                    className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 transition-colors"
                    title="Move content down (Shift+Alt+↓)"
                  >
                    ⬇️ Move Down
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                {editingBlog ? 'Update Blog' : 'Publish Blog'}
              </button>
              <button 
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blog List */}
      <div className="grid md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#0B1530] mb-2">{blog.title}</h3>
              <div 
                className="text-gray-500 text-sm mb-4 line-clamp-3" 
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
              
              <div className="flex justify-end gap-3 border-t pt-4">
                <button 
                  onClick={() => handleEdit(blog)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <FaEdit /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(blog._id)}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No blogs found. Click "Write New Blog" to start.
        </div>
      )}

      {/* Table Editor Modal */}
      {showTableModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowTableModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-[90%] max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="p-4 bg-[#0B1530] text-white flex justify-between items-center">
              <h3 className="text-lg font-bold">Table Editor</h3>
              <button 
                onClick={() => setShowTableModal(false)}
                className="text-white/70 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 overflow-auto max-h-[60vh]">
              {tableData.length === 0 ? (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">Select table size to start:</p>
                  <div className="flex gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rows</label>
                      <input
                        type="number"
                        min="2"
                        max="20"
                        value={tableRows}
                        onChange={(e) => setTableRows(parseInt(e.target.value) || 2)}
                        className="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#C9A227]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Columns</label>
                      <input
                        type="number"
                        min="2"
                        max="10"
                        value={tableCols}
                        onChange={(e) => setTableCols(parseInt(e.target.value) || 2)}
                        className="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#C9A227]"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => initTableData(tableRows, tableCols)}
                        className="bg-[#C9A227] text-[#0B1530] px-4 py-2 rounded-lg font-medium hover:bg-[#c9a432] transition-colors"
                      >
                        Create Table
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Action Buttons */}
                  <div className="flex gap-2 mb-4">
                    <button
                      type="button"
                      onClick={addRow}
                      className="px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      + Add Row
                    </button>
                    <button
                      type="button"
                      onClick={addColumn}
                      className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      + Add Column
                    </button>
                  </div>
                  
                  {/* Table Editor */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <tbody>
                        {tableData.map((row, rowIndex) => (
                          <tr key={rowIndex} className={rowIndex === 0 ? 'bg-[#0B1530]' : 'bg-white'}>
                            {row.map((cell, colIndex) => (
                              <td key={colIndex} className="border border-gray-300 p-0">
                                <input
                                  type="text"
                                  value={cell}
                                  onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                                  className={`w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
                                    rowIndex === 0 
                                      ? 'bg-[#0B1530] text-white font-semibold placeholder-white/50' 
                                      : 'bg-white text-gray-700'
                                  }`}
                                  placeholder={rowIndex === 0 ? 'Header' : 'Cell'}
                                />
                              </td>
                            ))}
                            <td className="border-0 pl-2">
                              {rowIndex > 0 && (
                                <button
                                  type="button"
                                  onClick={() => removeRow(rowIndex)}
                                  className="text-red-500 hover:text-red-700 text-sm"
                                  title="Remove row"
                                >
                                  ✕
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                        {/* Column remove buttons */}
                        <tr>
                          {tableData[0]?.map((_, colIndex) => (
                            <td key={colIndex} className="border-0 pt-2 text-center">
                              <button
                                type="button"
                                onClick={() => removeColumn(colIndex)}
                                className="text-red-500 hover:text-red-700 text-xs"
                                title="Remove column"
                              >
                                ✕ Remove
                              </button>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowTableModal(false);
                  setTableData([]);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              {tableData.length > 0 && (
                <button
                  type="button"
                  onClick={insertTable}
                  className="px-6 py-2 bg-[#0B1530] text-white rounded-lg font-medium hover:bg-[#1a2b5c] transition-colors"
                >
                  Insert Table
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminBlogs;

