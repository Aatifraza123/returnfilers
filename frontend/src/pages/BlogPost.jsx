import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import api from '../api/axios';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { 
  FaArrowLeft, FaCalendarAlt, FaFacebookF, FaTwitter, 
  FaLinkedinIn, FaClock, FaUser, FaShareAlt 
} from 'react-icons/fa';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reading Progress Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax Effect for Hero
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    if (id) fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    if (!id || id.length !== 24) {
      toast.error('Invalid blog ID');
      navigate('/blog');
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/blogs/${id}`);
      if (response.status === 200 && response.data) {
        setBlog(response.data);
      } else {
        throw new Error('Blog not found');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Failed to load article');
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <BlogSkeleton />;
  if (!blog) return null;

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#C9A227] selection:text-white">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#C9A227] origin-left z-50"
        style={{ scaleX }}
      />

      {/* Parallax Hero Section - Reduced Height to 45vh */}
      <div className="relative h-[45vh] overflow-hidden">
        <motion.div 
          style={{ y }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1530]/80 via-[#0B1530]/60 to-[#0B1530] z-10" />
          <img
            src={blog.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80'}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 z-20 container mx-auto px-4 flex flex-col justify-end pb-10 max-w-4xl">
          <Link
            to="/blog"
            className="inline-flex items-center text-white/70 hover:text-[#C9A227] mb-4 transition-colors text-xs font-medium tracking-wide w-fit group" 
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform text-[10px]" />
            Back to Journal
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {blog.category && (
              <span className="inline-block px-2.5 py-0.5 mb-3 text-[10px] font-bold tracking-widest text-[#C9A227] uppercase border border-[#C9A227]/30 rounded-full bg-[#C9A227]/10 backdrop-blur-sm">
                {blog.category}
              </span>
            )}
            
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-white mb-4 leading-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-5 text-xs text-gray-300 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#C9A227] flex items-center justify-center text-[#0B1530] font-bold text-[10px]">
                  {blog.author ? blog.author[0] : <FaUser />}
                </div>
                <span className="font-medium text-white tracking-wide">{blog.author || 'Anonymous'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaCalendarAlt className="text-[#C9A227]" />
                <span>{blog.createdAt ? format(new Date(blog.createdAt), 'MMMM dd, yyyy') : 'Date unavailable'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaClock className="text-[#C9A227]" />
                <span>{blog.readTime || '5 min read'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <aside className="lg:w-20 flex-shrink-0">
            <div className="lg:sticky lg:top-32 flex lg:flex-col items-center gap-4">
               <span className="hidden lg:block text-[10px] font-bold text-gray-400 uppercase tracking-widest rotate-180 mb-4" style={{ writingMode: 'vertical-rl' }}>
                 Share
               </span>
               <SocialButton icon={<FaFacebookF size={14} />} color="hover:bg-[#1877F2]" href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} />
               <SocialButton icon={<FaTwitter size={14} />} color="hover:bg-[#1DA1F2]" href={`https://twitter.com/intent/tweet?text=${blog.title}&url=${window.location.href}`} />
               <SocialButton icon={<FaLinkedinIn size={14} />} color="hover:bg-[#0A66C2]" href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`} />
               <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied!');
                }}
                className="w-8 h-8 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-[#C9A227] hover:text-white transition-all duration-300 shadow-sm border border-gray-100"
               >
                 <FaShareAlt size={12} />
               </button>
            </div>
          </aside>

          {/* Article Content */}
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 min-w-0"
          >
            <style>{`
              .blog-content {
                color: #374151;
                line-height: 1.8;
                font-size: 1.0625rem;
              }
              .blog-content p {
                margin-bottom: 1em;
                line-height: 1.75;
              }
              .blog-content h1 {
                font-size: 2rem;
                font-weight: 700;
                color: #0B1530;
                margin-top: 1.5em;
                margin-bottom: 0.5em;
                font-family: Georgia, serif;
                line-height: 1.3;
              }
              .blog-content h2 {
                font-size: 1.5rem;
                font-weight: 700;
                color: #0B1530;
                margin-top: 1.5em;
                margin-bottom: 0.5em;
                font-family: Georgia, serif;
                line-height: 1.3;
                padding-bottom: 0.5em;
                border-bottom: 2px solid #C9A227;
              }
              .blog-content h3 {
                font-size: 1.25rem;
                font-weight: 600;
                color: #0B1530;
                margin-top: 1.25em;
                margin-bottom: 0.5em;
                line-height: 1.4;
              }
              .blog-content h4 {
                font-size: 1.125rem;
                font-weight: 600;
                color: #0B1530;
                margin-top: 1em;
                margin-bottom: 0.5em;
              }
              .blog-content ul, .blog-content ol {
                padding-left: 1.5em;
                margin: 1em 0;
              }
              .blog-content li {
                margin-bottom: 0.5em;
                line-height: 1.6;
                padding-left: 0.5em;
              }
              .blog-content ul li {
                list-style-type: disc;
              }
              .blog-content ol li {
                list-style-type: decimal;
              }
              .blog-content a {
                color: #C9A227;
                text-decoration: underline;
                transition: color 0.2s;
              }
              .blog-content a:hover {
                color: #0B1530;
              }
              .blog-content blockquote {
                border-left: 4px solid #C9A227;
                padding: 1rem 1.25rem;
                margin: 1.5em 0;
                font-style: italic;
                color: #4b5563;
                background: #fefce8;
                border-radius: 0 8px 8px 0;
              }
              .blog-content img {
                max-width: 100%;
                height: auto;
                border-radius: 12px;
                margin: 1.5em auto;
                display: block;
                box-shadow: 0 4px 15px -3px rgba(0, 0, 0, 0.15);
              }
              .blog-content strong, .blog-content b {
                color: #0B1530;
                font-weight: 600;
              }
              .blog-content em, .blog-content i {
                font-style: italic;
              }
              .blog-content code {
                background: #f3f4f6;
                padding: 0.2em 0.4em;
                border-radius: 4px;
                font-size: 0.9em;
                font-family: monospace;
              }
              .blog-content pre {
                background: #1f2937;
                color: #e5e7eb;
                padding: 1rem;
                border-radius: 8px;
                overflow-x: auto;
                margin: 1.5em 0;
              }
              .blog-content table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                margin: 1.5em 0;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 15px -3px rgba(0, 0, 0, 0.1);
                border: 1px solid #e5e7eb;
              }
              .blog-content thead {
                background: linear-gradient(135deg, #0B1530 0%, #1a2b5c 100%);
              }
              .blog-content thead tr th {
                padding: 1rem 1.25rem;
                text-align: left;
                font-weight: 600;
                color: white;
                border: none;
                font-size: 0.95rem;
              }
              .blog-content th {
                padding: 1rem 1.25rem;
                text-align: left;
                font-weight: 600;
                color: white;
                background: linear-gradient(135deg, #0B1530 0%, #1a2b5c 100%);
                border: none;
                font-size: 0.95rem;
              }
              .blog-content tbody tr:first-child th,
              .blog-content tr:first-child th {
                background: linear-gradient(135deg, #0B1530 0%, #1a2b5c 100%);
                color: white;
              }
              .blog-content td {
                padding: 1rem 1.25rem;
                border-bottom: 1px solid #e5e7eb;
                color: #374151;
                background: white;
              }
              .blog-content tbody tr:nth-child(even) td {
                background: #f9fafb;
              }
              .blog-content tbody tr:hover td {
                background: #fef3c7;
              }
              .blog-content tbody tr:last-child td {
                border-bottom: none;
              }
              .blog-content tr:last-child td:first-child {
                border-bottom-left-radius: 12px;
              }
              .blog-content tr:last-child td:last-child {
                border-bottom-right-radius: 12px;
              }
              .blog-content hr {
                border: none;
                border-top: 2px solid #e5e7eb;
                margin: 2em 0;
              }
              .blog-content > *:first-child {
                margin-top: 0;
              }
              .blog-content iframe, .blog-content .ql-video {
                width: 100%;
                height: 400px;
                border-radius: 12px;
                margin: 1.5em 0;
              }
            `}</style>
            
            <div className="blog-content">
              {blog.content ? (
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              ) : (
                <p>No content available for this post.</p>
              )}
            </div>


          </motion.article>

        </div>
      </div>
    </div>
  );
};

// Reusable Components

const SocialButton = ({ icon, color, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-500 flex items-center justify-center ${color} hover:text-white hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1`}
  >
    {icon}
  </a>
);

const BlogSkeleton = () => (
  <div className="min-h-screen bg-white animate-pulse">
    <div className="h-[45vh] bg-gray-200 w-full" />
    <div className="container mx-auto px-4 max-w-5xl -mt-20 relative z-10">
      <div className="h-10 bg-gray-300 w-3/4 mb-4 rounded" />
      <div className="h-4 bg-gray-300 w-1/3 mb-12 rounded" />
      <div className="flex gap-12 mt-12">
         <div className="hidden lg:block w-20 space-y-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
         </div>
         <div className="flex-1 space-y-6">
            <div className="h-4 bg-gray-200 w-full rounded" />
            <div className="h-4 bg-gray-200 w-full rounded" />
            <div className="h-4 bg-gray-200 w-5/6 rounded" />
            <div className="h-56 bg-gray-200 w-full rounded-xl my-8" />
            <div className="h-4 bg-gray-200 w-full rounded" />
            <div className="h-4 bg-gray-200 w-4/5 rounded" />
         </div>
      </div>
    </div>
  </div>
);

export default BlogPost;




