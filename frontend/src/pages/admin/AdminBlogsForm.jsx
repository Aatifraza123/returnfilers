import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize';
import { FaArrowLeft, FaSave, FaImage, FaCloudUploadAlt, FaMagic, FaFileAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Register ImageResize module
Quill.register('modules/imageResize', ImageResize);

// Blog Template
const BLOG_TEMPLATE = `
<h2>Introduction</h2>
<p>Write a compelling introduction that explains what this article is about and why readers should care. Keep it concise and engaging.</p>

<h2>Main Topic Heading</h2>
<p>Explain the main concept or topic in detail. Use clear and simple language that your audience can understand.</p>

<h3>Sub-topic 1</h3>
<p>Break down complex topics into smaller sections. This makes the content easier to read and understand.</p>

<ul>
<li><strong>Point 1:</strong> Explain the first key point</li>
<li><strong>Point 2:</strong> Explain the second key point</li>
<li><strong>Point 3:</strong> Explain the third key point</li>
</ul>

<h3>Sub-topic 2</h3>
<p>Continue with more detailed information. Use examples where possible to illustrate your points.</p>

<h2>Key Benefits / Features</h2>
<p>List the main benefits or features related to your topic:</p>

<ol>
<li><strong>Benefit 1</strong> - Description of the first benefit</li>
<li><strong>Benefit 2</strong> - Description of the second benefit</li>
<li><strong>Benefit 3</strong> - Description of the third benefit</li>
</ol>

<h2>Important Information</h2>
<p>Include any critical information, deadlines, or requirements that readers need to know.</p>

<blockquote>
<strong>Pro Tip:</strong> Add a helpful tip or important note that provides extra value to your readers.
</blockquote>

<h2>Conclusion</h2>
<p>Summarize the key points of your article. Include a call-to-action encouraging readers to take the next step.</p>

<p><strong>Need help?</strong> Contact us today for a free consultation. Our expert team is here to assist you.</p>
`;

// Custom Link Handler
const Link = Quill.import('formats/link');
Link.sanitize = function(url) {
  const protocols = ['http', 'https', 'mailto', 'tel'];
  const protocol = url.split(':')[0];
  if (protocols.includes(protocol) || !protocol) return url;
  return `https://${url}`;
};
Quill.register(Link, true);

const AdminBlogsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);
  const coverImageInputRef = useRef(null);

  // Watch image field for preview
  const imageUrl = watch('image');

  useEffect(() => {
    if (imageUrl) setPreviewImage(imageUrl);
  }, [imageUrl]);

  const getConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // --- Handlers (Image, Link, Move) ---
  const handleImageClick = useCallback(() => {
    if (fileInputRef.current) fileInputRef.current.click();
  }, []);

  const handleImageSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

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
    reader.readAsDataURL(file);
    e.target.value = '';
  }, []);

  const handleLinkClick = useCallback(() => {
    const quill = quillRef.current?.getEditor();
    const range = quill?.getSelection();
    if (range) {
      const url = prompt('Enter link URL:');
      if (url) {
        quill.formatText(range.index, range.length, 'link', url);
      }
    }
  }, []);

  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image', 'blockquote', 'code-block'],
        ['clean']
      ],
      handlers: {
        'image': handleImageClick,
        'link': handleLinkClick
      }
    },
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize', 'Toolbar']
    },
    clipboard: { matchVisual: false }
  }), [handleImageClick, handleLinkClick]);

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const { data } = await api.get(`/blogs/${id}`);
          reset(data);
          setContent(data.content || '');
          if (data.image) setPreviewImage(data.image);
        } catch (error) {
          toast.error('Failed to load blog');
        }
      };
      fetchBlog();
    }
  }, [id, reset]);

  const onSubmit = async (data) => {
    if (!data.title) return toast.error('Title is required');
    
    setLoading(true);
    try {
      const blogData = {
        title: data.title,
        content: content,
        category: data.category || 'General',
        image: data.image || '',
        author: data.author || 'Admin',
        readTime: '5 min read'
      };

      if (isEditMode) {
        await api.put(`/blogs/${id}`, blogData, getConfig());
        toast.success('Blog updated successfully');
      } else {
        await api.post('/blogs', blogData, getConfig());
        toast.success('Blog published successfully');
      }
      navigate('/admin/blogs');
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-7xl mx-auto pl-0 pr-4 py-6 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT: Main Editor Area */}
        <div className="flex-1">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => navigate('/admin/blogs')}
              className="flex items-center text-gray-500 hover:text-[#0B1530] transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
            <div className="lg:hidden flex gap-3">
               <button 
                type="submit" 
                disabled={loading}
                className="bg-[#0B1530] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
               >
                 {loading ? 'Saving...' : 'Publish'}
               </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[85vh]">
            {/* Cover Image Section */}
            <div className="relative group bg-gray-50 h-64 border-b border-gray-100 flex items-center justify-center overflow-hidden">
               {previewImage ? (
                 <img src={previewImage} alt="Cover" className="w-full h-full object-cover" />
               ) : (
                 <div className="text-center text-gray-400">
                   <FaImage className="text-4xl mx-auto mb-2 opacity-50" />
                   <p className="text-sm font-medium">Add a cover image</p>
                 </div>
               )}
               
               {/* Hover Overlay for Image Input */}
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                 <div className="w-full max-w-md px-6">
                   <label className="block text-white text-sm font-bold mb-2">Cover Image URL</label>
                   <div className="flex gap-2">
                     <input 
                       {...register('image')} 
                       className="flex-1 bg-white/20 border border-white/30 text-white placeholder-white/50 rounded-lg px-4 py-2 focus:outline-none focus:bg-white/30 backdrop-blur-md"
                       placeholder="https://example.com/image.jpg"
                     />
                   </div>
                 </div>
               </div>
            </div>

            <div className="p-8 lg:p-12">
              {/* Title Input - Styled like a H1 */}
              <input
                {...register('title', { required: true })}
                placeholder="Article Title..."
                className="w-full text-4xl lg:text-5xl font-serif font-bold text-[#0B1530] placeholder-gray-300 border-none focus:ring-0 p-0 mb-8 bg-transparent"
                autoComplete="off"
              />

              {/* Editor */}
              <div className="prose-editor">
                {/* Hidden File Input for Quill Images */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
                
                <style>{`
                  .ql-toolbar.ql-snow {
                    border: none !important;
                    border-bottom: 1px solid #f3f4f6 !important;
                    position: sticky;
                    top: 0;
                    background: white;
                    z-index: 10;
                    padding: 12px 0 !important;
                    margin-bottom: 24px;
                  }
                  .ql-container.ql-snow {
                    border: none !important;
                    font-size: 1.125rem;
                    font-family: inherit;
                  }
                  .ql-editor {
                    padding: 0 !important;
                    min-height: 400px;
                    color: #374151;
                    line-height: 1.8;
                  }
                  .ql-editor p { 
                    margin-bottom: 1.25em; 
                    font-size: 1rem;
                    line-height: 1.75;
                  }
                  .ql-editor h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #0B1530;
                    margin-top: 1.5em;
                    margin-bottom: 0.75em;
                    font-family: Georgia, serif;
                    line-height: 1.3;
                  }
                  .ql-editor h2 { 
                    font-size: 1.5rem; 
                    font-weight: 700; 
                    color: #0B1530; 
                    margin-top: 1.75em; 
                    margin-bottom: 0.75em; 
                    font-family: Georgia, serif;
                    line-height: 1.3;
                  }
                  .ql-editor h3 { 
                    font-size: 1.25rem; 
                    font-weight: 600; 
                    color: #0B1530; 
                    margin-top: 1.5em; 
                    margin-bottom: 0.5em;
                    line-height: 1.4;
                  }
                  .ql-editor blockquote {
                    border-left: 4px solid #D4AF37;
                    padding: 1rem 1.25rem;
                    margin: 1.5em 0;
                    font-style: italic;
                    color: #4b5563;
                    background: #f9fafb;
                    border-radius: 0 8px 8px 0;
                  }
                  .ql-editor ul, .ql-editor ol {
                    padding-left: 1.5em;
                    margin: 1em 0;
                  }
                  .ql-editor li {
                    margin-bottom: 0.5em;
                    line-height: 1.6;
                  }
                  .ql-editor a {
                    color: #D4AF37;
                    text-decoration: underline;
                  }
                  .ql-editor a:hover {
                    color: #0B1530;
                  }
                  .ql-editor img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 12px;
                    margin: 1.5em 0;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                  }
                  .ql-editor strong {
                    color: #0B1530;
                    font-weight: 600;
                  }
                  .ql-editor code {
                    background: #f3f4f6;
                    padding: 0.2em 0.4em;
                    border-radius: 4px;
                    font-size: 0.9em;
                  }
                  .ql-editor pre {
                    background: #1f2937;
                    color: #e5e7eb;
                    padding: 1rem;
                    border-radius: 8px;
                    overflow-x: auto;
                    margin: 1.5em 0;
                  }
                `}</style>

                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  placeholder="Tell your story..."
                  modules={quillModules}
                  formats={[
                    'header', 'bold', 'italic', 'underline', 'strike',
                    'color', 'background', 'list', 'bullet', 
                    'link', 'image', 'blockquote', 'code-block'
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Sidebar Settings */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
          <div className="sticky top-6">
             {/* Publish Card */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Publishing</h3>
               <div className="space-y-4">
                 <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#0B1530] text-white py-3 rounded-lg font-bold shadow-md hover:bg-[#1a2b5c] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                 >
                   {loading ? <span className="animate-spin">⏳</span> : <FaMagic />}
                   {isEditMode ? 'Update Story' : 'Publish Story'}
                 </button>
                 {!isEditMode && (
                   <button 
                    type="button"
                    onClick={() => {
                      if (content && content.length > 50) {
                        if (!window.confirm('This will replace your current content. Continue?')) return;
                      }
                      setContent(BLOG_TEMPLATE);
                      toast.success('Template loaded! Customize it with your content.');
                    }}
                    className="w-full py-3 rounded-lg font-medium text-[#D4AF37] border-2 border-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-colors flex items-center justify-center gap-2"
                   >
                     <FaFileAlt />
                     Use Template
                   </button>
                 )}
                 <button 
                  type="button"
                  onClick={() => navigate('/admin/blogs')}
                  className="w-full py-3 rounded-lg font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                 >
                   Discard Draft
                 </button>
               </div>
             </div>

             {/* Metadata Card */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Settings</h3>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#0B1530] mb-2">Category</label>
                    <div className="relative">
                      <select 
                        {...register('category')} 
                        className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                      >
                        <option>General</option>
                        <option>Tax Updates</option>
                        <option>GST</option>
                        <option>Audit</option>
                        <option>Startup Guide</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>

                  <div>
                     <label className="block text-sm font-semibold text-[#0B1530] mb-2">Author</label>
                     <input 
                       {...register('author')} 
                       className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-lg focus:outline-none focus:bg-white focus:border-[#D4AF37]" 
                       placeholder="Author Name"
                       defaultValue="Admin"
                     />
                  </div>
                </div>
             </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminBlogsForm;



