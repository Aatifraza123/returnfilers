import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaQuestionCircle, 
  FaClock, 
  FaWhatsapp,
  FaChevronDown
} from 'react-icons/fa';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/contacts', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
      }
      reset();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: 'How soon will I receive a response?',
      answer: 'We typically respond within 24 hours on business days. For urgent matters, please call us directly.',
    },
    {
      question: 'Do you offer online consultations?',
      answer: 'Yes, we provide online consultations via Zoom or Google Meet. You can schedule a virtual meeting at your convenience.',
    },
    {
      question: 'What documents do I need for tax filing?',
      answer: 'We will provide a personalized checklist after our initial discussion. Generally, you\'ll need PAN card, Aadhaar, Form 16, bank statements, and investment proofs.',
    },
    {
      question: 'What services do you provide?',
      answer: 'We offer comprehensive tax planning, GST filing, company registration, audit services, accounting, and financial advisory services for individuals and businesses.',
    },
    {
      question: 'What are your consultation fees?',
      answer: 'Our consultation fees vary based on the service required. We offer free initial consultations for new clients. Contact us for detailed pricing.',
    },
    {
      question: 'Do you handle GST registration and filing?',
      answer: 'Yes, we provide complete GST services including registration, monthly/quarterly filing, return filing, and compliance management for businesses.',
    },
  ];

  return (
    <div className="font-sans bg-gray-50">
      
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative py-12 md:py-16 bg-[#0B1530] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.span 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-[#D4AF37] font-semibold tracking-widest uppercase text-sm mb-3 block"
          >
            We are here to help
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-3"
          >
            Get In Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-gray-300 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Have questions about your taxes or business finances? Send us a message and our expert team will respond promptly.
          </motion.p>
        </div>
      </section>

      {/* ==================== CONTACT INFO & FORM ==================== */}
      <section className="py-12 md:py-16 -mt-8">
        <div className="container mx-auto px-6 max-w-7xl"> {/* Increased max-width */}
          <div className="grid lg:grid-cols-2 gap-12"> {/* Increased gap */}
            
            {/* Left Column: Info Cards */}
            <div className="space-y-8">
               {/* Contact Information Card */}
               <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-10 border border-gray-100 relative overflow-hidden" // Increased padding
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#D4AF37]"></div>
                <h2 className="text-2xl font-serif font-bold mb-8 text-[#0B1530]">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start group">
                    <div className="bg-[#0B1530]/5 p-3 rounded-lg mr-4 group-hover:bg-[#0B1530] transition-colors duration-300">
                      <FaMapMarkerAlt className="text-[#0B1530] text-xl group-hover:text-[#D4AF37] transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0B1530] text-base mb-1">Office Address</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        123 Business Park, Financial District,<br />
                        Mumbai, Maharashtra 400001
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start group">
                    <div className="bg-[#0B1530]/5 p-3 rounded-lg mr-4 group-hover:bg-[#0B1530] transition-colors duration-300">
                      <FaPhone className="text-[#0B1530] text-xl group-hover:text-[#D4AF37] transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0B1530] text-base mb-1">Call Us</h3>
                      <p className="text-gray-600 text-sm">+91 98765 43210</p>
                      <p className="text-gray-500 text-xs">Mon-Fri, 9am - 6pm</p>
                    </div>
                  </div>

                  <div className="flex items-start group">
                    <div className="bg-[#0B1530]/5 p-3 rounded-lg mr-4 group-hover:bg-[#0B1530] transition-colors duration-300">
                      <FaEnvelope className="text-[#0B1530] text-xl group-hover:text-[#D4AF37] transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0B1530] text-base mb-1">Email Us</h3>
                      <p className="text-gray-600 text-sm">info@caassociates.com</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Office Hours & Quick Actions */}
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.2 }}
                 className="grid md:grid-cols-2 gap-8"
              >
                 <div className="bg-[#0B1530] text-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center gap-3 mb-4 text-[#D4AF37]">
                       <FaClock size={18} />
                       <h3 className="font-bold text-base">Office Hours</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-300">
                       <li className="flex justify-between"><span>Mon - Fri</span> <span>9am - 6pm</span></li>
                       <li className="flex justify-between"><span>Saturday</span> <span>10am - 2pm</span></li>
                       <li className="flex justify-between"><span>Sunday</span> <span className="text-red-300">Closed</span></li>
                    </ul>
                 </div>

                 <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2 text-green-600">
                       <FaWhatsapp size={22} />
                       <h3 className="font-bold text-[#0B1530] text-base">Quick Chat?</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Chat with us directly on WhatsApp.</p>
                    <button className="w-full py-2 bg-green-50 text-green-700 font-semibold rounded-lg hover:bg-green-100 transition-colors text-sm">
                       Start Chat
                    </button>
                 </div>
              </motion.div>
            </div>

            {/* Right Column: Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-xl border-t-4 border-[#D4AF37]"
            >
              <h2 className="text-2xl font-serif font-bold mb-2 text-[#0B1530]">Send a Message</h2>
              <p className="text-gray-500 text-sm mb-6">Fill out the form below and we'll get back to you.</p>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  {...register('name', { required: 'Name is required' })}
                  error={errors.name?.message}
                  className="bg-gray-50 border-gray-200 focus:border-[#0B1530] focus:ring-0 rounded-lg text-sm py-2.5"
                />

                <div className="grid md:grid-cols-2 gap-4">
                   <Input
                     label="Email Address"
                     type="email"
                     placeholder="john@example.com"
                     {...register('email', {
                       required: 'Email is required',
                       pattern: {
                         value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                         message: 'Invalid email address',
                       },
                     })}
                     error={errors.email?.message}
                     className="bg-gray-50 border-gray-200 focus:border-[#0B1530] focus:ring-0 rounded-lg text-sm py-2.5"
                   />

                   <Input
                     label="Phone Number"
                     type="tel"
                     placeholder="+91..."
                     {...register('phone', { required: 'Phone is required' })}
                     error={errors.phone?.message}
                     className="bg-gray-50 border-gray-200 focus:border-[#0B1530] focus:ring-0 rounded-lg text-sm py-2.5"
                   />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    placeholder="How can we help you?"
                    {...register('message', { required: 'Message is required' })}
                    className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:border-[#0B1530] transition-all resize-none text-sm ${
                      errors.message ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-[#0B1530] hover:bg-[#1a2b5e] text-white py-3 text-base rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== FAQ SECTION ==================== */}
      <section className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-center mb-6 md:mb-8 lg:mb-12 text-[#0B1530]">Frequently Asked Questions</h2>
          <div className="space-y-3 md:space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-50 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 md:p-6 flex items-start gap-3 md:gap-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 rounded-lg"
                  >
                    <div className="mt-0.5 text-[#D4AF37] flex-shrink-0">
                       <FaQuestionCircle size={20} />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-sm md:text-base font-semibold text-[#0B1530] mb-0 hover:text-[#D4AF37] transition-colors font-sans">{faq.question}</h3>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-0.5 text-[#0B1530] flex-shrink-0"
                    >
                      <FaChevronDown size={16} />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: isOpen ? 'auto' : 0,
                      opacity: isOpen ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 md:px-6 pb-4 md:pb-6 pl-11 md:pl-14">
                      <p className="text-xs md:text-sm lg:text-base text-gray-600 leading-relaxed font-normal">{faq.answer}</p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;







