import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Crown, ArrowLeft, MessageCircle, Heart, Search, 
  Sparkles, Compass, User, Shield
} from 'lucide-react';
import { api } from '../contexts/AuthContext';

const Matches = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('matches');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await api.get('/api/matches');
      setMatches(res.data.matches || demoMatches);
    } catch (err) {
      setMatches(demoMatches);
    } finally {
      setLoading(false);
    }
  };

  const demoMatches = [
    {
      id: 'match1',
      other_user: {
        id: 'user1',
        first_name: 'Sophia',
        age: 24,
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        verified: true
      },
      last_message: { content: 'Hey! Love your profile 😊', created_at: new Date().toISOString() },
      unread: 2
    },
    {
      id: 'match2',
      other_user: {
        id: 'user2',
        first_name: 'Isabella',
        age: 26,
        photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop',
        verified: true
      },
      last_message: null,
      unread: 0
    },
    {
      id: 'match3',
      other_user: {
        id: 'user3',
        first_name: 'Emma',
        age: 23,
        photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
        verified: false
      },
      last_message: { content: 'Would love to meet up!', created_at: new Date(Date.now() - 86400000).toISOString() },
      unread: 0
    }
  ];

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const filteredMatches = matches.filter(match =>
    match.other_user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--black)',
      paddingBottom: 100
    }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: 'rgba(3, 5, 8, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        zIndex: 100
      }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            borderRadius: 10,
            padding: 10,
            cursor: 'pointer',
            color: 'white'
          }}
        >
          <ArrowLeft size={20} />
        </motion.button>

        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.2rem' }}>Messages</h1>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ padding: '16px 24px 0' }}>
        <div style={{ 
          display: 'flex', 
          gap: 8,
          background: 'rgba(255,255,255,0.03)',
          padding: 4,
          borderRadius: 12
        }}>
          {['matches', 'messages'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '12px',
                background: activeTab === tab ? 'var(--gradient-gold)' : 'transparent',
                border: 'none',
                borderRadius: 10,
                color: activeTab === tab ? '#030508' : 'var(--gray-400)',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '16px 24px' }}>
        <div className="input-wrapper">
          <Search size={18} className="input-icon" />
          <input
            type="text"
            placeholder="Search matches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field with-icon"
          />
        </div>
      </div>

      {/* New Matches */}
      {activeTab === 'matches' && (
        <div style={{ padding: '0 24px 16px' }}>
          <h2 style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 12 }}>
            New Matches
          </h2>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
            {filteredMatches.filter(m => !m.last_message).map((match, i) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(`/messages/${match.id}`)}
                style={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'var(--gradient-gold)',
                  padding: 3,
                  marginBottom: 8
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: match.other_user.photo 
                      ? `url(${match.other_user.photo}) center/cover`
                      : 'var(--black-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {!match.other_user.photo && (
                      <span style={{ fontSize: 24, color: 'var(--gold)' }}>
                        {match.other_user.first_name?.[0]}
                      </span>
                    )}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--gray-300)' }}>
                  {match.other_user.first_name}
                </p>
              </motion.div>
            ))}
            
            {filteredMatches.filter(m => !m.last_message).length === 0 && (
              <p style={{ color: 'var(--gray-600)', fontSize: 13 }}>No new matches</p>
            )}
          </div>
        </div>
      )}

      {/* Conversations */}
      <div style={{ padding: '0 24px' }}>
        <h2 style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 12 }}>
          {activeTab === 'messages' ? 'All Messages' : 'Conversations'}
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Crown size={32} color="var(--gold)" />
            </motion.div>
          </div>
        ) : filteredMatches.filter(m => activeTab === 'messages' || m.last_message).length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredMatches
              .filter(m => activeTab === 'messages' || m.last_message)
              .map((match, i) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                  onClick={() => navigate(`/messages/${match.id}`)}
                  style={{
                    padding: 16,
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14
                  }}
                >
                  {/* Avatar */}
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: match.other_user.photo 
                        ? `url(${match.other_user.photo}) center/cover`
                        : 'var(--gradient-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {!match.other_user.photo && (
                        <span style={{ fontSize: 20, color: '#030508', fontWeight: 600 }}>
                          {match.other_user.first_name?.[0]}
                        </span>
                      )}
                    </div>
                    {match.other_user.verified && (
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: '#10B981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid var(--black)'
                      }}>
                        <Shield size={10} color="white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <h3 style={{ fontSize: 15 }}>
                        {match.other_user.first_name}, {match.other_user.age}
                      </h3>
                    </div>
                    
                    {match.last_message ? (
                      <p style={{ 
                        color: match.unread ? 'var(--gray-300)' : 'var(--gray-500)',
                        fontSize: 13,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: match.unread ? 500 : 400
                      }}>
                        {match.last_message.content}
                      </p>
                    ) : (
                      <p style={{ color: 'var(--gold)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Sparkles size={12} /> New match! Say hello
                      </p>
                    )}
                  </div>

                  {/* Time & Badge */}
                  <div style={{ textAlign: 'right' }}>
                    {match.last_message && (
                      <span style={{ fontSize: 12, color: 'var(--gray-600)', marginBottom: 8, display: 'block' }}>
                        {formatTime(match.last_message.created_at)}
                      </span>
                    )}
                    {match.unread > 0 && (
                      <span className="badge gold">{match.unread}</span>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: 60,
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            <Heart size={48} color="var(--gray-600)" style={{ marginBottom: 16 }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: 8 }}>No Messages Yet</h3>
            <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 24 }}>
              Start discovering to find your matches
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/discover')}
              className="btn btn-gold"
            >
              Start Discovering
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '12px 24px 24px',
        background: 'linear-gradient(to top, rgba(3, 5, 8, 1) 0%, rgba(3, 5, 8, 0.95) 50%, transparent 100%)',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          gap: 8,
          padding: 8,
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)'
        }}>
          {[
            { icon: Crown, path: '/dashboard' },
            { icon: Compass, path: '/discover' },
            { icon: Heart, path: '/matches', active: true },
            { icon: MessageCircle, path: '/matches', active: true },
            { icon: User, path: '/profile' }
          ].map((item, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(item.path)}
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: item.active ? 'var(--gradient-gold)' : 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <item.icon size={22} color={item.active ? '#030508' : 'var(--gray-500)'} />
            </motion.button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Matches;
