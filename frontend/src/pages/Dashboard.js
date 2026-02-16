import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Crown, Heart, MessageCircle, User, Settings, LogOut, 
  Compass, Users, Bell, Shield, ChevronRight, Sparkles,
  CheckCircle, XCircle, Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ matches: 0, likes: 0 });
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await api.get('/api/matches');
      setMatches(res.data.matches || []);
      setStats(prev => ({ ...prev, matches: res.data.matches?.length || 0 }));
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    }
  };

  const navItems = [
    { icon: Compass, label: 'Discover', path: '/discover', color: '#F472B6' },
    { icon: Heart, label: 'Matches', path: '/matches', color: '#EF4444' },
    { icon: MessageCircle, label: 'Messages', path: '/matches', color: '#60A5FA' },
    { icon: User, label: 'Profile', path: '/profile', color: '#A78BFA' }
  ];

  const verificationSteps = [
    { id: 'email', label: 'Email Verified', done: user?.email_verified },
    { id: 'phone', label: 'Phone Verified', done: user?.phone_verified },
    { id: 'face', label: 'Face Verified', done: user?.face_verified },
    { id: 'payment', label: 'Identity Confirmed', done: user?.verification_paid }
  ];

  const completedSteps = verificationSteps.filter(s => s.done).length;
  const verificationProgress = (completedSteps / verificationSteps.length) * 100;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex' }}>
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        style={{
          width: 280,
          padding: 24,
          borderRight: '1px solid rgba(212, 175, 55, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          background: 'var(--black-light)'
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <Crown size={28} color="#D4AF37" />
          <span className="gold-text" style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem' }}>INDULGE</span>
        </div>

        {/* User Card */}
        <div style={{
          padding: 20,
          background: 'rgba(212, 175, 55, 0.05)',
          borderRadius: 16,
          border: '1px solid rgba(212, 175, 55, 0.1)',
          marginBottom: 32
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
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
                {user?.first_name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h3 style={{ fontSize: 16, marginBottom: 2 }}>{user?.first_name || 'User'}</h3>
              <span style={{
                fontSize: 12,
                color: 'var(--gold)',
                textTransform: 'capitalize',
                background: 'rgba(212, 175, 55, 0.1)',
                padding: '2px 8px',
                borderRadius: 20
              }}>
                {user?.role || 'Member'}
              </span>
            </div>
          </div>

          {/* Verification Progress */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--gray-light)' }}>Profile Verification</span>
              <span style={{ fontSize: 12, color: 'var(--gold)' }}>{completedSteps}/{verificationSteps.length}</span>
            </div>
            <div style={{
              height: 6,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 3,
              overflow: 'hidden'
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${verificationProgress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--gold-light), var(--gold))',
                  borderRadius: 3
                }}
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1 }}>
          {navItems.map((item, i) => (
            <motion.button
              key={item.label}
              whileHover={{ x: 4 }}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'transparent',
                border: 'none',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                color: 'var(--white)',
                marginBottom: 8,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: `${item.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <item.icon size={20} color={item.color} />
              </div>
              <span style={{ fontSize: 15 }}>{item.label}</span>
            </motion.button>
          ))}
        </nav>

        {/* Logout */}
        <motion.button
          whileHover={{ x: 4 }}
          onClick={() => { logout(); navigate('/'); }}
          style={{
            width: '100%',
            padding: '14px 16px',
            background: 'transparent',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            color: '#EF4444',
            cursor: 'pointer'
          }}
        >
          <LogOut size={20} />
          <span style={{ fontSize: 15 }}>Sign Out</span>
        </motion.button>
      </motion.aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: 280, padding: 40 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 40 }}
        >
          <h1 style={{ fontSize: '2.5rem', marginBottom: 8 }}>
            Welcome back, <span className="gold-text">{user?.first_name || 'there'}</span>
          </h1>
          <p style={{ color: 'var(--gray-light)', fontSize: 16 }}>
            Here's what's happening with your profile today
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 40 }}>
          {[
            { icon: Heart, label: 'Total Matches', value: stats.matches, color: '#EF4444' },
            { icon: Sparkles, label: 'Profile Views', value: '24', color: '#F472B6' },
            { icon: MessageCircle, label: 'New Messages', value: '5', color: '#60A5FA' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              style={{
                padding: 28,
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: `${stat.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20
              }}>
                <stat.icon size={26} color={stat.color} />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: 4 }}>{stat.value}</div>
              <div style={{ color: 'var(--gray-light)', fontSize: 14 }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              padding: 28,
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <h2 style={{ fontSize: '1.3rem', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Compass size={24} color="#D4AF37" />
              Quick Actions
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { icon: Heart, label: 'Start Discovering', desc: 'Find your perfect match', path: '/discover', color: '#F472B6' },
                { icon: User, label: 'Complete Profile', desc: 'Add photos & details', path: '/profile', color: '#A78BFA' },
                { icon: MessageCircle, label: 'View Messages', desc: 'Chat with matches', path: '/matches', color: '#60A5FA' },
                { icon: Settings, label: 'Settings', desc: 'Preferences & privacy', path: '/profile', color: '#6B7280' }
              ].map((action, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(action.path)}
                  style={{
                    padding: 20,
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16
                  }}
                >
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${action.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <action.icon size={22} color={action.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 15, marginBottom: 4 }}>{action.label}</h3>
                    <p style={{ color: 'var(--gray)', fontSize: 13 }}>{action.desc}</p>
                  </div>
                  <ChevronRight size={18} color="var(--gray)" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Verification Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              padding: 28,
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.02) 100%)',
              borderRadius: 20,
              border: '1px solid rgba(212, 175, 55, 0.15)'
            }}
          >
            <h2 style={{ fontSize: '1.3rem', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Shield size={24} color="#D4AF37" />
              Verification
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {verificationSteps.map((step, i) => (
                <div
                  key={step.id}
                  style={{
                    padding: 16,
                    background: step.done ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)',
                    borderRadius: 12,
                    border: `1px solid ${step.done ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}
                >
                  {step.done ? (
                    <CheckCircle size={20} color="#10B981" />
                  ) : (
                    <Clock size={20} color="#6B7280" />
                  )}
                  <span style={{ 
                    fontSize: 14, 
                    color: step.done ? '#10B981' : 'var(--gray-light)'
                  }}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {completedSteps < verificationSteps.length && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/profile')}
                className="btn-gold"
                style={{ width: '100%', marginTop: 20 }}
              >
                Complete Verification
              </motion.button>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
