import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaUser, FaPhoneAlt, FaRedo } from 'react-icons/fa';
import api from '../../api/axios';

// Format AI response with proper styling
const MessageContent = ({ content, isUser }) => {
  if (isUser) return <span>{content}</span>;
  
  const lines = content.split('\n');
  
  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        const trimmedLine = line.trim();
        
        if (!trimmedLine) {
          return <div key={idx} className="h-0.5" />;
        }
        
        // Bullet points
        if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
          const text = trimmedLine.replace(/^[-•]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 mt-1.5 flex-shrink-0"></span>
              <span className="text-[12px]">{formatText(text)}</span>
            </div>
          );
        }
        
        // Numbered list
        if (/^\d+[\.\)]\s/.test(trimmedLine)) {
          const text = trimmedLine.replace(/^\d+[\.\)]\s*/, '');
          const num = trimmedLine.match(/^\d+/)[0];
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-0.5">
              <span className="w-4 h-4 rounded-md bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{num}</span>
              <span className="text-[12px]">{formatText(text)}</span>
            </div>
          );
        }
        
        // Headers
        if (trimmedLine.endsWith(':') && trimmedLine.length < 40 && !trimmedLine.includes('http')) {
          return (
            <div key={idx} className="font-semibold text-gray-800 mt-1.5 text-[12px]">
              {formatText(trimmedLine)}
            </div>
          );
        }
        
        return (
          <div key={idx} className="text-[12px]">
            {formatText(trimmedLine)}
          </div>
        );
      })}
    </div>
  );
};

// Format inline text
const formatText = (text) => {
  if (!text) return null;
  
  const parts = text.split(/(\*\*[^*]+\*\*|₹[\d,]+(?:\s*-\s*₹?[\d,]+)?(?:\/month)?|\+91\s*\d{5}\s*\d{5})/g);
  
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-semibold text-gray-800">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('₹')) {
      return <span key={idx} className="font-semibold text-violet-700 bg-violet-50 px-1 rounded">{part}</span>;
    }
    if (part.startsWith('+91')) {
      return <a key={idx} href={`tel:${part.replace(/\s/g, '')}`} className="font-semibold text-violet-600 underline">{part}</a>;
    }
    return part;
  });
};

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hello! 👋 Welcome to Tax Filer.\n\nI can help you with:\n- Tax Filing & ITR\n- GST Registration & Returns\n- Company Registration\n- Accounting Services\n\nHow can I assist you today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOpenChatbot = () => setIsOpen(true);
    window.addEventListener('openChatbot', handleOpenChatbot);
    return () => window.removeEventListener('openChatbot', handleOpenChatbot);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer');
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (footerRect.top < windowHeight + 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const clearChat = () => {
    setMessages([
      { 
        role: 'assistant', 
        content: 'Hello! 👋 Welcome to Tax Filer.\n\nI can help you with:\n- Tax Filing & ITR\n- GST Registration & Returns\n- Company Registration\n- Accounting Services\n\nHow can I assist you today?' 
      }
    ]);
  };

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const history = messages.slice(-8).map(m => ({ role: m.role, content: m.content }));
      const { data } = await api.post('/chat', { message: userMessage, history });
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Sorry, I couldn\'t process that. Please try again or call us at +91 84471 27264' 
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Connection issue. Please try again or call us at +91 84471 27264' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    setTimeout(() => sendMessage(), 100);
  };

  const quickQuestions = [
    'GST Registration',
    'ITR Filing Cost',
    'Company Registration',
    'All Services'
  ];


  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-4 md:right-6 z-50 transition-all duration-300 ${
          isOpen ? 'scale-0 opacity-0' : isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-violet-600 to-purple-700 rounded-full shadow-lg shadow-violet-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-violet-500/40 hover:scale-105 transition-all">
          <FaRobot size={24} className="text-white md:text-[28px]" />
          <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-green-400 rounded-full animate-pulse border-2 border-white"></span>
        </div>
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] md:w-[400px] bg-white rounded-3xl shadow-2xl shadow-violet-500/20 flex flex-col overflow-hidden border border-violet-100 transition-all duration-300 ${
          isOpen && isVisible ? 'opacity-100 scale-100 h-[75vh] sm:h-[500px] md:h-[550px]' : 'opacity-0 scale-95 h-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 text-white p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <FaRobot size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Tax Filer AI</h3>
              <div className="flex items-center gap-1.5 text-xs text-violet-200">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Online now
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={clearChat}
              className="w-9 h-9 rounded-xl hover:bg-white/20 flex items-center justify-center transition-colors"
              title="New chat"
            >
              <FaRedo size={13} />
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 rounded-xl hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gradient-to-b from-violet-50/50 to-white">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white' 
                    : 'bg-gradient-to-br from-violet-600 to-purple-700 text-white'
                }`}>
                  {msg.role === 'user' ? <FaUser size={11} /> : <FaRobot size={12} />}
                </div>
                <div className={`px-4 py-3 text-[13px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-2xl rounded-br-md'
                    : 'bg-white text-gray-700 rounded-2xl rounded-bl-md shadow-sm border border-violet-100'
                }`}>
                  <MessageContent content={msg.content} isUser={msg.role === 'user'} />
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 text-white flex items-center justify-center">
                  <FaRobot size={12} />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-violet-100">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length <= 2 && !loading && (
          <div className="px-4 py-3 bg-white border-t border-violet-100 flex-shrink-0">
            <p className="text-[10px] text-gray-400 mb-2 font-medium uppercase tracking-wide">Quick Questions</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(q)}
                  className="px-3 py-1.5 bg-violet-50 hover:bg-gradient-to-r hover:from-violet-600 hover:to-purple-600 text-violet-700 hover:text-white rounded-full text-[11px] font-medium transition-all border border-violet-200 hover:border-transparent"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3 bg-white border-t border-violet-100 flex-shrink-0">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-violet-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:opacity-50 placeholder-gray-400 border border-violet-100"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPaperPlane size={14} />
            </button>
          </form>
          
          <div className="mt-2 text-center">
            <a href="tel:+918447127264" className="text-[10px] text-gray-400 hover:text-violet-600 flex items-center justify-center gap-1 transition-colors">
              <FaPhoneAlt size={8} /> +91 84471 27264
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChatbot;
