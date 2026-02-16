import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Eye, EyeOff, ArrowRight, ArrowLeft, Mail, Lock, Phone, User, Heart, Gem, Briefcase } from 'lucide-react';
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
      desc: 'Seeking a generous, successful partner',
      color: '#F472B6'
    },
    { 
      id: 'daddy', 
      icon: Briefcase, 
      title: 'Sugar Daddy',
      desc: 'Successful man seeking companionship',
      color: '#60A5FA'
    },
    { 
      id: 'mommy', 
      icon: Gem, 
      title: 'Sugar Mommy',
      desc: 'Successful woman seeking companionship',
      color: '#A78BFA'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!formData.role) {
        setError('Please select your profile type');
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
      navigate('/dashboard');
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
      {/* Background Effects */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(ellipse at 70% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 30% 80%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)
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
          alignItems: 'center',
          padding: 60
        }}
      >
        <div style={{ width: '100%', maxWidth: 480 }}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}
          >
            <Crown size={32} color="#D4AF37" />
            <span className="gold-text" style={{ fontFamily: 'Playfair Display', fontSize: '1.8rem' }}>INDULGE</span>
          </motion.div>

          {/* Progress */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            {[1, 2].map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: s <= step ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 style={{ fontSize: '2rem', marginBottom: 8 }}>Join INDULGE</h2>
                <p style={{ color: 'var(--gray-light)', marginBottom: 40 }}>
                  Choose how you'd like to experience INDULGE
                </p>

                {error && (
                  <div style={{
                    padding: 16,
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 12,
                    marginBottom: 24,
                    color: '#EF4444',
                    fontSize: 14
                  }}>
                    {error}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                  {roles.map((role) => (
                    <motion.div
                      key={role.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, role: role.id })}
                      style={{
                        padding: 24,
                        borderRadius: 16,
                        background: formData.role === role.id ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.02)',
                        border: `2px solid ${formData.role === role.id ? 'var(--gold)' : 'rgba(255,255,255,0.05)'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 20,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: 14,
                        background: `${role.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <role.icon size={28} color={role.color} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>{role.title}</h3>
                        <p style={{ color: 'var(--gray-light)', fontSize: 14 }}>{role.desc}</p>
                      </div>
                      {formData.role === role.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{
                            marginLeft: 'auto',
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: 'var(--gold)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <span style={{ color: 'var(--black)', fontSize: 14 }}>✓</span>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  className="btn-gold"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  Continue <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={() => setStep(1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--gray-light)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 24,
                    cursor: 'pointer'
                  }}
                >
                  <ArrowLeft size={18} /> Back
                </button>

                <h2 style={{ fontSize: '2rem', marginBottom: 8 }}>Create Account</h2>
                <p style={{ color: 'var(--gray-light)', marginBottom: 40 }}>
                  Already have an account?{' '}
                  <Link to="/login" style={{ color: 'var(--gold)', fontWeight: 500 }}>Sign in</Link>
                </p>

                {error && (
                  <div style={{
                    padding: 16,
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 12,
                    marginBottom: 24,
                    color: '#EF4444',
                    fontSize: 14
                  }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-light)', fontSize: 14 }}>
                      First Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={18} color="#6B7280" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        placeholder="Enter your first name"
                        className="input-field"
                        style={{ paddingLeft: 48 }}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-light)', fontSize: 14 }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={18} color="#6B7280" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter your email"
                        className="input-field"
                        style={{ paddingLeft: 48 }}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-light)', fontSize: 14 }}>
                      Phone Number
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={18} color="#6B7280" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="input-field"
                        style={{ paddingLeft: 48 }}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 32 }}>
                    <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-light)', fontSize: 14 }}>
                      Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={18} color="#6B7280" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Create a password"
                        className="input-field"
                        style={{ paddingLeft: 48, paddingRight: 48 }}
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
                          cursor: 'pointer'
                        }}
                      >
                        {showPassword ? <EyeOff size={18} color="#6B7280" /> : <Eye size={18} color="#6B7280" />}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="btn-gold"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    {loading ? 'Creating Account...' : (
                      <>Create Account <ArrowRight size={18} /></>
                    )}
                  </motion.button>
                </form>

                <p style={{ marginTop: 24, fontSize: 13, color: 'var(--gray)', textAlign: 'center' }}>
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Right Panel - Visual */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 60,
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.02) 100%)',
          borderLeft: '1px solid rgba(212, 175, 55, 0.1)',
          position: 'relative'
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: 450,
            height: 450,
            border: '1px solid rgba(212, 175, 55, 0.1)',
            borderRadius: '50%'
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: 350,
            height: 350,
            border: '1px solid rgba(212, 175, 55, 0.08)',
            borderRadius: '50%'
          }}
        />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--gold-light), var(--gold-dark))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
            boxShadow: '0 20px 60px rgba(212, 175, 55, 0.3)'
          }}
        >
          <Crown size={56} color="#0B0F19" />
        </motion.div>

        <h2 style={{ fontSize: '2.5rem', marginBottom: 16, textAlign: 'center' }}>
          Begin Your<br />
          <span className="gold-text">Exclusive Journey</span>
        </h2>
        <p style={{ color: 'var(--gray-light)', textAlign: 'center', maxWidth: 400, lineHeight: 1.8 }}>
          Join a community of exceptional individuals seeking meaningful, mutually beneficial connections.
        </p>

        <div style={{
          display: 'flex',
          gap: 32,
          marginTop: 48
        }}>
          {[
            { value: '100%', label: 'Verified' },
            { value: '24/7', label: 'Support' },
            { value: 'Elite', label: 'Members' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              style={{ textAlign: 'center' }}
            >
              <div className="gold-text" style={{ fontSize: '1.5rem', fontWeight: 600 }}>{stat.value}</div>
              <div style={{ color: 'var(--gray)', fontSize: 14 }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
