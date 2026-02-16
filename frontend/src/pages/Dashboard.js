import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Crown, Heart, MessageCircle, User, Settings, Compass,
  Sparkles, Bell, ChevronRight, Shield, CheckCircle, Clock,
  TrendingUp, Eye, Star, Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ matches: 0, views: 0, likes: 0 });

  const quickActions = [
    { icon: Compass, label: 'Discover', desc: 'Find matches', path: '/discover', color: '#EC4899', gradient: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)' },
    { icon: Heart, label: 'Matches', desc: 'View matches', path: '/matches', color: '#EF4444', gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' },
    { icon: MessageCircle, label: 'Messages', desc: 'Chat now', path: '/matches', color: '#3B82F6', gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' },
    { icon: User, label: 'Profile', desc: 'Edit profile', path: '/profile', color: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)' }
  ];

  const verificationSteps = [
    { id: 'email', label: 'Email', done: user?.email_verified },
    { id: 'phone', label: 'Phone', done: user?.phone_verified },
    { id: 'face', label: 'Photo ID', done: user?.face_verified },
    { id: 'payment', label: 'Identity', done: user?.verification_paid }
  ];

  const completedSteps = verificationSteps.filter(s => s.done).length;
  const verificationProgress = (completedSteps / verificationSteps.length) * 100;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--black)',
      paddingBottom: 100 
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: `
          radial-gradient(ellipse at 20% 0%, rgba(212, 175, 55, 0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 100%, rgba(139, 92, 246, 0.04) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(3, 5, 8, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'var(--gradient-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Crown size={18} color="#030508" />
          </div>
          <span className="gold-text" style={{ fontFamily: 'Playfair Display', fontSize: '1.3rem' }}>
            INDULGE
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <Bell size={18} color="var(--gray-400)" />
            <span className="badge" style={{ position: 'absolute', top: -4, right: -4, minWidth: 16, height: 16, fontSize: 10 }}>3</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/settings')}
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
            <Settings size={18} color="var(--gray-400)" />
          </motion.button>
        </div>
      </header>

      <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-gold"
          style={{
            padding: 28,
            borderRadius: 24,
            marginBottom: 24,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
            filter: 'blur(40px)'
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div className="avatar xl">
              {user?.photos?.[0] ? (
                <img src={user.photos[0]} alt="Profile" />
              ) : (
                user?.first_name?.[0]?.toUpperCase() || 'U'
              )}
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', marginBottom: 4 }}>
                Welcome back, <span className="gold-text">{user?.first_name || 'there'}</span>
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="tag" style={{ 
                  textTransform: 'capitalize',
                  fontSize: 12,
                  padding: '4px 12px'
                }}>
                  {user?.role === 'baby' ? 'Sugar Baby' : user?.role === 'daddy' ? 'Sugar Daddy' : 'Sugar Mommy'}
                </span>
                {completedSteps === 4 && (
                  <span style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 4,
                    color: '#10B981',
                    fontSize: 12
                  }}>
                    <Shield size={12} /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Verification Progress */}
          {verificationProgress < 100 && (
            <div style={{
              padding: 16,
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 12,
              marginTop: 16
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--gray-300)' }}>Profile Verification</span>
                <span style={{ fontSize: 13, color: 'var(--gold)' }}>{completedSteps}/4</span>
              </div>
              <div className="progress-bar">
                <motion.div 
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${verificationProgress}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                {verificationSteps.map(step => (
                  <span key={step.id} style={{ 
                    fontSize: 11, 
                    color: step.done ? '#10B981' : 'var(--gray-500)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    {step.done ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {step.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: 16,
          marginBottom: 24
        }}>
          {[
            { icon: Eye, label: 'Profile Views', value: '48', change: '+12%' },
            { icon: Heart, label: 'Likes Received', value: '24', change: '+8%' },
            { icon: Star, label: 'Matches', value: '12', change: '+3' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ y: -4 }}
              className="card"
              style={{ padding: 20 }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: 12
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'rgba(212, 175, 55, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <stat.icon size={18} color="var(--gold)" />
                </div>
                <span style={{ 
                  fontSize: 11, 
                  color: '#10B981',
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '2px 8px',
                  borderRadius: 10
                }}>
                  {stat.change}
                </span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 style={{ fontSize: '1.1rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={18} color="var(--gold)" /> Quick Actions
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {quickActions.map((action, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(action.path)}
                style={{
                  padding: 24,
                  background: 'var(--gradient-card)',
                  borderRadius: 20,
                  border: '1px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16
                }}
              >
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: action.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 10px 30px ${action.color}30`
                }}>
                  <action.icon size={26} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: 4 }}>{action.label}</h3>
                  <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>{action.desc}</p>
                </div>
                <ChevronRight size={20} color="var(--gray-600)" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ marginTop: 24 }}
        >
          <h2 style={{ fontSize: '1.1rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} color="var(--gold)" /> Recent Activity
          </h2>
          
          <div className="card" style={{ padding: 24 }}>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Sparkles size={40} color="var(--gray-600)" style={{ marginBottom: 12 }} />
              <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>
                Start discovering to see activity here
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/discover')}
                className="btn btn-gold"
                style={{ marginTop: 16 }}
              >
                Start Discovering
              </motion.button>
            </div>
          </div>
        </motion.div>
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
            { icon: Crown, path: '/dashboard', active: true },
            { icon: Compass, path: '/discover' },
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
              <item.icon 
                size={22} 
                color={item.active ? '#030508' : 'var(--gray-500)'} 
              />
            </motion.button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
