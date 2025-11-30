import { motion } from 'framer-motion';
import {
  FaAward,
  FaUsers,
  FaHandshake,
  FaChartLine,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaShieldAlt,
  FaLightbulb,
  FaBalanceScale,
  FaHistory,
} from 'react-icons/fa';

const About = () => {
  const stats = [
    { icon: <FaUsers />, value: '500+', label: 'Happy Clients' },
    { icon: <FaAward />, value: '15+', label: 'Years Experience' },
    { icon: <FaHandshake />, value: '1000+', label: 'Projects Completed' },
    { icon: <FaChartLine />, value: '98%', label: 'Success Rate' },
  ];

  const team = [
    {
      name: 'CA Rajesh Kumar',
      position: 'Founder & Senior Partner',
      qualification: 'FCA, DISA (ICAI)',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop',
      social: { linkedin: '#', twitter: '#', email: 'mailto:rajesh@example.com' },
      about: 'Leads complex audits, large-scale tax planning and high-stakes financial strategy for enterprises.',
    },
    {
      name: 'CA Priya Sharma',
      position: 'Partner - Tax Advisory',
      qualification: 'ACA, MBA (Finance)',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop',
      social: { linkedin: '#', twitter: '#', email: 'mailto:priya@example.com' },
      about: 'Specializes in direct and indirect taxation, cross-border structuring and compliance.',
    },
    {
      name: 'CA Amit Patel',
      position: 'Partner - Audit Services',
      qualification: 'FCA, CFA',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop',
      social: { linkedin: '#', twitter: '#', email: 'mailto:amit@example.com' },
      about: 'Focuses on risk-based audits, internal controls and financial reporting advisory.',
    },
  ];

  const values = [
    { icon: <FaShieldAlt />, title: 'Integrity', desc: 'Upholding the highest ethical standards in every financial decision.' },
    { icon: <FaLightbulb />, title: 'Innovation', desc: 'Leveraging modern technology for smarter financial solutions.' },
    { icon: <FaBalanceScale />, title: 'Excellence', desc: 'Delivering precision and perfection in every audit and report.' },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <main className="font-sans text-gray-800 bg-gray-50">
      
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-[#0B1530] via-[#101d42] to-[#1a2b5e] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container mx-auto px-6 text-center relative z-10 max-w-5xl">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#D4AF37] font-bold tracking-widest uppercase text-base md:text-lg mb-5 block"
          >
            Who We Are
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight"
          >
            About <span className="text-[#D4AF37]">CA Associates</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Your trusted partner in financial excellence. We combine over 15 years of expertise with modern strategies to drive your business growth.
          </motion.p>
        </div>
      </section>

      {/* ==================== STATS ==================== */}
      <section className="py-6 bg-white shadow-md relative z-20 -mt-10 mx-4 md:mx-auto max-w-6xl rounded-xl border border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center px-2"
              >
                <div className="text-[#D4AF37] text-3xl mb-2 flex justify-center">{stat.icon}</div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#0B1530] mb-1">{stat.value}</h3>
                <p className="text-gray-500 text-xs md:text-sm uppercase tracking-wide font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== OUR HISTORY ==================== */}
      <section className="relative py-8 md:py-12 mt-6 bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white overflow-hidden">
        <FaHistory className="absolute top-10 right-10 text-white/5 text-[14rem] -rotate-12" />
        
        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <motion.div 
               initial={{ scale: 0 }}
               whileInView={{ scale: 1 }}
               viewport={{ once: true }}
               className="w-16 h-16 md:w-20 md:h-20 bg-[#D4AF37] rounded-full flex items-center justify-center text-[#0B1530] text-2xl md:text-3xl mb-6 shadow-lg shadow-[#D4AF37]/20"
            >
               <FaHandshake />
            </motion.div>

            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-sm md:text-base mb-4"
            >
              Our Journey
            </motion.span>

            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-serif font-bold mb-4"
            >
              Building Trust Since <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-amber-200">2010</span>
            </motion.h2>

            <div className="max-w-4xl mx-auto">
               <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="text-base md:text-lg text-gray-200 font-light leading-relaxed mb-4 italic"
              >
                "Founded with a singular vision: to provide comprehensive, transparent, and strategic financial solutions to businesses of all sizes."
              </motion.p>
              
              <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="text-sm md:text-base text-gray-400 leading-relaxed max-w-3xl mx-auto"
              >
                From a small practice to a full-service chartered accountancy firm serving over 500 clients across India, our journey has been driven by integrity, expertise, and long-term relationships. We don't just balance books; we build futures.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex gap-6 md:gap-8 justify-center"
            >
               <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-white">500+</div>
                  <div className="text-xs text-gray-500 uppercase mt-1">Clients</div>
               </div>
               <div className="w-px bg-white/10 h-8"></div>
               <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-white">15+</div>
                  <div className="text-xs text-gray-500 uppercase mt-1">Years</div>
               </div>
               <div className="w-px bg-white/10 h-8"></div>
               <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-white">100%</div>
                  <div className="text-xs text-gray-500 uppercase mt-1">Commitment</div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== LEADERSHIP TEAM ==================== */}
      <section className="py-8 md:py-12 bg-[#F9FAFB]">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-[#0B1530]">Our Leadership Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
              Seasoned professionals combining deep domain expertise with a client-first mindset.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-[380px]"
              >
                {/* Image */}
                <div className="h-[70%] w-full overflow-hidden transition-all duration-500 group-hover:h-[40%]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Basic Info */}
                <div className="px-5 pt-3 pb-3 text-center bg-white relative z-10 h-[30%] flex flex-col justify-center transition-all duration-500 group-hover:h-auto group-hover:pt-2">
                  <h3 className="text-lg md:text-xl font-bold text-[#0B1530]">{member.name}</h3>
                  <p className="text-[#D4AF37] font-medium text-xs md:text-sm mt-1">{member.position}</p>
                  <p className="text-xs text-gray-400 mt-1 group-hover:hidden transition-opacity">{member.qualification}</p>
                </div>

                {/* Hover Details */}
                <div className="absolute bottom-0 left-0 w-full bg-white px-5 pb-4 pt-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out flex flex-col items-center justify-end h-[60%]">
                  <p className="text-xs md:text-sm text-gray-600 text-center mb-4 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {member.about}
                  </p>
                  <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                    <a href={member.social.linkedin} className="p-2.5 bg-gray-100 text-[#0B1530] rounded-full hover:bg-[#0B1530] hover:text-white transition-colors"><FaLinkedin size={16}/></a>
                    <a href={member.social.twitter} className="p-2.5 bg-gray-100 text-[#0B1530] rounded-full hover:bg-[#0B1530] hover:text-white transition-colors"><FaTwitter size={16}/></a>
                    <a href={member.social.email} className="p-2.5 bg-gray-100 text-[#0B1530] rounded-full hover:bg-[#0B1530] hover:text-white transition-colors"><FaEnvelope size={16}/></a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CORE VALUES ==================== */}
      <section className="py-8 md:py-12 bg-gradient-to-br from-sky-50 to-sky-100 text-gray-800">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl font-serif font-bold text-center mb-6 text-[#0B1530]"
          >
            Our Core Values
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5, scale: 1.01 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-sky-100 text-center group hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-100 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl"></div>
                
                <div className="w-14 h-14 mx-auto bg-sky-50 rounded-full flex items-center justify-center text-2xl text-sky-600 mb-4 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300 shadow-sm z-10 relative">
                   {value.icon}
                </div>
                
                <h3 className="text-lg md:text-xl font-bold mb-2 text-[#0B1530] relative z-10">{value.title}</h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed relative z-10">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;








