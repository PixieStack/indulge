import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Crown, ArrowLeft, Bell, Lock, Eye, Globe, CreditCard,
  Shield, HelpCircle, LogOut, ChevronRight, Moon, Smartphone
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const settingsSections = [
    {
      title: 'Preferences',
      items: [
        { icon: Globe, label: 'Discovery Preferences', desc: 'Age range, distance, gender' },
        { icon: Bell, label: 'Notifications', desc: 'Push, email, SMS settings' },
        { icon: Moon, label: 'Appearance', desc: 'Dark mode enabled' }
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        { icon: Eye, label: 'Privacy Controls', desc: 'Who can see your profile' },
        { icon: Lock, label: 'Account Security', desc: 'Password, 2FA settings' },
        { icon: Shield, label: 'Blocked Users', desc: 'Manage blocked profiles' }
      ]
    },
    {
      title: 'Subscription',
      items: [
        { icon: CreditCard, label: 'Billing & Plans', desc: 'Manage your subscription' }
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', desc: 'FAQs and support' },
        { icon: Smartphone, label: 'Contact Us', desc: 'Get in touch' }
      ]
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--black)'
    }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: 'rgba(3, 5, 8, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        zIndex: 100
      }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
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
        <h1 style={{ fontSize: '1.3rem' }}>Settings</h1>
      </header>

      {/* Content */}
      <div style={{ padding: '24px 40px', maxWidth: 600, margin: '0 auto' }}>
        {settingsSections.map((section, sIdx) => (
          <div key={sIdx} style={{ marginBottom: 32 }}>
            <h2 style={{ 
              fontSize: 13, 
              color: 'var(--gray-500)', 
              marginBottom: 12,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}>
              {section.title}
            </h2>
            
            <div className="card" style={{ overflow: 'hidden' }}>
              {section.items.map((item, iIdx) => (
                <motion.div
                  key={iIdx}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    cursor: 'pointer',
                    borderBottom: iIdx < section.items.length - 1 
                      ? '1px solid rgba(255,255,255,0.06)' 
                      : 'none'
                  }}
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: 'rgba(212, 175, 55, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <item.icon size={18} color="var(--gold)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 15, marginBottom: 2 }}>{item.label}</h3>
                    <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>{item.desc}</p>
                  </div>
                  <ChevronRight size={18} color="var(--gray-600)" />
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => { logout(); navigate('/'); }}
          style={{
            width: '100%',
            padding: '16px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            color: '#EF4444',
            cursor: 'pointer',
            marginTop: 20
          }}
        >
          <LogOut size={18} />
          Sign Out
        </motion.button>

        <p style={{ 
          textAlign: 'center', 
          color: 'var(--gray-600)', 
          fontSize: 12, 
          marginTop: 32 
        }}>
          INDULGE v1.0.0 • © 2025
        </p>
      </div>
    </div>
  );
};

export default Settings;
