import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--black)',
      padding: 20,
      position: 'relative'
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse at 50% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: 440,
          padding: 48,
          background: 'rgba(255,255,255,0.02)',
          borderRadius: 24,
          border: '1px solid rgba(255,255,255,0.06)',
          position: 'relative'
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 10, 
          marginBottom: 40 
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'var(--gradient-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Crown size={26} color="#030508" />
          </div>
          <span className="gold-text" style={{ fontFamily: 'Playfair Display', fontSize: '1.8rem' }}>
            INDULGE
          </span>
        </Link>

        <h1 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: 8 }}>
          Welcome Back
        </h1>
        <p style={{ color: 'var(--gray-400)', textAlign: 'center', marginBottom: 32 }}>
          Sign in to continue your journey
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: 14,
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 12,
              marginBottom: 24,
              color: '#EF4444',
              fontSize: 14,
              textAlign: 'center'
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                className="input-field with-icon"
                style={{ paddingRight: 52 }}
                required
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
            {loading ? 'Signing In...' : (
              <>Sign In <ArrowRight size={18} /></>
            )}
          </motion.button>
        </form>

        <p style={{ marginTop: 28, textAlign: 'center', color: 'var(--gray-500)', fontSize: 14 }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--gold)', fontWeight: 500 }}>Create one</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
