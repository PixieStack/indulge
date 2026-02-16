import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, Shield, Heart, Star, Sparkles, ArrowRight, Check, 
  Play, Users, MessageCircle, Video, Mic, ChevronDown,
  Globe, Lock, Zap, Award
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const features = [
    {
      icon: Shield,
      title: 'Triple Verification',
      desc: 'Face scan, email & phone verification ensures every profile is authentic',
      color: '#10B981'
    },
    {
      icon: Video,
      title: 'Vibe Videos',
      desc: 'See personality through 15-second profile videos before matching',
      color: '#8B5CF6'
    },
    {
      icon: Mic,
      title: 'Voice Intros',
      desc: 'Hear their voice with 30-second audio introductions',
      color: '#EC4899'
    },
    {
      icon: Lock,
      title: 'Secure Communication',
      desc: 'In-app calls & video chat without sharing personal numbers',
      color: '#3B82F6'
    }
  ];

  const stats = [
    { value: '100K+', label: 'Verified Members', icon: Users },
    { value: '50K+', label: 'Successful Matches', icon: Heart },
    { value: '99%', label: 'Satisfaction Rate', icon: Star },
    { value: '50+', label: 'Countries', icon: Globe }
  ];

  const testimonials = [
    { name: 'Alexandra', role: 'Sugar Baby', text: 'Finally a platform that values safety and authenticity. The video profiles make such a difference!', rating: 5 },
    { name: 'Michael', role: 'Sugar Daddy', text: 'The verification process gives me confidence that connections are real. Worth every penny.', rating: 5 },
    { name: 'Sophia', role: 'Sugar Baby', text: 'Voice notes changed everything - you can feel the chemistry before even matching.', rating: 5 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Animated Background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: `
          radial-gradient(ellipse 80% 50% at 20% 40%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 80% 60%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
          radial-gradient(ellipse 50% 30% at 50% 90%, rgba(236, 72, 153, 0.05) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }} />

      {/* Floating Orbs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'fixed',
            width: 300 + i * 100,
            height: 300 + i * 100,
            borderRadius: '50%',
            border: '1px solid rgba(212, 175, 55, 0.05)',
            left: `${20 + i * 15}%`,
            top: `${10 + i * 10}%`,
            pointerEvents: 'none'
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 30 + i * 10, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '16px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(3, 5, 8, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.1)'
        }}
      >
        <motion.div 
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          whileHover={{ scale: 1.02 }}
        >
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
          <span style={{ 
            fontFamily: 'Playfair Display', 
            fontSize: '1.6rem',
            fontWeight: 600
          }} className="gold-text">
            INDULGE
          </span>
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="btn btn-ghost"
            style={{ padding: '10px 24px' }}
          >
            Sign In
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/signup')}
            className="btn btn-gold"
            style={{ padding: '10px 24px' }}
          >
            Join Free
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '120px 40px 80px',
        position: 'relative'
      }}>
        <div style={{ 
          maxWidth: 1400, 
          margin: '0 auto', 
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'center'
        }}>
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                background: 'rgba(212, 175, 55, 0.1)',
                borderRadius: 50,
                border: '1px solid rgba(212, 175, 55, 0.2)',
                marginBottom: 28
              }}
            >
              <Sparkles size={14} color="#D4AF37" />
              <span style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 500 }}>
                Premium Sugar Dating Platform
              </span>
            </motion.div>

            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1.1,
              marginBottom: 24,
              fontWeight: 500
            }}>
              Where <span className="gold-text">Luxury</span> Meets
              <br />
              <span className="gold-text">Authentic</span> Connection
            </h1>

            <p style={{ 
              fontSize: '1.15rem',
              color: 'var(--gray-400)',
              marginBottom: 40,
              maxWidth: 520,
              lineHeight: 1.8
            }}>
              The most secure sugar dating platform with mandatory verification, 
              video profiles, and voice introductions. No catfishing, just real connections.
            </p>

            <div style={{ display: 'flex', gap: 16, marginBottom: 48 }}>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(212, 175, 55, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className="btn btn-gold"
                style={{ padding: '16px 36px', fontSize: '1rem' }}
              >
                Start Free <ArrowRight size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-outline"
                style={{ padding: '16px 36px' }}
              >
                <Play size={18} /> Watch Demo
              </motion.button>
            </div>

            {/* Stats Row */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: 24,
              padding: '24px 0',
              borderTop: '1px solid rgba(255,255,255,0.06)'
            }}>
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  <div className="gold-text" style={{ 
                    fontSize: '1.8rem', 
                    fontWeight: 700,
                    fontFamily: 'Inter',
                    marginBottom: 4
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ color: 'var(--gray-500)', fontSize: 13 }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
          >
            {/* Glowing Background */}
            <div style={{
              position: 'absolute',
              width: '120%',
              height: '120%',
              background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.15) 0%, transparent 60%)',
              filter: 'blur(60px)'
            }} />

            {/* Phone Mockup */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 320,
                height: 650,
                background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
                borderRadius: 40,
                border: '3px solid rgba(212, 175, 55, 0.3)',
                padding: 12,
                position: 'relative',
                boxShadow: '0 50px 100px rgba(0,0,0,0.5), 0 0 100px rgba(212, 175, 55, 0.1)'
              }}
            >
              {/* Phone Screen */}
              <div style={{
                width: '100%',
                height: '100%',
                background: 'var(--black)',
                borderRadius: 28,
                overflow: 'hidden',
                position: 'relative'
              }}>
                {/* Profile Card Preview */}
                <div style={{
                  height: '65%',
                  background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'var(--gradient-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 60px rgba(212, 175, 55, 0.4)'
                  }}>
                    <span style={{ fontSize: 40, color: '#030508', fontWeight: 600 }}>S</span>
                  </div>
                  
                  {/* Verified Badge */}
                  <div style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    background: 'rgba(16, 185, 129, 0.2)',
                    padding: '6px 12px',
                    borderRadius: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}>
                    <Shield size={12} color="#10B981" />
                    <span style={{ fontSize: 11, color: '#10B981' }}>Verified</span>
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 22, marginBottom: 4 }}>Sophia, <span style={{ fontWeight: 400, color: 'var(--gray-400)' }}>24</span></h3>
                  <p style={{ color: 'var(--gray-500)', fontSize: 13, marginBottom: 16 }}>Los Angeles, CA</p>
                  
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['Travel', 'Fashion', 'Fine Dining'].map((tag, i) => (
                      <span key={i} className="tag" style={{ fontSize: 11, padding: '4px 10px' }}>{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 20
                }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '2px solid rgba(239, 68, 68, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: 24 }}>✕</span>
                  </div>
                  <div style={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: 'var(--gradient-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 30px rgba(212, 175, 55, 0.4)'
                  }}>
                    <Heart size={28} color="#030508" fill="#030508" />
                  </div>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'rgba(139, 92, 246, 0.15)',
                    border: '2px solid rgba(139, 92, 246, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Star size={22} color="#8B5CF6" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                padding: '12px 16px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: 12,
                border: '1px solid rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <Shield size={18} color="#10B981" />
              <span style={{ color: '#10B981', fontSize: 13, fontWeight: 500 }}>100% Verified</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{
                position: 'absolute',
                bottom: '20%',
                right: '5%',
                padding: '12px 16px',
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: 12,
                border: '1px solid rgba(139, 92, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <Video size={18} color="#8B5CF6" />
              <span style={{ color: '#8B5CF6', fontSize: 13, fontWeight: 500 }}>Video Profiles</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            color: 'var(--gray-500)'
          }}
        >
          <span style={{ fontSize: 12 }}>Scroll to explore</span>
          <ChevronDown size={20} />
        </motion.div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '100px 40px', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 80 }}
          >
            <span className="tag" style={{ marginBottom: 16, display: 'inline-flex' }}>
              <Zap size={14} /> Why INDULGE
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 20 }}>
              Dating Reimagined for the <span className="gold-text">Modern Era</span>
            </h2>
            <p style={{ color: 'var(--gray-400)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
              We've built the safest, most authentic sugar dating experience with features that matter.
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
                whileHover={{ y: -8, borderColor: `${feature.color}40` }}
                className="card"
                style={{ padding: 32, textAlign: 'center' }}
              >
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: `${feature.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <feature.icon size={28} color={feature.color} />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: 12 }}>{feature.title}</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: 14, lineHeight: 1.7 }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '100px 40px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            maxWidth: 900,
            margin: '0 auto',
            padding: '80px 60px',
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
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
            filter: 'blur(40px)'
          }} />

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'var(--gradient-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              boxShadow: '0 20px 60px rgba(212, 175, 55, 0.4)'
            }}
          >
            <Crown size={36} color="#030508" />
          </motion.div>

          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: 20 }}>
            Ready to Find Your <span className="gold-text">Perfect Match?</span>
          </h2>
          <p style={{ color: 'var(--gray-400)', fontSize: '1.1rem', marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
            Join thousands of verified members. Sugar Babies join free. Sugar Daddies & Mommies get premium access.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="btn btn-gold"
              style={{ padding: '18px 48px', fontSize: '1rem' }}
            >
              Create Free Account <ArrowRight size={18} />
            </motion.button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 40, flexWrap: 'wrap' }}>
            {['Sugar Babies join FREE', 'No credit card required', 'Cancel anytime'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gray-400)', fontSize: 14 }}>
                <Check size={16} color="#10B981" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '60px 40px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
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
          <span className="gold-text" style={{ fontFamily: 'Playfair Display', fontSize: '1.4rem' }}>INDULGE</span>
        </div>
        <p style={{ color: 'var(--gray-600)', fontSize: 13 }}>
          © 2025 INDULGE. Premium Sugar Dating Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
