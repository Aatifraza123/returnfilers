import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaUser, FaPhoneAlt, FaRedo } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

// Format AI response with proper styling
const MessageContent = ({ content, isUser }) => {
  if (isUser) return <span>{content}</span>;
  
  const lines = content.split('\n');
  
  return (
    <div className="space-y-1">
      {lines.map((line, idx) => {
        const trimmedLine = line.trim();
        
        if (!trimmedLine) {
          return <div key={idx} className="h-1" />;
        }
        
        // Nested bullet points (+ at start, with or without space)
        if (/^\+\s*\S/.test(trimmedLine)) {
          const text = trimmedLine.replace(/^\+\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-4">
              <span className="w-1 h-1 rounded-full bg-[#041313] mt-1.5 flex-shrink-0"></span>
              <span className="text-[12px]">{formatText(text)}</span>
            </div>
          );
        }
        
        // Bullet points (* - •) with or without space
        if (/^[-•*]\s*\S/.test(trimmedLine) && !trimmedLine.startsWith('**')) {
          const text = trimmedLine.replace(/^[-•*]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#041313] mt-1.5 flex-shrink-0"></span>
              <span className="text-[13px]">{formatText(text)}</span>
            </div>
          );
        }
        
        // Numbered list
        if (/^\d+[\.\)]\s/.test(trimmedLine)) {
          const text = trimmedLine.replace(/^\d+[\.\)]\s*/, '');
          const num = trimmedLine.match(/^\d+/)[0];
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-0.5">
              <span className="w-4 h-4 rounded bg-[#041313] text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{num}</span>
              <span className="text-[12px]">{formatText(text)}</span>
            </div>
          );
        }
        
        // Headers (ending with :)
        if (trimmedLine.endsWith(':') && trimmedLine.length < 50 && !trimmedLine.includes('http') && !trimmedLine.includes('₹')) {
          return (
            <div key={idx} className="font-semibold text-[#0B1530] mt-2 mb-1 text-[13px]">
              {formatText(trimmedLine)}
            </div>
          );
        }
        
        return (
          <div key={idx} className="text-[13px]">
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
  
  // Match: **bold**, ₹prices, phone numbers, pipe separators, URLs, emails, internal routes (/path)
  const parts = text.split(/(\*\*[^*]+\*\*|₹[\d,]+(?:\s*[-–—]\s*₹?[\d,]+)?(?:\/\w+)?|\+91\s*\d{5}\s*\d{5}|\|\s*[\d\w-]+\s*(?:days?|hours?|weeks?)|https?:\/\/[^\s<>"{}|\\^`\[\]]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\/booking|\/services|\/digital-services|\/contact|\/quote|\/about|\/blog)/gi);
  
  return parts.map((part, idx) => {
    if (!part) return null;
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-semibold text-[#0B1530]">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('₹')) {
      return <span key={idx} className="font-semibold text-[#041313] px-1 rounded" style={{ backgroundColor: '#d3e3f2' }}>{part}</span>;
    }
    if (part.startsWith('|')) {
      return <span key={idx} className="text-gray-500 text-[11px]">{part}</span>;
    }
    if (part.startsWith('+91')) {
      return <a key={idx} href={`tel:${part.replace(/\s/g, '')}`} className="font-semibold text-[#0B1530] underline cursor-pointer hover:text-[#052626]">{part}</a>;
    }
    // Internal route links (e.g., /booking, /services, /contact)
    if (part === '/booking' || part === '/services' || part === '/digital-services' || part === '/contact' || part === '/quote' || part === '/about' || part === '/blog' || part === '/track-appointment') {
      const routeNames = {
        '/booking': '📅 Book Now',
        '/services': 'Our Services',
        '/digital-services': '🌐 Web Development',
        '/contact': 'Contact Us',
        '/quote': 'Get Quote',
        '/about': 'About Us',
        '/blog': 'Blog',
        '/track-appointment': '🔍 Track Appointment'
      };
      const displayName = routeNames[part] || part;
      return (
        <Link 
          key={idx} 
          to={part}
          className="inline-block px-2 py-0.5 bg-[#041313] text-white rounded font-semibold hover:bg-[#052626] hover:text-white transition-all duration-200 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {displayName}
        </Link>
      );
    }
    // URL - clickable with button style
    if (part.match(/^https?:\/\//i)) {
      const cleanUrl = part.replace(/[.,;:!?)]+$/, '');
      // Show friendly name for known URLs
      let displayName = cleanUrl;
      if (cleanUrl.includes('returnfilers.in')) {
        displayName = '🌐 returnfilers.in';
      }
      return (
        <a 
          key={idx} 
          href={cleanUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block px-2 py-0.5 text-[#041313] rounded font-medium transition-colors cursor-pointer hover:opacity-80"
          style={{ backgroundColor: '#d3e3f2' }}
          onClick={(e) => e.stopPropagation()}
        >
          {displayName}
        </a>
      );
    }
    // Email - clickable with button style
    if (part.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i)) {
      return (
        <a 
          key={idx} 
          href={`mailto:${part}`} 
          className="inline-block px-2 py-0.5 text-[#041313] rounded font-medium transition-colors cursor-pointer hover:opacity-80"
          style={{ backgroundColor: '#d3e3f2' }}
          onClick={(e) => e.stopPropagation()}
        >
          ✉️ {part}
        </a>
      );
    }
          ✉️ {part}
        </a>
      );
    }
    // Check if part contains URL that wasn't split (e.g., "at:https://...")
    if (part.includes('https://') || part.includes('http://')) {
      const urlMatch = part.match(/(https?:\/\/[^\s<>"{}|\\^`\[\]]+)/i);
      if (urlMatch) {
        const url = urlMatch[1].replace(/[.,;:!?)]+$/, '');
        const beforeUrl = part.substring(0, part.indexOf(urlMatch[1]));
        const afterUrl = part.substring(part.indexOf(urlMatch[1]) + urlMatch[1].length);
        return (
          <span key={idx}>
            {beforeUrl}
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sky-500 hover:text-sky-600 underline break-all"
            >
              {url}
            </a>
            {afterUrl}
          </span>
        );
      }
    }
    return part;
  });
};

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [settings, setSettings] = useState(null);
  const [position, setPosition] = useState({ bottom: 24, right: 24 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: '**Hello! 👋 Welcome to ReturnFilers**\n\nI can help you with:\n- Tax Filing & ITR\n- GST Registration & Returns\n- Company Registration\n- Accounting Services\n\n**How can I assist you today?**' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data.success) {
          setSettings(data.data);
          // Update initial message with company name
          setMessages([
            { 
              role: 'assistant', 
              content: `**Hello! 👋 Welcome to ${data.data.companyName || 'ReturnFilers'}**\n\nI can help you with:\n- Tax Filing & ITR\n- GST Registration & Returns\n- Company Registration\n- Accounting Services\n\n**How can I assist you today?**` 
            }
          ]);
        }
      } catch (error) {
        console.log('Settings fetch error');
      }
    };
    fetchSettings();
  }, []);

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
      // Hide on any page's hero section (first viewport)
      const scrollPosition = window.scrollY;
      
      if (scrollPosition < window.innerHeight) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Drag functionality
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - (window.innerWidth - position.right),
      y: e.clientY - (window.innerHeight - position.bottom)
    });
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - (window.innerWidth - position.right),
      y: touch.clientY - (window.innerHeight - position.bottom)
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const newRight = window.innerWidth - e.clientX + dragStart.x;
      const newBottom = window.innerHeight - e.clientY + dragStart.y;
      
      const maxRight = window.innerWidth - 60;
      const maxBottom = window.innerHeight - 60;
      
      setPosition({
        right: Math.max(10, Math.min(newRight, maxRight)),
        bottom: Math.max(10, Math.min(newBottom, maxBottom))
      });
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      
      const newRight = window.innerWidth - touch.clientX + dragStart.x;
      const newBottom = window.innerHeight - touch.clientY + dragStart.y;
      
      const maxRight = window.innerWidth - 60;
      const maxBottom = window.innerHeight - 60;
      
      setPosition({
        right: Math.max(10, Math.min(newRight, maxRight)),
        bottom: Math.max(10, Math.min(newBottom, maxBottom))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const clearChat = () => {
    setMessages([
      { 
        role: 'assistant', 
        content: `**Hello! 👋 Welcome to ${settings?.companyName || 'ReturnFilers'}**\n\nI can help you with:\n- Tax Filing & ITR\n- GST Registration & Returns\n- Company Registration\n- Accounting Services\n\n**How can I assist you today?**` 
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
    setIsStreaming(true);

    try {
      const history = messages.slice(-8).map(m => ({ role: m.role, content: m.content }));
      
      // Add empty assistant message for streaming
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${baseURL}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage, history }),
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      if (!response.ok) throw new Error('Stream failed');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullResponse += parsed.content;
                // Update the last message with streaming content
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    content: fullResponse
                  };
                  return newMessages;
                });
              }
              if (parsed.error) {
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    content: parsed.error
                  };
                  return newMessages;
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // If no response received, show error
      if (!fullResponse) {
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: `Sorry, I couldn't process that. Please try again or call us at ${settings?.phone || '+91 84471 27264'}`
          };
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      // Fallback to non-streaming API
      try {
        const history = messages.slice(-8).map(m => ({ role: m.role, content: m.content }));
        const { data } = await api.post('/chat', { message: userMessage, history }, { timeout: 15000 });
        
        if (data.success) {
          setMessages(prev => {
            const newMessages = [...prev];
            if (newMessages[newMessages.length - 1]?.role === 'assistant' && !newMessages[newMessages.length - 1]?.content) {
              newMessages[newMessages.length - 1] = { role: 'assistant', content: data.response };
            } else {
              newMessages.push({ role: 'assistant', content: data.response });
            }
            return newMessages;
          });
        } else {
          throw new Error('API failed');
        }
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          
          // Better error message based on error type
          let errorMessage = '';
          if (fallbackError.code === 'ECONNABORTED' || fallbackError.message.includes('timeout')) {
            errorMessage = `⏱️ Request timeout. Our AI is taking longer than usual.\n\nPlease try again or contact us:\n📞 ${settings?.phone || '+91 84471 27264'}\n📧 ${settings?.email || 'info@returnfilers.in'}`;
          } else if (fallbackError.code === 'ERR_NETWORK' || fallbackError.message.includes('Network Error')) {
            errorMessage = `🔌 Network connection issue. Please check your internet connection.\n\nFor immediate assistance:\n📞 ${settings?.phone || '+91 84471 27264'}\n📧 ${settings?.email || 'info@returnfilers.in'}`;
          } else {
            errorMessage = `⚠️ Our AI assistant is temporarily unavailable.\n\nPlease contact us directly:\n📞 ${settings?.phone || '+91 84471 27264'}\n📧 ${settings?.email || 'info@returnfilers.in'}\n\nWe're here to help! 😊`;
          }
          
          if (lastMsg?.role === 'assistant' && !lastMsg?.content) {
            newMessages[newMessages.length - 1] = {
              role: 'assistant',
              content: errorMessage
            };
          } else {
            newMessages.push({
              role: 'assistant',
              content: errorMessage
            });
          }
          return newMessages;
        });
      }
    } finally {
      setLoading(false);
      setIsStreaming(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    setTimeout(() => sendMessage(), 100);
  };

  const quickQuestions = [
    'Our Services',
    'Pricing Info',
    'Book Appointment',
    'Contact Us'
  ];

  // Don't render if chatbot is disabled (check after all hooks)
  if (settings && settings.features?.enableChatbot === false) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div
        className={`fixed z-50 transition-all duration-300 ${
          isOpen ? 'scale-0 opacity-0' : isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
        style={{ 
          bottom: `${position.bottom}px`, 
          right: `${position.right}px`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        <button
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={(e) => {
            if (!isDragging) setIsOpen(true);
          }}
          className="relative group"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-all duration-300 group-hover:scale-110 active:scale-95">
            <FaRobot size={24} className="text-white" />
          </div>
        </button>
      </div>

      {/* Chat Window - Hostinger Style */}
      <div 
        className={`fixed z-50 w-[calc(100vw-2rem)] sm:w-[400px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isOpen && isVisible ? 'opacity-100 scale-100 h-[80vh] sm:h-[600px]' : 'opacity-0 scale-95 h-0 pointer-events-none'
        }`}
        style={{ 
          bottom: `${position.bottom}px`, 
          right: `${position.right}px`
        }}
      >
        {/* Header - Hostinger Style */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
              <FaRobot size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-base">ReturnFilers AI</h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Online
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={clearChat}
              className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-600"
              title="New chat"
            >
              <FaRedo size={14} />
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-600"
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>

        {/* Messages - Hostinger Style */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {messages.filter(msg => msg.content).map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center flex-shrink-0 mr-2">
                  <FaRobot size={14} className="text-white" />
                </div>
              )}
              <div className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'text-gray-800 rounded-2xl rounded-tr-md'
                  : 'text-gray-800 rounded-2xl rounded-tl-md shadow-sm'
              }`} style={msg.role === 'user' ? { backgroundColor: '#f9e9fc' } : { backgroundColor: '#e9effc' }}>
                <MessageContent content={msg.content} isUser={msg.role === 'user'} />
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 ml-2">
                  <FaUser size={12} className="text-gray-600" />
                </div>
              )}
            </div>
          ))}
          
          {loading && messages[messages.length - 1]?.content === '' && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center flex-shrink-0 mr-2">
                <FaRobot size={14} className="text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-md shadow-sm" style={{ backgroundColor: '#e9effc' }}>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          
          {/* Quick Questions */}
          {messages.length <= 2 && !loading && (
            <div className="space-y-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(q)}
                  className="w-full px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 hover:border-purple-300 rounded-xl text-sm text-left text-gray-700 font-medium transition-all duration-200 shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input - Hostinger Style */}
        <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl text-sm bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 placeholder-gray-400 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-11 h-11 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <FaPaperPlane size={14} />
            </button>
          </form>
          
          <div className="mt-3 text-center">
            <a href={`tel:${settings?.phone?.replace(/\s/g, '') || '+918447127264'}`} className="text-xs text-gray-500 hover:text-purple-600 flex items-center justify-center gap-1.5 transition-colors">
              <FaPhoneAlt size={10} /> {settings?.phone || '+91 84471 27264'}
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChatbot;



