import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Image, Smile, MoreVertical, Phone, Video, Shield } from 'lucide-react';
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

  const demoMatch = {
    id: matchId,
    other_user: {
      first_name: 'Sophia',
      age: 24,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      verified: true,
      online: true
    }
  };

  const demoMessages = [
    { id: '1', sender_id: 'other', content: 'Hey! Love your profile 😊', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: '2', sender_id: user?.id, content: 'Thank you! Yours is amazing too!', created_at: new Date(Date.now() - 3000000).toISOString() },
    { id: '3', sender_id: 'other', content: 'Would you like to grab coffee sometime?', created_at: new Date(Date.now() - 1800000).toISOString() }
  ];

  const fetchMatchDetails = async () => {
    try {
      const res = await api.get('/api/matches');
      const currentMatch = res.data.matches?.find(m => m.id === matchId);
      setMatch(currentMatch || demoMatch);
    } catch (err) {
      setMatch(demoMatch);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/api/messages/${matchId}`);
      setMessages(res.data.messages || demoMessages);
    } catch (err) {
      setMessages(demoMessages);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempMessage = {
      id: Date.now().toString(),
      sender_id: user?.id,
      content: newMessage.trim(),
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');

    try {
      await api.post('/api/messages', {
        match_id: matchId,
        receiver_id: match?.other_user?.id || 'other',
        content: tempMessage.content
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const otherUser = match?.other_user || demoMatch.other_user;

  return (
    <div style={{
      height: '100vh',
      background: 'var(--black)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'rgba(3, 5, 8, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
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
          <ArrowLeft size={22} />
        </motion.button>

        <div 
          onClick={() => {}}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer'
          }}
        >
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: otherUser?.photo 
                ? `url(${otherUser.photo}) center/cover`
                : 'var(--gradient-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {!otherUser?.photo && (
                <span style={{ color: '#030508', fontWeight: 600 }}>
                  {otherUser?.first_name?.[0]}
                </span>
              )}
            </div>
            {otherUser?.online && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#10B981',
                border: '2px solid var(--black)'
              }} />
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <h2 style={{ fontSize: 16 }}>{otherUser?.first_name}</h2>
              {otherUser?.verified && <Shield size={14} color="#10B981" />}
            </div>
            <span style={{ fontSize: 12, color: otherUser?.online ? '#10B981' : 'var(--gray-500)' }}>
              {otherUser?.online ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Phone size={18} color="var(--gold)" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Video size={18} color="var(--gold)" />
        </motion.button>
      </header>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--gray-500)' }}>
            Loading...
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <p style={{ color: 'var(--gray-500)', marginBottom: 8 }}>No messages yet</p>
            <p style={{ color: 'var(--gray-600)', fontSize: 14 }}>Say hello to start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                style={{
                  display: 'flex',
                  justifyContent: isMe ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '75%',
                  padding: '12px 16px',
                  borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  background: isMe 
                    ? 'var(--gradient-gold)'
                    : 'rgba(255,255,255,0.06)',
                  color: isMe ? '#030508' : 'white'
                }}>
                  <p style={{ fontSize: 15, lineHeight: 1.5, marginBottom: 4 }}>{msg.content}</p>
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
      <form
        onSubmit={sendMessage}
        style={{
          padding: '16px',
          background: 'rgba(3, 5, 8, 0.95)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}
      >
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Image size={20} color="var(--gray-400)" />
        </motion.button>

        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '14px 20px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 24,
            color: 'white',
            fontSize: 15,
            outline: 'none'
          }}
        />

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
              ? 'var(--gradient-gold)'
              : 'rgba(255,255,255,0.05)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: newMessage.trim() ? 'pointer' : 'not-allowed'
          }}
        >
          <Send size={20} color={newMessage.trim() ? '#030508' : 'var(--gray-600)'} />
        </motion.button>
      </form>
    </div>
  );
};

export default Messages;
