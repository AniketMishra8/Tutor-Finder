import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineChatAlt2, HiSearch, HiPaperAirplane } from 'react-icons/hi';
import { FaChevronLeft } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { tutors } from '../data/mockData';
import './Messages.css';

export default function Messages() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeContact, setActiveContact] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initial mock messages state grouped by contact ID
  const [chatHistories, setChatHistories] = useState(
    tutors.reduce((acc, tutor) => {
      // Generate some dummy initial messages for each contact
      acc[tutor.id] = [
        {
          id: 1,
          text: `Hi ${tutor.name}, I have a question regarding the upcoming session.`,
          sender: 'me',
          time: '10:00 AM',
        },
        {
          id: 2,
          text: `Hello! How can I help you today?`,
          sender: 'them',
          time: '10:05 AM',
        },
      ];
      return acc;
    }, {})
  );

  // Auto-scroll to bottom of message history
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeContact, chatHistories]);

  // Set initial active contact (e.g., if passing state from Tutor Profile)
  useEffect(() => {
    // Check if we came from a specific tutor profile
    if (location.state && location.state.tutorId) {
      const targetTutor = tutors.find((t) => t.id === location.state.tutorId);
      if (targetTutor) {
        setActiveContact(targetTutor);
        return;
      }
    }
    // Default to the first tutor if none specified
    if (tutors.length > 0 && !activeContact) {
      setActiveContact(tutors[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;

    const newMsgObj = {
      id: Date.now(),
      text: newMessage,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistories((prev) => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsgObj],
    }));

    setNewMessage('');
    
    // Simulate an auto-reply after 1 second for demonstration
    setTimeout(() => {
      const replyObj = {
        id: Date.now() + 1,
        text: `Thanks for your message! I will get back to you shortly.`,
        sender: 'them',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistories((prev) => ({
        ...prev,
        [activeContact.id]: [...(prev[activeContact.id] || []), replyObj],
      }));
    }, 1000);
  };

  const filteredContacts = tutors.filter((tutor) =>
    tutor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="messages-page page-enter">
      <div className={`messages-container ${activeContact ? 'chat-active' : ''}`}>
        
        {/* --- Sidebar (Contacts List) --- */}
        <div className="messages-sidebar">
          <div className="sidebar-header">
            <h2>Messages</h2>
            <button className="back-btn" onClick={() => navigate(-1)} title="Go Back">
              <FaChevronLeft style={{ fontSize: '1rem' }} />
            </button>
          </div>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Search contacts..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="contacts-list">
            {filteredContacts.map((tutor) => {
              const lastMsg = chatHistories[tutor.id]?.slice(-1)[0] || {};
              return (
                <div
                  key={tutor.id}
                  className={`contact-item ${activeContact?.id === tutor.id ? 'active' : ''}`}
                  onClick={() => setActiveContact(tutor)}
                >
                  <img src={tutor.avatar} alt={tutor.name} className="contact-avatar" />
                  <div className="contact-info">
                    <div className="contact-name-row">
                      <span className="contact-name">{tutor.name}</span>
                      <span className="contact-time">{lastMsg.time || ''}</span>
                    </div>
                    <div className="contact-last-message">
                      {lastMsg.sender === 'me' ? 'You: ' : ''}
                      {lastMsg.text || 'No messages yet'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- Main Chat Area --- */}
        <div className="messages-main">
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                {/* Mobile back button: deselects contact to show sidebar */}
                <button 
                  className="back-btn" 
                  onClick={() => setActiveContact(null)}
                  style={{ display: window.innerWidth <= 768 ? 'flex' : 'none' }}
                >
                  <FaChevronLeft style={{ fontSize: '1rem' }} />
                </button>
                <img src={activeContact.avatar} alt={activeContact.name} className="chat-header-avatar" />
                <div className="chat-header-info">
                  <h3 className="chat-header-name">{activeContact.name}</h3>
                  <span className="chat-header-status">Online</span>
                </div>
              </div>

              {/* Chat History */}
              <div className="chat-history">
                {chatHistories[activeContact.id]?.map((msg) => (
                  <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                    <div className="message-bubble">
                      <div className="message-content">{msg.text}</div>
                      <span className="message-time">{msg.time}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form className="chat-input-container" onSubmit={handleSendMessage}>
                <input
                  ref={inputRef}
                  type="text"
                  className="chat-input"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="send-btn" 
                  disabled={!newMessage.trim()}
                  title="Send"
                >
                  <HiPaperAirplane style={{ transform: 'rotate(90deg)' }} />
                </button>
              </form>
            </>
          ) : (
            // Empty State (when no contact is selected on desktop)
            <div className="empty-chat-state">
              <HiOutlineChatAlt2 style={{ fontSize: '5rem', opacity: 0.5 }} />
              <h2>Select a chat to start messaging</h2>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
