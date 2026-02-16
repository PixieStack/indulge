import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, ArrowRight, ArrowLeft, Mail, Lock, Phone, User, 
  Heart, Gem, Briefcase, Check, Eye, EyeOff, Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    first_name: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      id: 'baby',
      icon: Heart,
      title: 'Sugar Baby',
      subtitle: 'Free Forever',
      desc: 'Looking for a generous partner to share amazing experiences',
      color: '#EC4899',
      benefits: ['Free unlimited messaging', 'See who likes you', 'Video chat access']
    },
    {
      id: 'daddy',
      icon: Briefcase,
      title: 'Sugar Daddy',
      subtitle: 'Premium Access',
      desc: 'Successful man seeking authentic companionship',
      color: '#3B82F6',
      benefits: ['Unlimited matches', 'Priority visibility', 'Advanced filters']
    },
    {
      id: 'mommy',
      icon: Gem,
      title: 'Sugar Mommy',
      subtitle: 'Premium Access',
      desc: 'Successful woman looking for genuine connection',
      color: '#8B5CF6',
      benefits: ['Unlimited matches', 'Priority visibility', 'Advanced filters']
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!formData.role) {
        setError('Please select how you want to use INDULGE');
        return;
      }
      setError('');
      setStep(2);
      return;
    }

    setError('');
    setLoading(true);

    try {
      await signup(formData);
      navigate('/setup');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--black)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse at 30% 20%, rgba(212, 175, 55, 0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, rgba(139, 92, 246, 0.04) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }} />

      {/* Left Panel - Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px 60px',
          maxWidth: 600
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'var(--gradient-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Crown size={22} color="#030508" />
          </div>
          <span className="gold-text" style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem' }}>INDULGE</span>
        </Link>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
          {[1, 2].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                background: s <= step ? 'var(--gradient-gold)' : 'rgba(255,255,255,0.1)',
                transition: 'all 0.5s ease'
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <h1 style={{ fontSize: '2.2rem', marginBottom: 8 }}>
                Join <span className="gold-text">INDULGE</span>
              </h1>
              <p style={{ color: 'var(--gray-400)', marginBottom: 40 }}>
                Select how you want to experience our platform
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: 16,
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 12,
                    marginBottom: 24,
                    color: '#EF4444',
                    fontSize: 14
                  }}
                >
                  {error}
                </motion.div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {roles.map((role) => (
                  <motion.div
                    key={role.id}
                    whileHover={{ scale: 1.01, borderColor: `${role.color}50` }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setFormData({ ...formData, role: role.id })}
                    style={{
                      padding: 24,
                      borderRadius: 16,
                      background: formData.role === role.id 
                        ? `linear-gradient(135deg, ${role.color}15 0%, ${role.color}05 100%)`
                        : 'rgba(255,255,255,0.02)',
                      border: `2px solid ${formData.role === role.id ? role.color : 'rgba(255,255,255,0.06)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                      <div style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        background: `${role.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <role.icon size={26} color={role.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <h3 style={{ fontSize: '1.1rem' }}>{role.title}</h3>
                          <span style={{
                            fontSize: 11,
                            padding: '3px 10px',
                            borderRadius: 20,
                            background: role.id === 'baby' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(212, 175, 55, 0.15)',
                            color: role.id === 'baby' ? '#10B981' : '#D4AF37',
                            fontWeight: 600
                          }}>
                            {role.subtitle}
                          </span>
                        </div>
                        <p style={{ color: 'var(--gray-400)', fontSize: 14, marginBottom: 12 }}>{role.desc}</p>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                          {role.benefits.map((benefit, i) => (
                            <span key={i} style={{ 
                              fontSize: 12, 
                              color: 'var(--gray-500)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4
                            }}>
                              <Check size={12} color={role.color} /> {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                      {formData.role === role.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: role.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Check size={16} color="white" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="btn btn-gold"
                style={{ width: '100%', marginTop: 32, padding: '16px' }}
              >
                Continue <ArrowRight size={18} />
              </motion.button>

              <p style={{ marginTop: 24, textAlign: 'center', color: 'var(--gray-500)', fontSize: 14 }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--gold)', fontWeight: 500 }}>Sign in</Link>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setStep(1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--gray-400)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 32,
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                <ArrowLeft size={18} /> Back
              </button>

              <h1 style={{ fontSize: '2.2rem', marginBottom: 8 }}>
                Create Your Account
              </h1>
              <p style={{ color: 'var(--gray-400)', marginBottom: 40 }}>
                Let's get you started on your journey
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: 16,
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 12,
                    marginBottom: 24,
                    color: '#EF4444',
                    fontSize: 14
                  }}
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-300)', fontSize: 14, fontWeight: 500 }}>
                    First Name
                  </label>
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      placeholder="Enter your first name"
                      className="input-field with-icon"
                      required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-300)', fontSize: 14, fontWeight: 500 }}>
                    Email Address
                  </label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email"
                      className="input-field with-icon"
                      required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-300)', fontSize: 14, fontWeight: 500 }}>
                    Phone Number
                  </label>
                  <div className="input-wrapper">
                    <Phone size={18} className="input-icon" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="input-field with-icon"
                      required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 32 }}>
                  <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-300)', fontSize: 14, fontWeight: 500 }}>
                    Password
                  </label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Create a strong password"
                      className="input-field with-icon"
                      style={{ paddingRight: 52 }}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--gray-500)'
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="btn btn-gold"
                  style={{
                    width: '100%',
                    padding: '16px',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? 'Creating Account...' : (
                    <>Create Account <ArrowRight size={18} /></>
                  )}
                </motion.button>
              </form>

              <p style={{ marginTop: 24, fontSize: 12, color: 'var(--gray-600)', textAlign: 'center' }}>
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Right Panel - Visual */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, transparent 100%)',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated Circles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: 500,
            height: 500,
            border: '1px solid rgba(212, 175, 55, 0.1)',
            borderRadius: '50%'
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            border: '1px solid rgba(212, 175, 55, 0.08)',
            borderRadius: '50%'
          }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: 300,
            height: 300,
            border: '1px solid rgba(212, 175, 55, 0.05)',
            borderRadius: '50%'
          }}
        />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
          }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'var(--gradient-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 40px',
              boxShadow: '0 30px 80px rgba(212, 175, 55, 0.4)'
            }}
          >
            <Crown size={56} color="#030508" />
          </motion.div>

          <h2 style={{ fontSize: '2.5rem', marginBottom: 16 }}>
            Begin Your<br />
            <span className="gold-text">Exclusive Journey</span>
          </h2>
          <p style={{ color: 'var(--gray-400)', maxWidth: 400, lineHeight: 1.8 }}>
            Join a community of verified, exceptional individuals seeking authentic connections.
          </p>

          <div style={{ display: 'flex', gap: 40, marginTop: 48, justifyContent: 'center' }}>
            {[
              { value: '100%', label: 'Verified' },
              { value: 'Free', label: 'For Babies' },
              { value: 'Elite', label: 'Community' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                style={{ textAlign: 'center' }}
              >
                <div className="gold-text" style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Inter' }}>
                  {stat.value}
                </div>
                <div style={{ color: 'var(--gray-500)', fontSize: 13 }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
