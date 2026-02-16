import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Heart, Shield, Star, Sparkles, ArrowRight, Check } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    { icon: Shield, title: 'Verified Profiles', desc: 'Every member undergoes rigorous verification for authenticity' },
    { icon: Crown, title: 'Elite Membership', desc: 'Connect with successful, ambitious individuals worldwide' },
    { icon: Heart, title: 'Meaningful Connections', desc: 'Find relationships that align with your lifestyle' },
    { icon: Star, title: 'Premium Experience', desc: 'Luxury dating experience with concierge-level service' }
  ];

  const stats = [
    { value: '50K+', label: 'Verified Members' },
    { value: '15K+', label: 'Successful Matches' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '45+', label: 'Countries' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', overflow: 'hidden' }}>
      {/* Ambient Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(ellipse at 20% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, rgba(212, 175, 55, 0.05) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(20, 25, 34, 1) 0%, rgba(11, 15, 25, 1) 100%)
        `,
        pointerEvents: 'none'
      }} />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'fixed',
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            background: 'var(--gold)',
            borderRadius: '50%',
            opacity: Math.random() * 0.3 + 0.1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: Math.random() * 3 + 3,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '20px 60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(11, 15, 25, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.1)'
        }}
      >
        <motion.div 
          style={{ display: 'flex', alignItems: 'center', gap: 12 }}
          whileHover={{ scale: 1.02 }}
        >
          <Crown size={28} color="#D4AF37" />
          <span style={{ 
            fontFamily: 'Playfair Display', 
            fontSize: '1.8rem', 
            fontWeight: 600,
            background: 'linear-gradient(135deg, #E8C547 0%, #D4AF37 50%, #B8960C 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            INDULGE
          </span>
        </motion.div>

        <div style={{ display: 'flex', gap: 16 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="btn-outline"
          >
            Sign In
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/signup')}
            className="btn-gold"
          >
            Join Now
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 60px 80px',
        position: 'relative'
      }}>
        <div style={{ maxWidth: 1400, width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                background: 'rgba(212, 175, 55, 0.1)',
                borderRadius: 50,
                marginBottom: 24,
                border: '1px solid rgba(212, 175, 55, 0.2)'
              }}
            >
              <Sparkles size={16} color="#D4AF37" />
              <span style={{ color: 'var(--gold)', fontSize: 14, fontWeight: 500 }}>Premium Dating Experience</span>
            </motion.div>

            <h1 style={{ 
              fontSize: '4.5rem', 
              lineHeight: 1.1, 
              marginBottom: 24,
              fontWeight: 500
            }}>
              Where <span className="gold-text">Ambition</span><br />
              Meets <span className="gold-text">Desire</span>
            </h1>

            <p style={{ 
              fontSize: '1.2rem', 
              color: 'var(--gray-light)', 
              marginBottom: 40,
              maxWidth: 500,
              lineHeight: 1.8
            }}>
              The exclusive platform for exceptional individuals seeking meaningful connections. 
              Experience dating elevated to an art form.
            </p>

            <div style={{ display: 'flex', gap: 16, marginBottom: 60 }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className="btn-gold"
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                Start Your Journey <ArrowRight size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline"
              >
                Learn More
              </motion.button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  <div className="gold-text" style={{ fontSize: '2rem', fontWeight: 600, fontFamily: 'Playfair Display' }}>
                    {stat.value}
                  </div>
                  <div style={{ color: 'var(--gray)', fontSize: 14 }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hero Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                width: 500,
                height: 500,
                border: '1px solid rgba(212, 175, 55, 0.2)',
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
                border: '1px solid rgba(212, 175, 55, 0.15)',
                borderRadius: '50%'
              }}
            />
            
            <motion.div
              style={{
                width: 320,
                height: 450,
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 100%)',
                borderRadius: 24,
                border: '1px solid rgba(212, 175, 55, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--gold-light), var(--gold-dark))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24
              }}>
                <Crown size={50} color="#0B0F19" />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Elite Member</h3>
              <p style={{ color: 'var(--gray-light)', fontSize: 14 }}>Verified & Authentic</p>
              
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 80,
                background: 'linear-gradient(to top, rgba(11, 15, 25, 0.9), transparent)'
              }} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '100px 60px', position: 'relative' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 80 }}
          >
            <h2 style={{ fontSize: '3rem', marginBottom: 16 }}>
              Why Choose <span className="gold-text">INDULGE</span>
            </h2>
            <p style={{ color: 'var(--gray-light)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
              We've crafted every detail to ensure your journey to finding the perfect connection is nothing short of extraordinary.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{
                  padding: 32,
                  background: hoveredFeature === i ? 'rgba(212, 175, 55, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 20,
                  border: `1px solid ${hoveredFeature === i ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255, 255, 255, 0.05)'}`,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: 16,
                  background: hoveredFeature === i ? 'var(--gold)' : 'rgba(212, 175, 55, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                  transition: 'all 0.3s ease'
                }}>
                  <feature.icon size={28} color={hoveredFeature === i ? '#0B0F19' : '#D4AF37'} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: 12 }}>{feature.title}</h3>
                <p style={{ color: 'var(--gray-light)', fontSize: 14, lineHeight: 1.7 }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '100px 60px', position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            maxWidth: 1000,
            margin: '0 auto',
            padding: 80,
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.02) 100%)',
            borderRadius: 32,
            border: '1px solid rgba(212, 175, 55, 0.2)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />
          
          <Crown size={48} color="#D4AF37" style={{ marginBottom: 24 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: 16 }}>
            Ready to <span className="gold-text">Elevate</span> Your Dating Life?
          </h2>
          <p style={{ color: 'var(--gray-light)', fontSize: '1.1rem', marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
            Join thousands of successful individuals who have found their perfect match on INDULGE.
          </p>
          
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="btn-gold"
              style={{ padding: '18px 48px', fontSize: '1rem' }}
            >
              Create Free Account
            </motion.button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 40 }}>
            {['No credit card required', 'Cancel anytime', 'Privacy guaranteed'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gray-light)', fontSize: 14 }}>
                <Check size={16} color="#D4AF37" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '60px',
        borderTop: '1px solid rgba(212, 175, 55, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
          <Crown size={24} color="#D4AF37" />
          <span style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem' }} className="gold-text">INDULGE</span>
        </div>
        <p style={{ color: 'var(--gray)', fontSize: 14 }}>
          © 2025 INDULGE. All rights reserved. Premium Dating for Exceptional Connections.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
