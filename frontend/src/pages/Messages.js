import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Image, Smile, MoreVertical } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../contexts/AuthContext';

const Messages = () => {
  const navigate = useNavigate();
  const { matchId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    fetchMatchDetails();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMatchDetails = async () => {
    try {
      const res = await api.get('/api/matches');
      const currentMatch = res.data.matches?.find(m => m.id === matchId);
      setMatch(currentMatch);
    } catch (err) {
      console.error('Failed to fetch match:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/api/messages/${matchId}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !match) return;

    const receiverId = match.user1_id === user?.id ? match.user2_id : match.user1_id;

    try {
      await api.post('/api/messages', {
        match_id: matchId,
        receiver_id: receiverId,
        content: newMessage.trim()
      });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const otherUser = match?.other_user;

  return (
    <div style={{
      height: '100vh',
      background: 'var(--black)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          background: 'rgba(11, 15, 25, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.1)'
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/matches')}
          style={{
            background: 'none',
            border: 'none',
            padding: 8,
            cursor: 'pointer',
            color: 'white'
          }}
        >
          <ArrowLeft size={24} />
        </motion.button>

        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--gold-light), var(--gold-dark))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ color: 'var(--black)', fontWeight: 600, fontSize: 18 }}>
            {otherUser?.first_name?.[0] || '?'}
          </span>
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 16, marginBottom: 2 }}>{otherUser?.first_name || 'Loading...'}</h3>
          <span style={{ fontSize: 12, color: 'var(--gold)' }}>Online</span>
        </div>

        <button style={{
          background: 'none',
          border: 'none',
          padding: 8,
          cursor: 'pointer',
          color: 'var(--gray)'
        }}>
          <MoreVertical size={20} />
        </button>
      </motion.header>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--gray-light)' }}>
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: 60,
              color: 'var(--gray-light)'
            }}
          >
            <p style={{ marginBottom: 8 }}>No messages yet</p>
            <p style={{ fontSize: 14 }}>Send a message to start the conversation!</p>
          </motion.div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: 'flex',
                  justifyContent: isMe ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '70%',
                  padding: '14px 18px',
                  borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  background: isMe 
                    ? 'linear-gradient(135deg, var(--gold-light), var(--gold-dark))' 
                    : 'rgba(255,255,255,0.05)',
                  color: isMe ? 'var(--black)' : 'white'
                }}>
                  <p style={{ fontSize: 15, lineHeight: 1.5, marginBottom: 6 }}>{msg.content}</p>
                  <span style={{ 
                    fontSize: 11, 
                    opacity: 0.7,
                    display: 'block',
                    textAlign: 'right'
                  }}>
                    {formatTime(msg.created_at)}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.form
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onSubmit={sendMessage}
        style={{
          padding: 20,
          background: 'rgba(11, 15, 25, 0.95)',
          borderTop: '1px solid rgba(212, 175, 55, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}
      >
        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            padding: 8,
            cursor: 'pointer',
            color: 'var(--gray)'
          }}
        >
          <Image size={22} />
        </button>

        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '14px 20px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(212, 175, 55, 0.1)',
            borderRadius: 24,
            color: 'white',
            fontSize: 15,
            outline: 'none'
          }}
        />

        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            padding: 8,
            cursor: 'pointer',
            color: 'var(--gray)'
          }}
        >
          <Smile size={22} />
        </button>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!newMessage.trim()}
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: newMessage.trim() 
              ? 'linear-gradient(135deg, var(--gold-light), var(--gold-dark))'
              : 'rgba(255,255,255,0.05)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: newMessage.trim() ? 'pointer' : 'not-allowed'
          }}
        >
          <Send size={20} color={newMessage.trim() ? 'var(--black)' : 'var(--gray)'} />
        </motion.button>
      </motion.form>
    </div>
  );
};

export default Messages;
