import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Crown, ArrowLeft, MessageCircle, Heart, Clock, 
  Sparkles, Search
} from 'lucide-react';
import { api } from '../contexts/AuthContext';

const Matches = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await api.get('/api/matches');
      setMatches(res.data.matches || []);
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter(match =>
    match.other_user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--black)',
      position: 'relative'
    }}>
      {/* Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(ellipse at 20% 20%, rgba(212, 175, 55, 0.05) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, rgba(212, 175, 55, 0.03) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '20px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(11, 15, 25, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
          zIndex: 100
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            borderRadius: 12,
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'white',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={18} />
          Back
        </motion.button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Heart size={24} color="#D4AF37" />
          <span className="gold-text" style={{ fontFamily: 'Playfair Display', fontSize: '1.3rem' }}>
            Matches
          </span>
        </div>

        <div style={{ width: 100 }} />
      </motion.header>

      {/* Main Content */}
      <div style={{ paddingTop: 100, padding: '100px 40px 40px', maxWidth: 800, margin: '0 auto' }}>
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 32 }}
        >
          <div style={{ position: 'relative' }}>
            <Search size={20} color="#6B7280" style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search matches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              style={{ paddingLeft: 52 }}
            />
          </div>
        </motion.div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Crown size={48} color="#D4AF37" />
            </motion.div>
          </div>
        ) : filteredMatches.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredMatches.map((match, i) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.01, x: 4 }}
                onClick={() => navigate(`/messages/${match.id}`)}
                style={{
                  padding: 24,
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 20,
                  border: '1px solid rgba(212, 175, 55, 0.1)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--gold-light), var(--gold-dark))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{ fontSize: 24, color: 'var(--black)', fontWeight: 600 }}>
                    {match.other_user?.first_name?.[0] || '?'}
                  </span>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                    <h3 style={{ fontSize: 18 }}>
                      {match.other_user?.first_name || 'Unknown'}
                    </h3>
                    {match.other_user?.age && (
                      <span style={{ color: 'var(--gray-light)', fontSize: 16 }}>
                        {match.other_user.age}
                      </span>
                    )}
                  </div>
                  
                  {match.last_message ? (
                    <p style={{ 
                      color: 'var(--gray-light)', 
                      fontSize: 14,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {match.last_message.content}
                    </p>
                  ) : (
                    <p style={{ color: 'var(--gold)', fontSize: 14 }}>
                      <Sparkles size={14} style={{ display: 'inline', marginRight: 6 }} />
                      New match! Say hello
                    </p>
                  )}
                </div>

                {/* Time & Action */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--gray)', fontSize: 12, marginBottom: 8 }}>
                    {formatTime(match.last_message?.created_at || match.created_at)}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'rgba(212, 175, 55, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <MessageCircle size={18} color="#D4AF37" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              textAlign: 'center',
              padding: 80,
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 24,
              border: '1px solid rgba(212, 175, 55, 0.1)'
            }}
          >
            <Heart size={64} color="#D4AF37" style={{ marginBottom: 24, opacity: 0.5 }} />
            <h2 style={{ fontSize: '1.8rem', marginBottom: 12 }}>No Matches Yet</h2>
            <p style={{ color: 'var(--gray-light)', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
              Start discovering amazing people and find your perfect match
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/discover')}
              className="btn-gold"
            >
              Start Discovering
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Matches;
