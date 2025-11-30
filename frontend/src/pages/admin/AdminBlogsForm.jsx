import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize';

// Register ImageResize module
Quill.register('modules/imageResize', ImageResize);

// Custom Link Handler for better link functionality
const Link = Quill.import('formats/link');
Link.sanitize = function(url) {
  const protocols = ['http', 'https', 'mailto', 'tel'];
  const protocol = url.split(':')[0];
  if (protocols.includes(protocol) || !protocol) {
    return url;
  }
  return `https://${url}`;
};
Quill.register(Link, true);

const AdminBlogsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const { register, handleSubmit, reset } = useForm();
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);

  const getConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
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

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          // ✅ Using standard endpoint
          const { data } = await axios.get(`/api/blogs/${id}`);
          reset(data);
          setContent(data.content || '');
        } catch (error) {
          toast.error('Failed to load blog');
        }
      };
      fetchBlog();
    }
  }, [id, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // ✅ Clean Payload to prevent 400 errors
      const blogData = {
        title: data.title,
        content: content, // Use content from state instead of form
        category: data.category || 'General',
        image: data.image || '',
        author: data.author || 'Admin',
        readTime: '5 min read' // Default value
      };

      if (isEditMode) {
        // ✅ Using standard endpoint (Middleware handles security)
        await axios.put(`/api/blogs/${id}`, blogData, getConfig());
        toast.success('Blog updated!');
      } else {
        // ✅ Using standard endpoint
        await axios.post('/api/blogs', blogData, getConfig());
        toast.success('Blog created!');
      }
      navigate('/admin/blogs');
    } catch (error) {
      console.error("Submit Error:", error.response?.data);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-[#0B1530] mb-8">{isEditMode ? 'Edit Blog' : 'Write New Blog'}</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        {/* Title */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Blog Title</label>
          <input {...register('title', { required: true })} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B1530]" placeholder="e.g. Top 5 Tax Saving Tips" />
        </div>

        {/* Category & Author */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
            <select {...register('category')} className="w-full px-4 py-3 border rounded-lg bg-white">
              <option>General</option>
              <option>Tax Updates</option>
              <option>GST</option>
              <option>Audit</option>
              <option>Startup Guide</option>
            </select>
          </div>
          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Author Name</label>
             <input {...register('author')} className="w-full px-4 py-3 border rounded-lg" placeholder="e.g. CA Rajesh" defaultValue="Admin" />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Thumbnail Image URL</label>
          <input {...register('image')} className="w-full px-4 py-3 border rounded-lg" placeholder="https://..." />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Content</label>
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
              value={content}
              onChange={setContent}
              placeholder="Write your blog article here..."
              modules={quillModules}
              style={{ minHeight: '450px' }}
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
              <span className="ml-2">• Paste images directly from clipboard</span>
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

        <button disabled={loading} className="w-full bg-[#0B1530] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#1a2b5c]">
          {loading ? 'Saving...' : (isEditMode ? 'Update Blog' : 'Publish Blog')}
        </button>
      </form>
    </div>
  );
};
export default AdminBlogsForm;


