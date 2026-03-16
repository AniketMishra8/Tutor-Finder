import { useState, useRef, useEffect } from 'react';
import { HiOutlineChatAlt2, HiOutlineX, HiOutlinePaperAirplane, HiOutlineSparkles } from 'react-icons/hi';
import './AIChatbot.css';
import { useAuth } from '../context/AuthContext';

export default function AIChatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hi there! I'm DeepThink AI. How can I help you with your subjects or scheduling today?",
    }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const newUserMessage = {
      id: Date.now(),
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatHistory(prev => [...prev, newUserMessage]);
    setMessage('');

    // Call Gemini API
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `You are DeepThink AI, an intelligent, concise, and helpful tutoring assistant for a platform called Tutor Finder. Only answer the user's query thoughtfully: ${message}` }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const aiResponseText = data.candidates[0].content.parts[0].text;

      const newAIMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, newAIMessage]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }
  };

  const getGreetingName = () => {
    return user ? user.name.split(' ')[0] : 'Guest';
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        className={`ai-toggle-btn ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Assistant"
      >
        <span className="ai-toggle-icon"><HiOutlineSparkles /></span>
      </button>

      {/* Overlay for mobile (optional, but good for focus) */}
      {isOpen && (
         <div className="ai-overlay" onClick={() => setIsOpen(false)}></div>
      )}

      {/* Chat Sidebar */}
      <div className={`ai-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="ai-header">
          <div className="ai-header-info">
            <div className="ai-avatar">
              <HiOutlineSparkles />
            </div>
            <div>
              <h3 className="ai-title">DeepThink AI</h3>
              <span className="ai-status">Online • Ready to help {getGreetingName()}</span>
            </div>
          </div>
          <button className="ai-close-btn" onClick={() => setIsOpen(false)} aria-label="Close AI Sidebar">
            <HiOutlineX />
          </button>
        </div>

        <div className="ai-messages">
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.sender}`}>
              {msg.sender === 'ai' && (
                <div className="message-avatar ai"><HiOutlineSparkles /></div>
              )}
              <div className="message-content-wrapper">
                <div className="message-bubble">
                  {msg.text}
                </div>
                <span className="message-time">{msg.time}</span>
              </div>
              {msg.sender === 'user' && (
                <div className="message-avatar user">
                  {user ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-input-area">
          <form className="ai-input-form" onSubmit={handleSendMessage}>
            <input 
              type="text" 
              className="ai-input" 
              placeholder="Ask anything..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button 
              type="submit" 
              className="ai-send-btn" 
              disabled={!message.trim()}
              aria-label="Send Message"
            >
              <HiOutlinePaperAirplane className="send-icon" />
            </button>
          </form>
          <div className="ai-footer-text">
            AI can make mistakes. Consider verifying important information.
          </div>
        </div>
      </div>
    </>
  );
}
