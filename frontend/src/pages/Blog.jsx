import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import { FaCalendarAlt, FaArrowRight, FaBookOpen, FaClock } from 'react-icons/fa';

// Helper function to strip HTML tags and get plain text
const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredBlog, setFeaturedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data } = await api.get('/blogs');
      const blogData = Array.isArray(data) ? data : (data.blogs || []);
      setBlogs(blogData);
      // Set first blog as featured
      if (blogData.length > 0) {
        setFeaturedBlog(blogData[0]);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load articles');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader size="xl" color="#C9A227" />
      </div>
    );
  }

  const regularBlogs = blogs.length > 0 ? blogs.filter((blog, index) => index !== 0) : [];

  return (
    <main className="font-sans text-gray-800 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      
      {/* ==================== MODERN HERO SECTION ==================== */}
      <section className="relative py-8 md:py-10 bg-gradient-to-br from-[#0B1530] via-[#1a2b5c] to-[#0B1530] text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              x: [0, -30, 0],
              y: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 right-0 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"
          ></motion.div>
          <motion.div
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"
          ></motion.div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 max-w-6xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", type: "spring", stiffness: 100 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A227]/20 backdrop-blur-sm border border-[#C9A227]/30 mb-3"
          >
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <FaBookOpen className="text-[#C9A227]" size={14} />
            </motion.div>
            <span className="text-[#C9A227] font-semibold tracking-wider uppercase text-xs">
              Insights & Articles
            </span>
          </motion.div>
          
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-3 leading-tight"
          >
            Our{' '}
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A227] via-[#F5D76E] to-[#C9A227] animate-gradient"
            >
              Blog
            </motion.span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
            className="text-sm sm:text-base md:text-lg text-gray-300 max-w-3xl mx-auto font-light leading-relaxed mb-4"
          >
            Latest insights on taxation, compliance, and financial management to help your business thrive.
          </motion.p>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm"
          >
            <div className="flex items-center gap-2">
              <FaBookOpen className="text-[#C9A227]" size={16} />
              <span className="text-gray-300">{blogs.length} Articles</span>
            </div>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <div className="flex items-center gap-2">
              <FaClock className="text-[#C9A227]" size={16} />
              <span className="text-gray-300">Updated Weekly</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== FEATURED BLOG SECTION ==================== */}
      {featuredBlog && featuredBlog._id && (
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              <Link 
                to={`/blog/${featuredBlog._id}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="block"
              >
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/60">
                  {/* Featured Badge */}
                  <div className="absolute top-6 left-6 z-20 bg-gradient-to-r from-[#C9A227] to-[#F5D76E] px-4 py-2 rounded-full shadow-lg">
                    <span className="text-[#0B1530] text-xs font-bold uppercase tracking-wider">Featured</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Image Side */}
                    <div className="relative h-56 md:h-80 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className="w-full h-full"
                      >
                        <img
                          src={featuredBlog.image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80"}
                          alt={featuredBlog.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80";
                          }}
                        />
                      </motion.div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1530]/80 via-[#0B1530]/20 to-transparent"></div>
                      
                      {/* Category Badge on Image */}
                      {featuredBlog.category && (
                        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xl px-3 py-1.5 rounded-full">
                          <span className="text-[#0B1530] text-[10px] font-bold uppercase tracking-wider">
                            {featuredBlog.category}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Side */}
                    <div className="p-6 md:p-8 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50">
                      <div className="flex items-center gap-3 mb-3 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="text-[#C9A227]" size={10} />
                          {featuredBlog.createdAt ? format(new Date(featuredBlog.createdAt), 'MMM dd, yyyy') : 'Draft'}
                        </span>
                        {featuredBlog.readTime && (
                          <span className="flex items-center gap-1">
                            <FaClock className="text-[#C9A227]" size={10} />
                            {featuredBlog.readTime}
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0B1530] mb-3 group-hover:text-[#C9A227] transition-colors line-clamp-2">
                        {featuredBlog.title}
                      </h2>
                      
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 line-clamp-3">
                        {stripHtml(featuredBlog.content)?.substring(0, 180)}...
                      </p>

                      <motion.div
                        whileHover={{ x: 5 }}
                        className="inline-flex items-center gap-1.5 text-[#0B1530] font-semibold text-xs group-hover:text-[#C9A227] transition-colors"
                      >
                        Read Full Article
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" size={12} />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ==================== MODERN BLOG GRID ==================== */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {regularBlogs.length > 0 && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl font-serif font-bold text-[#0B1530] mb-6 md:mb-8"
            >
              Latest Articles
            </motion.h2>
          )}
          
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {regularBlogs.map((blog, index) => {
              if (!blog._id) {
                console.warn('Blog missing _id:', blog);
                return null;
              }
              
              const blogId = blog._id?.toString ? blog._id.toString() : blog._id;
              
              return (
                <motion.div
                  key={blogId}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Link 
                    to={`/blog/${blogId}`}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="block h-full group"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-gray-200/60 h-full flex flex-col backdrop-blur-sm">
                      {/* Image Area - Modern Design */}
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        <motion.div
                          whileHover={{ scale: 1.15 }}
                          transition={{ duration: 0.6 }}
                          className="w-full h-full"
                        >
                          <img
                            src={blog.image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80"}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80";
                            }}
                          />
                        </motion.div>
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1530]/70 via-transparent to-transparent"></div>
                        
                        {/* Shine Effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full"
                          transition={{ duration: 0.8, ease: "easeInOut" }}
                        />
                        
                        {/* Category Badge */}
                        {blog.category && (
                          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xl px-2.5 py-1 rounded-full shadow-md border border-gray-200/50">
                            <span className="text-[#0B1530] text-[10px] font-bold uppercase tracking-wider">
                              {blog.category}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Area - Modern Typography */}
                      <div className="p-5 md:p-6 flex flex-col flex-grow">
                        {/* Date & Read Time */}
                        <div className="flex items-center gap-2 mb-3 text-[10px] text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt className="text-[#C9A227]" size={9} />
                            {blog.createdAt ? format(new Date(blog.createdAt), 'MMM dd, yyyy') : 'Draft'}
                          </span>
                          {blog.readTime && (
                            <span className="flex items-center gap-1">
                              <FaClock className="text-[#C9A227]" size={9} />
                              {blog.readTime}
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg md:text-xl font-serif font-bold text-[#0B1530] mb-2 line-clamp-2 group-hover:text-[#C9A227] transition-colors duration-300">
                          {blog.title}
                        </h3>
                        
                        <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                          {stripHtml(blog.content)?.substring(0, 130)}...
                        </p>

                        {/* Read More Button - Modern Design */}
                        <div className="mt-auto pt-3 border-t border-gray-100/50">
                          <motion.div
                            whileHover={{ x: 5 }}
                            className="inline-flex items-center gap-1.5 text-[#0B1530] font-semibold text-xs group-hover:text-[#C9A227] transition-colors"
                          >
                            Read Article
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform" size={10} />
                          </motion.div>
                        </div>
                      </div>

                      {/* Decorative Corner */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#C9A227]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State - Modern Design */}
          {blogs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 md:py-24"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <FaBookOpen className="text-gray-400" size={32} />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No articles found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Check back later for new articles.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Blog;
