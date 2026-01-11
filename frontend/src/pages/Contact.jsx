import { useState, useEffect } from 'react';
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
  FaRobot,
  FaWhatsapp,
  FaChevronDown
} from 'react-icons/fa';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  const fetchSettings = async () => {
    setSettingsLoading(true);
    try {
      console.log('🔄 Fetching settings from API...');
      const response = await api.get('/settings');
      console.log('✅ Settings API Response:', response);
      console.log('📦 Response data:', response.data);
      
      if (response.data.success) {
        console.log('✅ Settings data found:', response.data.data);
        setSettings(response.data.data);
      } else {
        console.log('⚠️ No success flag, using direct data:', response.data);
        setSettings(response.data);
      }
    } catch (error) {
      console.error('❌ Error fetching settings:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setSettingsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSettings();
  }, []);
  
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
            className="text-[#C9A227] font-semibold tracking-widest uppercase text-sm mb-3 block"
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
            className="text-sm md:text-base text-white max-w-3xl mx-auto"
          >
            Have questions about your taxes or business finances? Send us a message and our team will respond promptly.
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
                className="bg-white rounded-xl shadow-lg p-10 border border-gray-100 relative overflow-hidden"
              >
                <h2 className="text-2xl font-serif font-bold mb-8 text-[#0B1530]">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-[#0B1530]/5 p-3 rounded-lg mr-4">
                      <FaMapMarkerAlt className="text-[#0B1530] text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0B1530] text-base mb-1">Office Address</h3>
                      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                        SA-28 First Floor, Jaipuria Sunrise Plaza
                        12A Ahinsa Khand-I, Indrapuram
                        Ghaziabad, Uttar Pradesh 201014
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-[#0B1530]/5 p-3 rounded-lg mr-4">
                      <FaPhone className="text-[#0B1530] text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0B1530] text-base mb-1">Call Us</h3>
                      <a href="tel:+918447127264" className="text-gray-600 hover:text-[#C9A227] transition-colors text-sm block">
                        +91 84471 27264
                      </a>
                      <p className="text-gray-500 text-xs mt-2">Mon-Fri, 9am - 6pm</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-[#0B1530]/5 p-3 rounded-lg mr-4">
                      <FaEnvelope className="text-[#0B1530] text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0B1530] text-base mb-1">Email Us</h3>
                      <a href="mailto:info@returnfilers.in" className="text-gray-600 hover:text-[#C9A227] transition-colors text-sm">
                        info@returnfilers.in
                      </a>
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
                    <div className="flex items-center gap-3 mb-4 text-[#C9A227]">
                       <FaClock size={18} />
                       <h3 className="font-bold text-base">Office Hours</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-300">
                       <li className="flex justify-between">
                         <span>Mon - Fri</span> 
                         <span>{settings?.businessHours?.weekdays?.includes(':') ? settings.businessHours.weekdays.substring(settings.businessHours.weekdays.indexOf(':') + 1).trim() : (settings?.businessHours?.weekdays || '9am - 6pm')}</span>
                       </li>
                       <li className="flex justify-between">
                         <span>Saturday</span> 
                         <span>{settings?.businessHours?.saturday?.includes(':') ? settings.businessHours.saturday.substring(settings.businessHours.saturday.indexOf(':') + 1).trim() : (settings?.businessHours?.saturday || '10am - 2pm')}</span>
                       </li>
                       <li className="flex justify-between">
                         <span>Sunday</span> 
                         <span className="text-red-300">{settings?.businessHours?.sunday?.includes(':') ? settings.businessHours.sunday.substring(settings.businessHours.sunday.indexOf(':') + 1).trim() : (settings?.businessHours?.sunday || 'Closed')}</span>
                       </li>
                    </ul>
                 </div>

                 <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2 text-[#0B1530]">
                       <FaWhatsapp size={22} className="text-[#25D366]" />
                       <h3 className="font-bold text-[#0B1530] text-base">WhatsApp Us</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Chat with us directly on WhatsApp.</p>
                    <a 
                       href="https://wa.me/918447127264?text=Hi%2C%20I%20need%20help%20with%20tax%20services"
                       target="_blank"
                       rel="noopener noreferrer"
                       className="w-full py-2 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#128C7E] transition-colors text-sm text-center flex items-center justify-center gap-2"
                    >
                       <FaWhatsapp size={16} />
                       Start Chat
                    </a>
                 </div>
              </motion.div>
            </div>

            {/* Right Column: Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-xl border border-gray-100"
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
                     placeholder="9876543210"
                     maxLength={10}
                     {...register('phone', { 
                       required: 'Phone is required',
                       pattern: {
                         value: /^[6-9]\d{9}$/,
                         message: 'Enter valid 10-digit mobile number'
                       }
                     })}
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
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-14"
          >
            <span className="inline-block px-4 py-1.5 bg-[#C9A227]/10 text-[#C9A227] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
              Got Questions?
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#0B1530] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
              Find answers to common questions about our services, process, and pricing.
            </p>
          </motion.div>

          {/* FAQ Grid */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                    isOpen 
                      ? 'border-[#C9A227] shadow-lg shadow-[#C9A227]/10' 
                      : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 md:p-6 flex items-start gap-4 cursor-pointer focus:outline-none text-left"
                  >
                    {/* Number Badge */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm transition-colors ${
                      isOpen 
                        ? 'bg-[#C9A227] text-[#0B1530]' 
                        : 'bg-[#0B1530]/5 text-[#0B1530]'
                    }`}>
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`text-sm md:text-base font-semibold transition-colors ${
                        isOpen ? 'text-[#C9A227]' : 'text-[#0B1530]'
                      }`}>
                        {faq.question}
                      </h3>
                    </div>
                    
                    {/* Toggle Icon */}
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        isOpen 
                          ? 'bg-[#C9A227] text-[#0B1530]' 
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <FaChevronDown size={12} />
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
                    <div className="px-5 md:px-6 pb-5 md:pb-6 pl-[4.5rem]">
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA Below FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-gray-500 mb-4">Still have questions?</p>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('openChatbot'))}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B1530] text-white rounded-full font-semibold hover:bg-[#C9A227] hover:text-[#0B1530] transition-all shadow-lg hover:shadow-xl"
            >
              <FaRobot size={18} />
              Chat with AI
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;







