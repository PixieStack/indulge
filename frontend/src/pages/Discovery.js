import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, X, Star, MapPin, ArrowLeft, Play, Mic, 
  Shield, ChevronLeft, ChevronRight, Sparkles, Video,
  Crown, Compass, MessageCircle, User, Volume2
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
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await api.get('/api/discovery/feed');
      setProfiles(res.data.profiles || demoProfiles);
    } catch (err) {
      setProfiles(demoProfiles);
    } finally {
      setLoading(false);
    }
  };

  const demoProfiles = [
    {
      id: 'demo1',
      first_name: 'Sophia',
      age: 24,
      location: 'Los Angeles, CA',
      role: 'baby',
      verified: true,
      photos: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop'
      ],
      lifestyle_tags: ['Travel', 'Fine Dining', 'Fashion', 'Fitness'],
      prompts: [{ question: 'My ideal first date...', answer: 'A sunset dinner cruise followed by stargazing on a private yacht.' }],
      hasVideo: true,
      hasVoice: true
    },
    {
      id: 'demo2',
      first_name: 'Isabella',
      age: 26,
      location: 'Miami, FL',
      role: 'baby',
      verified: true,
      photos: [
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop'
      ],
      lifestyle_tags: ['Yachting', 'Art', 'Wine', 'Shopping'],
      prompts: [{ question: 'The way to my heart...', answer: 'Spontaneous adventures and thoughtful surprises.' }],
      hasVideo: true,
      hasVoice: false
    },
    {
      id: 'demo3',
      first_name: 'Alexander',
      age: 42,
      location: 'New York, NY',
      role: 'daddy',
      verified: true,
      income_bracket: '$1M - $5M',
      photos: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop'
      ],
      lifestyle_tags: ['Business', 'Golf', 'Fine Dining', 'Travel'],
      prompts: [{ question: 'I spoil by...', answer: 'Making dreams come true for someone who appreciates the finer things.' }],
      hasVideo: false,
      hasVoice: true
    }
  ];

  const displayProfiles = profiles.length > 0 ? profiles : demoProfiles;
  const currentProfile = displayProfiles[currentIndex];

  const handleLike = async () => {
    if (!currentProfile) return;
    setDirection(1);
    
    try {
      const res = await api.post('/api/discovery/like', { 
        to_user_id: currentProfile.id,
        liked_element: 'profile'
      });
      
      if (res.data?.matched) {
        setMatchedUser(currentProfile);
        setShowMatch(true);
      }
    } catch (err) {}
    
    setTimeout(() => {
      if (currentIndex < displayProfiles.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setActivePhoto(0);
      }
      setDirection(0);
    }, 300);
  };

  const handlePass = async () => {
    if (!currentProfile) return;
    setDirection(-1);
    
    try {
      await api.post('/api/discovery/pass', { to_user_id: currentProfile.id });
    } catch (err) {}
    
    setTimeout(() => {
      if (currentIndex < displayProfiles.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setActivePhoto(0);
      }
      setDirection(0);
    }, 300);
  };

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
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(3, 5, 8, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        zIndex: 10
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Compass size={20} color="var(--gold)" />
          <span className="gold-text" style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem' }}>
            Discover
          </span>
        </div>

        <div style={{ width: 40 }} />
      </header>

      {/* Main Card Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <AnimatePresence mode="wait">
          {currentProfile && currentIndex < displayProfiles.length ? (
            <motion.div
              key={currentProfile.id}
              initial={{ scale: 0.9, opacity: 0, x: direction * 100 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.9, opacity: 0, x: direction * -100 }}
              transition={{ type: 'spring', duration: 0.4 }}
              style={{
                width: '100%',
                maxWidth: 400,
                height: 'calc(100vh - 280px)',
                maxHeight: 650,
                background: 'var(--black-card)',
                borderRadius: 28,
                border: '1px solid rgba(255,255,255,0.08)',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 25px 80px rgba(0,0,0,0.5)'
              }}
            >
              {/* Photo */}
              <div style={{
                height: '65%',
                background: currentProfile.photos?.[activePhoto] 
                  ? `url(${currentProfile.photos[activePhoto]}) center/cover`
                  : 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 100%)',
                position: 'relative'
              }}>
                {/* Photo Navigation */}
                {currentProfile.photos?.length > 1 && (
                  <>
                    <div style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      right: 12,
                      display: 'flex',
                      gap: 4
                    }}>
                      {currentProfile.photos.map((_, i) => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: 3,
                            borderRadius: 2,
                            background: i === activePhoto ? 'white' : 'rgba(255,255,255,0.3)'
                          }}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setActivePhoto(prev => Math.max(0, prev - 1))}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '30%',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    />
                    <button
                      onClick={() => setActivePhoto(prev => Math.min((currentProfile.photos?.length || 1) - 1, prev + 1))}
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: '30%',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    />
                  </>
                )}

                {/* Badges */}
                <div style={{
                  position: 'absolute',
                  top: 24,
                  right: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}>
                  {currentProfile.verified && (
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.9)',
                      padding: '6px 12px',
                      borderRadius: 20,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      <Shield size={12} color="white" />
                      <span style={{ fontSize: 11, color: 'white', fontWeight: 500 }}>Verified</span>
                    </div>
                  )}
                  {currentProfile.hasVideo && (
                    <div style={{
                      background: 'rgba(139, 92, 246, 0.9)',
                      padding: '6px 12px',
                      borderRadius: 20,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      <Video size={12} color="white" />
                      <span style={{ fontSize: 11, color: 'white', fontWeight: 500 }}>Video</span>
                    </div>
                  )}
                  {currentProfile.hasVoice && (
                    <div style={{
                      background: 'rgba(236, 72, 153, 0.9)',
                      padding: '6px 12px',
                      borderRadius: 20,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      <Volume2 size={12} color="white" />
                      <span style={{ fontSize: 11, color: 'white', fontWeight: 500 }}>Voice</span>
                    </div>
                  )}
                </div>

                {/* Income Badge */}
                {currentProfile.income_bracket && (
                  <div style={{
                    position: 'absolute',
                    top: 24,
                    left: 12,
                    background: 'rgba(212, 175, 55, 0.9)',
                    padding: '6px 12px',
                    borderRadius: 20
                  }}>
                    <span style={{ fontSize: 11, color: '#030508', fontWeight: 600 }}>
                      {currentProfile.income_bracket}
                    </span>
                  </div>
                )}

                {/* Gradient Overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '50%',
                  background: 'linear-gradient(to top, rgba(13, 17, 23, 1) 0%, transparent 100%)'
                }} />

                {/* No Photo Fallback */}
                {!currentProfile.photos?.length && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div className="avatar xxl">
                      {currentProfile.first_name?.[0]}
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: '0 20px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
                  <h2 style={{ fontSize: '1.8rem' }}>{currentProfile.first_name}</h2>
                  <span style={{ fontSize: '1.3rem', color: 'var(--gray-400)' }}>
                    {currentProfile.age}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                  <MapPin size={14} color="var(--gold)" />
                  <span style={{ color: 'var(--gray-400)', fontSize: 14 }}>
                    {currentProfile.location}
                  </span>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                  {currentProfile.lifestyle_tags?.slice(0, 4).map((tag, i) => (
                    <span key={i} className="tag" style={{ fontSize: 12, padding: '5px 12px' }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Prompt */}
                {currentProfile.prompts?.[0] && (
                  <div style={{
                    padding: 16,
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: 14,
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}>
                    <p style={{ color: 'var(--gray-500)', fontSize: 12, marginBottom: 6 }}>
                      {currentProfile.prompts[0].question}
                    </p>
                    <p style={{ fontSize: 14, lineHeight: 1.6 }}>
                      {currentProfile.prompts[0].answer}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: 40 }}
            >
              <Sparkles size={64} color="var(--gold)" style={{ marginBottom: 24 }} />
              <h2 style={{ fontSize: '1.8rem', marginBottom: 12 }}>You've seen everyone!</h2>
              <p style={{ color: 'var(--gray-400)', marginBottom: 32 }}>
                Check back later for new profiles
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setCurrentIndex(0); setActivePhoto(0); }}
                className="btn btn-gold"
              >
                Start Over
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      {currentProfile && currentIndex < displayProfiles.length && (
        <div style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          gap: 20
        }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePass}
            className="btn-icon xl"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            <X size={30} color="#EF4444" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'var(--gradient-gold)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 10px 40px rgba(212, 175, 55, 0.4)'
            }}
          >
            <Heart size={36} color="#030508" fill="#030508" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="btn-icon xl"
            style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '2px solid rgba(139, 92, 246, 0.3)'
            }}
          >
            <Star size={30} color="#8B5CF6" />
          </motion.button>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav style={{
        padding: '12px 24px 24px',
        display: 'flex',
        justifyContent: 'center'
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
            { icon: Compass, path: '/discover', active: true },
            { icon: Heart, path: '/matches' },
            { icon: MessageCircle, path: '/matches' },
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
              background: 'rgba(0,0,0,0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 200,
              padding: 24
            }}
            onClick={() => setShowMatch(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="card-gold"
              style={{
                padding: 48,
                borderRadius: 28,
                textAlign: 'center',
                maxWidth: 400
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                style={{ marginBottom: 24 }}
              >
                <Heart size={80} color="#D4AF37" fill="#D4AF37" />
              </motion.div>
              
              <h2 style={{ fontSize: '2.5rem', marginBottom: 12 }}>
                It's a <span className="gold-text">Match!</span>
              </h2>
              <p style={{ color: 'var(--gray-400)', fontSize: 16, marginBottom: 32 }}>
                You and {matchedUser.first_name} liked each other
              </p>
              
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/matches')}
                  className="btn btn-gold"
                >
                  Send Message
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMatch(false)}
                  className="btn btn-outline"
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
