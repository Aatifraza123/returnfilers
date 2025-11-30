import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import { FaArrowLeft, FaCalendarAlt, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    if (!id) {
      toast.error('No blog ID provided');
      navigate('/blog');
      return;
    }

    // Validate ID format
    if (id.length !== 24) {
      console.error('Invalid blog ID length:', id.length);
      toast.error('Invalid blog ID format');
      navigate('/blog');
      return;
    }

    setLoading(true);
    try {
      console.log('=== Fetching Blog ===');
      console.log('Blog ID:', id);
      console.log('ID length:', id?.length);
      console.log('ID format valid:', /^[0-9a-fA-F]{24}$/.test(id));
      
      // First, let's check if blogs are available
      const blogsResponse = await axios.get('/api/blogs');
      const allBlogs = Array.isArray(blogsResponse.data) ? blogsResponse.data : (blogsResponse.data?.blogs || []);
      console.log('Total blogs available:', allBlogs.length);
      console.log('Available blog IDs:', allBlogs.map(b => b._id?.toString()).slice(0, 5));
      
      // Check if the requested blog ID exists in the list
      const blogExists = allBlogs.some(b => b._id?.toString() === id);
      console.log('Requested blog exists in list:', blogExists);
      
      if (!blogExists) {
        console.error('❌ Blog ID not found in available blogs list');
        toast.error('This blog article is no longer available');
        setTimeout(() => navigate('/blog'), 2000);
        return;
      }
      
      // Now fetch the specific blog
      console.log('Request URL:', `/api/blogs/${id}`);
      const response = await axios.get(`/api/blogs/${id}`, {
        timeout: 10000,
        validateStatus: (status) => status < 500, // Don't throw on 404
      });
      
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      if (response.status === 200 && response.data && response.data._id) {
        setBlog(response.data);
        console.log('✅ Blog loaded successfully:', response.data.title);
      } else if (response.status === 404) {
        console.error('❌ Blog not found (404)');
        console.error('Response:', response.data);
        toast.error('Blog article not found in database');
        setTimeout(() => navigate('/blog'), 2000);
      } else {
        console.warn('⚠️ Unexpected response:', response.status, response.data);
        toast.error('Unexpected error loading blog');
        setTimeout(() => navigate('/blog'), 2000);
      }
    } catch (error) {
      console.error('❌ Error fetching blog:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error URL:', error.config?.url);
      
      if (error.response?.status === 404) {
        toast.error('Blog article not found. It may have been deleted.');
      } else if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please try again.');
      } else if (!error.response) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('Failed to load blog article');
      }
      
      setTimeout(() => navigate('/blog'), 2000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size="lg" color="#D4AF37" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#0B1530] mb-4">Blog Not Found</h2>
          <Link to="/blog" className="text-[#D4AF37] hover:underline font-semibold inline-flex items-center gap-2">
            <FaArrowLeft /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Compact */}
      <section className="relative py-8 md:py-10 bg-gradient-to-br from-[#0B1530] via-[#1a2b5c] to-[#0B1530] text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl">
          <Link
            to="/blog"
            className="inline-flex items-center text-[#D4AF37] hover:text-white mb-4 transition-colors text-xs font-medium"
          >
            <FaArrowLeft className="mr-2 text-xs" />
            Back to Blog
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {blog.category && (
              <span className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-3">
                {blog.category}
              </span>
            )}
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-3 leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex items-center gap-3 text-xs text-gray-300">
              <span className="flex items-center gap-1.5">
                <FaCalendarAlt className="text-xs" />
                {blog.createdAt ? format(new Date(blog.createdAt), 'MMM dd, yyyy') : 'Draft'}
              </span>
              {blog.readTime && <span>• {blog.readTime}</span>}
              {blog.author && <span>• By {blog.author}</span>}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content - Compact */}
      <article className="py-6 md:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Cover Image - Smaller */}
          {blog.image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 rounded-xl overflow-hidden shadow-lg"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-auto max-h-[350px] object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80';
                }}
              />
            </motion.div>
          )}

          {/* Article Body - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-sm md:prose-base max-w-none"
          >
            {blog.content && typeof blog.content === 'string' ? (
              <div 
                className="space-y-4 text-gray-700 blog-content text-sm md:text-base"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            ) : (
              <p className="text-sm md:text-base text-gray-700 leading-7">
                {blog.content || 'No content available'}
              </p>
            )}
          </motion.div>

          {/* Share Section - Compact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 pt-6 border-t border-gray-200"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[#0B1530] mb-2">Share this article:</p>
                <div className="flex gap-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <FaFacebook size={14} />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors"
                  >
                    <FaTwitter size={14} />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors"
                  >
                    <FaLinkedin size={14} />
                  </a>
                </div>
              </div>
              
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#0B1530] text-white rounded-lg hover:bg-[#1a2b5e] transition-colors font-semibold text-xs"
              >
                <FaArrowLeft className="text-xs" /> Back to All Articles
              </Link>
            </div>
          </motion.div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;

