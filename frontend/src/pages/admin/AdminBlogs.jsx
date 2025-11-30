import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
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
  const [formData, setFormData] = useState({
    title: '', content: '', image: ''
  });
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);

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
      const { data } = await axios.get('http://localhost:5000/api/admin/blogs', getConfig());
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
    if (!window.confirm('Delete this blog?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/blogs/${id}`, getConfig());
      toast.success('Blog deleted');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        // Update existing blog
        const blogId = editingBlog._id;
        const url = `http://localhost:5000/api/blogs/${blogId}`;
        
        const response = await axios.put(url, formData, getConfig());
        toast.success('Blog updated successfully!');
      } else {
        // Create new blog
        const response = await axios.post('http://localhost:5000/api/admin/blogs', formData, getConfig());
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
            className="bg-[#0B1530] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#D4AF37] hover:text-[#0B1530] transition-all"
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
    </div>
  );
};

export default AdminBlogs;

