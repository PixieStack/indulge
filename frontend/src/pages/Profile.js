import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Crown, ArrowLeft, Camera, Save, User, MapPin, 
  Briefcase, GraduationCap, Cigarette, Wine, Heart,
  Plus, X, CheckCircle, Mail, Phone, Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../contexts/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser, fetchProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [formData, setFormData] = useState({
    age: user?.age || '',
    gender: user?.gender || '',
    orientation: user?.orientation || '',
    location: user?.location || '',
    height: user?.height || '',
    education: user?.education || '',
    smoking: user?.smoking || '',
    drinking: user?.drinking || '',
    income_bracket: user?.income_bracket || '',
    net_worth: user?.net_worth || '',
    allowance_expectation: user?.allowance_expectation || '',
    lifestyle_tags: user?.lifestyle_tags || [],
    prompts: user?.prompts || []
  });

  const lifestyleOptions = [
    'Travel', 'Fine Dining', 'Fashion', 'Fitness', 'Art', 'Music',
    'Yachting', 'Wine', 'Golf', 'Spa', 'Shopping', 'Theater',
    'Photography', 'Cooking', 'Dancing', 'Reading', 'Tech', 'Nature'
  ];

  const incomeBrackets = ['$100K - $250K', '$250K - $500K', '$500K - $1M', '$1M - $5M', '$5M+'];
  const allowanceRanges = ['$1K - $3K/mo', '$3K - $5K/mo', '$5K - $10K/mo', '$10K+/mo', 'Negotiable'];

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.put('/api/profile/me', formData);
      updateUser(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLifestyleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      lifestyle_tags: prev.lifestyle_tags.includes(tag)
        ? prev.lifestyle_tags.filter(t => t !== tag)
        : [...prev.lifestyle_tags, tag]
    }));
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
          radial-gradient(ellipse at 30% 20%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)
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
          <User size={24} color="#D4AF37" />
          <span className="gold-text" style={{ fontFamily: 'Playfair Display', fontSize: '1.3rem' }}>
            Profile
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={loading}
          className="btn-gold"
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          {saved ? <CheckCircle size={18} /> : <Save size={18} />}
          {loading ? 'Saving...' : saved ? 'Saved!' : 'Save'}
        </motion.button>
      </motion.header>

      {/* Content */}
      <div style={{ paddingTop: 100, maxWidth: 900, margin: '0 auto', padding: '100px 40px 60px' }}>
        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: 8, 
          marginBottom: 40,
          background: 'rgba(255,255,255,0.02)',
          padding: 8,
          borderRadius: 16
        }}>
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'verification', label: 'Verification', icon: Shield }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '14px 24px',
                background: activeTab === tab.id ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                border: activeTab === tab.id ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
                borderRadius: 12,
                color: activeTab === tab.id ? 'var(--gold)' : 'var(--gray-light)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {activeTab === 'profile' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Photo Section */}
            <div style={{
              padding: 32,
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 24,
              border: '1px solid rgba(212, 175, 55, 0.1)',
              marginBottom: 24
            }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Camera size={20} color="#D4AF37" />
                Photos
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    style={{
                      aspectRatio: '3/4',
                      background: 'rgba(212, 175, 55, 0.05)',
                      borderRadius: 16,
                      border: '2px dashed rgba(212, 175, 55, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={32} color="#D4AF37" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Basic Info */}
            <div style={{
              padding: 32,
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 24,
              border: '1px solid rgba(212, 175, 55, 0.1)',
              marginBottom: 24
            }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 24 }}>Basic Information</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-light)', fontSize: 14 }}>
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || '' })}
                    placeholder="25"
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-light)', fontSize: 14 }}>
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-light)', fontSize: 14 }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="New York, NY"
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-light)', fontSize: 14 }}>
                    Height
                  </label>
                  <input
                    type="text"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder="5'8&quot;"
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-light)', fontSize: 14 }}>
                    Education
                  </label>
                  <input
                    type="text"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    placeholder="Bachelor's Degree"
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-light)', fontSize: 14 }}>
                    Orientation
                  </label>
                  <select
                    value={formData.orientation}
                    onChange={(e) => setFormData({ ...formData, orientation: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select...</option>
                    <option value="straight">Straight</option>
                    <option value="gay">Gay</option>
                    <option value="bisexual">Bisexual</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Financial (Role-dependent) */}
            {(user?.role === 'daddy' || user?.role === 'mommy') && (
              <div style={{
                padding: 32,
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 24,
                border: '1px solid rgba(212, 175, 55, 0.1)',
                marginBottom: 24
              }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Briefcase size={20} color="#D4AF37" />
                  Financial Information
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-light)', fontSize: 14 }}>
                      Income Bracket
                    </label>
                    <select
                      value={formData.income_bracket}
                      onChange={(e) => setFormData({ ...formData, income_bracket: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select...</option>
                      {incomeBrackets.map(bracket => (
                        <option key={bracket} value={bracket}>{bracket}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-light)', fontSize: 14 }}>
                      Net Worth
                    </label>
                    <select
                      value={formData.net_worth}
                      onChange={(e) => setFormData({ ...formData, net_worth: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select...</option>
                      {['$500K - $1M', '$1M - $5M', '$5M - $10M', '$10M+'].map(worth => (
                        <option key={worth} value={worth}>{worth}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {user?.role === 'baby' && (
              <div style={{
                padding: 32,
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 24,
                border: '1px solid rgba(212, 175, 55, 0.1)',
                marginBottom: 24
              }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: 24 }}>Expectations</h3>
                
                <div>
                  <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-light)', fontSize: 14 }}>
                    Allowance Expectation
                  </label>
                  <select
                    value={formData.allowance_expectation}
                    onChange={(e) => setFormData({ ...formData, allowance_expectation: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select...</option>
                    {allowanceRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Lifestyle Tags */}
            <div style={{
              padding: 32,
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 24,
              border: '1px solid rgba(212, 175, 55, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Heart size={20} color="#D4AF37" />
                Lifestyle & Interests
              </h3>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {lifestyleOptions.map(tag => (
                  <motion.button
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleLifestyleTag(tag)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: 20,
                      border: formData.lifestyle_tags.includes(tag)
                        ? '1px solid var(--gold)'
                        : '1px solid rgba(255,255,255,0.1)',
                      background: formData.lifestyle_tags.includes(tag)
                        ? 'rgba(212, 175, 55, 0.15)'
                        : 'transparent',
                      color: formData.lifestyle_tags.includes(tag)
                        ? 'var(--gold)'
                        : 'var(--gray-light)',
                      cursor: 'pointer',
                      fontSize: 14
                    }}
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Verification Tab */}
            <div style={{
              padding: 32,
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.02) 100%)',
              borderRadius: 24,
              border: '1px solid rgba(212, 175, 55, 0.15)',
              marginBottom: 24
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: 12 }}>
                Get <span className="gold-text">Verified</span>
              </h3>
              <p style={{ color: 'var(--gray-light)', marginBottom: 24 }}>
                Complete verification to unlock all features and build trust with potential matches.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { 
                    id: 'email', 
                    icon: Mail, 
                    title: 'Email Verification', 
                    desc: 'Verify your email address',
                    done: user?.email_verified 
                  },
                  { 
                    id: 'phone', 
                    icon: Phone, 
                    title: 'Phone Verification', 
                    desc: 'Verify your phone number',
                    done: user?.phone_verified 
                  },
                  { 
                    id: 'face', 
                    icon: Camera, 
                    title: 'Face Verification', 
                    desc: 'Take a selfie to prove authenticity',
                    done: user?.face_verified 
                  },
                  { 
                    id: 'payment', 
                    icon: Shield, 
                    title: 'Identity Confirmation', 
                    desc: 'Complete identity verification',
                    done: user?.verification_paid 
                  }
                ].map((step, i) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      padding: 24,
                      background: step.done ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)',
                      borderRadius: 16,
                      border: `1px solid ${step.done ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 20
                    }}
                  >
                    <div style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: step.done ? 'rgba(16, 185, 129, 0.15)' : 'rgba(212, 175, 55, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <step.icon size={24} color={step.done ? '#10B981' : '#D4AF37'} />
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: 16, marginBottom: 4 }}>{step.title}</h4>
                      <p style={{ color: 'var(--gray)', fontSize: 14 }}>{step.desc}</p>
                    </div>

                    {step.done ? (
                      <CheckCircle size={24} color="#10B981" />
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-outline"
                        style={{ padding: '10px 20px', fontSize: 14 }}
                      >
                        Verify
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;
