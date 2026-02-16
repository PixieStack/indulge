import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, X, Star, MapPin, Crown, ArrowLeft, 
  Sparkles, ChevronLeft, ChevronRight, Play, Mic
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../contexts/AuthContext';

const Discovery = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await api.get('/api/discovery/feed');
      setProfiles(res.data.profiles || []);
    } catch (err) {
      console.error('Failed to fetch profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentProfile = profiles[currentIndex];

  const handleLike = async () => {
    if (!currentProfile) return;
    
    setDirection(1);
    try {
      const res = await api.post('/api/discovery/like', { 
        to_user_id: currentProfile.id,
        liked_element: 'profile'
      });
      
      if (res.data.matched) {
        setMatchedUser(currentProfile);
        setShowMatch(true);
      }
    } catch (err) {
      console.error('Like failed:', err);
    }
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setDirection(0);
    }, 300);
  };

  const handlePass = async () => {
    if (!currentProfile) return;
    
    setDirection(-1);
    try {
      await api.post('/api/discovery/pass', { to_user_id: currentProfile.id });
    } catch (err) {
      console.error('Pass failed:', err);
    }
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setDirection(0);
    }, 300);
  };

  // Demo profiles if empty
  const demoProfiles = [
    {
      id: 'demo1',
      first_name: 'Sophia',
      age: 26,
      location: 'Los Angeles, CA',
      role: 'baby',
      photos: [],
      lifestyle_tags: ['Travel', 'Fine Dining', 'Fashion'],
      prompts: [{ question: 'My ideal date', answer: 'Private jet to Paris for dinner at a Michelin star restaurant' }]
    },
    {
      id: 'demo2',
      first_name: 'Alexander',
      age: 42,
      location: 'New York, NY',
      role: 'daddy',
      income_bracket: '$1M+',
      photos: [],
      lifestyle_tags: ['Yachting', 'Art', 'Wine'],
      prompts: [{ question: 'I spoil by', answer: 'Making dreams come true for someone special' }]
    }
  ];

  const displayProfiles = profiles.length > 0 ? profiles : demoProfiles;
  const displayProfile = displayProfiles[currentIndex % displayProfiles.length];

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--black)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Crown size={48} color="#D4AF37" />
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--black)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(ellipse at 30% 30%, rgba(212, 175, 55, 0.05) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 70%, rgba(212, 175, 55, 0.03) 0%, transparent 50%)
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
          background: 'rgba(11, 15, 25, 0.9)',
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
          <Crown size={24} color="#D4AF37" />
          <span className="gold-text" style={{ fontFamily: 'Playfair Display', fontSize: '1.3rem' }}>
            Discover
          </span>
        </div>

        <div style={{ width: 100 }} />
      </motion.header>

      {/* Main Card Area */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 40px 40px'
      }}>
        <AnimatePresence mode="wait">
          {displayProfile && currentIndex < displayProfiles.length ? (
            <motion.div
              key={displayProfile.id}
              initial={{ scale: 0.8, opacity: 0, x: direction * 200 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.8, opacity: 0, x: direction * -200 }}
              transition={{ type: 'spring', duration: 0.5 }}
              style={{
                width: '100%',
                maxWidth: 500,
                background: 'linear-gradient(180deg, rgba(30, 36, 51, 1) 0%, rgba(20, 25, 34, 1) 100%)',
                borderRadius: 32,
                border: '1px solid rgba(212, 175, 55, 0.2)',
                overflow: 'hidden',
                boxShadow: '0 25px 80px rgba(0,0,0,0.5)'
              }}
            >
              {/* Photo Area */}
              <div style={{
                height: 400,
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.02) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--gold-light), var(--gold-dark))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 20px 60px rgba(212, 175, 55, 0.3)'
                }}>
                  <span style={{ fontSize: 56, color: 'var(--black)', fontWeight: 600 }}>
                    {displayProfile.first_name?.[0] || '?'}
                  </span>
                </div>

                {/* Role Badge */}
                <div style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  background: 'rgba(212, 175, 55, 0.2)',
                  padding: '8px 16px',
                  borderRadius: 20,
                  border: '1px solid rgba(212, 175, 55, 0.3)'
                }}>
                  <span style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 500, textTransform: 'capitalize' }}>
                    {displayProfile.role === 'baby' ? 'Sugar Baby' : displayProfile.role === 'daddy' ? 'Sugar Daddy' : 'Sugar Mommy'}
                  </span>
                </div>

                {/* Income Badge (for daddies/mommies) */}
                {displayProfile.income_bracket && (
                  <div style={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    background: 'rgba(16, 185, 129, 0.2)',
                    padding: '8px 16px',
                    borderRadius: 20,
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    <span style={{ color: '#10B981', fontSize: 13, fontWeight: 500 }}>
                      {displayProfile.income_bracket}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
                  <h2 style={{ fontSize: '2rem', fontWeight: 500 }}>{displayProfile.first_name}</h2>
                  <span style={{ fontSize: '1.5rem', color: 'var(--gray-light)' }}>
                    {displayProfile.age || '25'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <MapPin size={16} color="#D4AF37" />
                  <span style={{ color: 'var(--gray-light)', fontSize: 14 }}>
                    {displayProfile.location || 'Location hidden'}
                  </span>
                </div>

                {/* Tags */}
                {displayProfile.lifestyle_tags?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                    {displayProfile.lifestyle_tags.slice(0, 4).map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '6px 14px',
                          background: 'rgba(212, 175, 55, 0.1)',
                          borderRadius: 20,
                          fontSize: 13,
                          color: 'var(--gold)'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Prompt */}
                {displayProfile.prompts?.[0] && (
                  <div style={{
                    padding: 20,
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <p style={{ color: 'var(--gray)', fontSize: 13, marginBottom: 8 }}>
                      {displayProfile.prompts[0].question}
                    </p>
                    <p style={{ fontSize: 15, lineHeight: 1.6 }}>
                      {displayProfile.prompts[0].answer}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 24,
                padding: '0 28px 32px'
              }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePass}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '2px solid rgba(239, 68, 68, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={28} color="#EF4444" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--gold-light), var(--gold-dark))',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 10px 40px rgba(212, 175, 55, 0.3)'
                  }}
                >
                  <Heart size={36} color="#0B0F19" fill="#0B0F19" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Star size={28} color="#D4AF37" />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                textAlign: 'center',
                padding: 60,
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 32,
                border: '1px solid rgba(212, 175, 55, 0.1)'
              }}
            >
              <Sparkles size={64} color="#D4AF37" style={{ marginBottom: 24 }} />
              <h2 style={{ fontSize: '2rem', marginBottom: 12 }}>You've seen everyone!</h2>
              <p style={{ color: 'var(--gray-light)', marginBottom: 32 }}>
                Check back later for new matches
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentIndex(0)}
                className="btn-gold"
              >
                Start Over
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Match Modal */}
      <AnimatePresence>
        {showMatch && matchedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 200
            }}
            onClick={() => setShowMatch(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              style={{
                padding: 60,
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(11, 15, 25, 0.98) 100%)',
                borderRadius: 32,
                border: '2px solid var(--gold)',
                textAlign: 'center'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Heart size={80} color="#D4AF37" fill="#D4AF37" />
              </motion.div>
              <h2 style={{ fontSize: '3rem', marginTop: 24, marginBottom: 12 }}>
                It's a <span className="gold-text">Match!</span>
              </h2>
              <p style={{ color: 'var(--gray-light)', fontSize: 18, marginBottom: 32 }}>
                You and {matchedUser.first_name} liked each other
              </p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/matches')}
                  className="btn-gold"
                >
                  Send Message
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMatch(false)}
                  className="btn-outline"
                >
                  Keep Swiping
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Discovery;
