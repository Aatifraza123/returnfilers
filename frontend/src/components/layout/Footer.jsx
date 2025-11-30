import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaPaperPlane } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/newsletter/subscribe', { email });
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch (error) {
      toast.error('Subscription failed');
    }
  };

  return (
    <footer className="bg-black text-white font-sans">
      {/* Reduced vertical padding (py-8) but kept standard width */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-10">
          
          {/* CA Associates Section */}
          <div className="space-y-5">
            <h3 className="text-3xl font-serif font-bold text-[#D4AF37]">CA Associates</h3>
            <p className="text-gray-300 text-base leading-relaxed">
              Professional chartered accountancy services with 15+ years of experience
              in taxation, auditing, and financial consulting. Committed to your financial success.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-5 pt-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-white transition-colors transform hover:scale-110">
                <FaFacebook size={22} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-white transition-colors transform hover:scale-110">
                <FaTwitter size={22} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-white transition-colors transform hover:scale-110">
                <FaLinkedin size={22} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-white transition-colors transform hover:scale-110">
                <FaInstagram size={22} />
              </a>
            </div>

            {/* Copyright */}
            <div className="text-gray-500 text-sm pt-2">
              © {new Date().getFullYear()} CA Associates. All rights reserved.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold mb-6 text-white text-xl">Quick Links</h4>
            <ul className="space-y-4 text-base">
              <li><Link to="/about" className="text-[#D4AF37] hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-[#D4AF37] hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/portfolio" className="text-[#D4AF37] hover:text-white transition-colors">Portfolio</Link></li>
              <li><Link to="/contact" className="text-[#D4AF37] hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/blog" className="text-[#D4AF37] hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-serif font-bold mb-6 text-white text-xl">Legal</h4>
            <ul className="space-y-4 text-base">
              <li><Link to="/privacy-policy" className="text-[#D4AF37] hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="text-[#D4AF37] hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" className="text-[#D4AF37] hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif font-bold mb-4 text-white text-lg">Newsletter</h4>
            <p className="text-gray-300 text-sm mb-4">Get the latest financial updates directly to your inbox.</p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full pl-4 pr-12 py-2.5 rounded-full bg-[#1A1A1A] text-white border border-[#333] focus:outline-none focus:border-[#D4AF37] transition-all placeholder-gray-500 text-sm"
                required
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 w-9 h-9 flex items-center justify-center bg-[#D4AF37] text-black rounded-full hover:bg-white transition-colors shadow-lg"
                aria-label="Subscribe"
              >
                <FaPaperPlane size={14} className="-ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


