import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Camera, Video, Mic, Plus, X, Save, CheckCircle,
  Crown, Compass, Heart, MessageCircle, User, MapPin, Ruler,
  GraduationCap, Wine, Cigarette, DollarSign, Play, Volume2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../contexts/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('photos');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [photos, setPhotos] = useState(user?.photos || Array(8).fill(null));
  const [formData, setFormData] = useState({
    age: user?.age || '',
    gender: user?.gender || '',
    location: user?.location || '',
    height: user?.height || '',
    education: user?.education || '',
    smoking: user?.smoking || 'never',
    drinking: user?.drinking || 'social',
    lifestyle_tags: user?.lifestyle_tags || [],
    income_bracket: user?.income_bracket || '',
    allowance_expectation: user?.allowance_expectation || ''
  });

  const lifestyleOptions = [
    'Travel', 'Fine Dining', 'Fashion', 'Fitness', 'Art', 'Music',
    'Yachting', 'Wine', 'Golf', 'Spa', 'Shopping', 'Theater',
    'Photography', 'Cooking', 'Dancing', 'Reading', 'Tech', 'Nature'
  ];

  const handlePhotoUpload = (index) => {
    const newPhotos = [...photos];
    newPhotos[index] = { preview: `https://picsum.photos/400/500?random=${Date.now() + index}` };
    setPhotos(newPhotos);
  };

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
  };

  const toggleLifestyle = (tag) => {
    setFormData(prev => ({
      ...prev,
      lifestyle_tags: prev.lifestyle_tags.includes(tag)
        ? prev.lifestyle_tags.filter(t => t !== tag)
        : [...prev.lifestyle_tags, tag].slice(0, 8)
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/api/profile/me', formData);
      updateUser(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'photos', label: 'Photos', icon: Camera },
    { id: 'media', label: 'Media', icon: Video },
    { id: 'about', label: 'About', icon: User },
    { id: 'lifestyle', label: 'Lifestyle', icon: Heart }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--black)',
      paddingBottom: 100
    }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(3, 5, 8, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        zIndex: 100
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

        <h1 style={{ fontSize: '1.2rem' }}>Edit Profile</h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={loading}
          className="btn btn-gold"
          style={{ padding: '10px 20px', fontSize: 14 }}
        >
          {saved ? <CheckCircle size={18} /> : <Save size={18} />}
          {loading ? '...' : saved ? 'Saved' : 'Save'}
        </motion.button>
      </header>

      {/* Profile Preview */}
      <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: photos[0]?.preview 
            ? `url(${photos[0].preview}) center/cover`
            : 'var(--gradient-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {!photos[0] && (
            <span style={{ fontSize: 32, color: '#030508', fontWeight: 600 }}>
              {user?.first_name?.[0]?.toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: 4 }}>{user?.first_name}</h2>
          <span className="tag" style={{ fontSize: 12, padding: '4px 12px', textTransform: 'capitalize' }}>
            {user?.role === 'baby' ? 'Sugar Baby' : user?.role === 'daddy' ? 'Sugar Daddy' : 'Sugar Mommy'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 24px', marginBottom: 24 }}>
        <div style={{
          display: 'flex',
          gap: 8,
          background: 'rgba(255,255,255,0.03)',
          padding: 4,
          borderRadius: 14,
          overflowX: 'auto'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: activeTab === tab.id ? 'var(--gradient-gold)' : 'transparent',
                border: 'none',
                borderRadius: 10,
                color: activeTab === tab.id ? '#030508' : 'var(--gray-400)',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                whiteSpace: 'nowrap'
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 24px' }}>
        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p style={{ color: 'var(--gray-400)', fontSize: 14, marginBottom: 20 }}>
              Add up to 8 photos. First photo is your main profile picture.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {photos.map((photo, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => !photo && handlePhotoUpload(i)}
                  style={{
                    aspectRatio: '3/4',
                    background: photo?.preview 
                      ? `url(${photo.preview}) center/cover`
                      : 'rgba(255,255,255,0.03)',
                    borderRadius: 14,
                    border: i === 0 
                      ? '2px solid var(--gold)' 
                      : '2px dashed rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  {!photo ? (
                    <div style={{ textAlign: 'center' }}>
                      <Plus size={20} color={i === 0 ? 'var(--gold)' : 'var(--gray-600)'} />
                      {i === 0 && <p style={{ fontSize: 9, color: 'var(--gold)', marginTop: 4 }}>Main</p>}
                    </div>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); removePhoto(i); }}
                      style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: 'rgba(0,0,0,0.7)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={12} color="white" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Video */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                style={{
                  aspectRatio: '9/16',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.02) 100%)',
                  borderRadius: 20,
                  border: '2px dashed rgba(139, 92, 246, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(139, 92, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12
                }}>
                  <Video size={24} color="#8B5CF6" />
                </div>
                <h3 style={{ fontSize: 14, marginBottom: 4 }}>Vibe Video</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: 11, textAlign: 'center', padding: '0 16px' }}>
                  15-sec video
                </p>
              </motion.div>

              {/* Voice */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                style={{
                  aspectRatio: '9/16',
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0.02) 100%)',
                  borderRadius: 20,
                  border: '2px dashed rgba(236, 72, 153, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(236, 72, 153, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12
                }}>
                  <Mic size={24} color="#EC4899" />
                </div>
                <h3 style={{ fontSize: 14, marginBottom: 4 }}>Voice Intro</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: 11, textAlign: 'center', padding: '0 16px' }}>
                  30-sec audio
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-300)', fontSize: 13 }}>
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="25"
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-300)', fontSize: 13 }}>
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="input-field"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-300)', fontSize: 13 }}>
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Los Angeles, CA"
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-300)', fontSize: 13 }}>
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
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-300)', fontSize: 13 }}>
                  Education
                </label>
                <select
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="input-field"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Select...</option>
                  <option value="high_school">High School</option>
                  <option value="bachelors">Bachelor's</option>
                  <option value="masters">Master's</option>
                  <option value="doctorate">Doctorate</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Lifestyle Tab */}
        {activeTab === 'lifestyle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p style={{ color: 'var(--gray-400)', fontSize: 14, marginBottom: 20 }}>
              Select up to 8 interests
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {lifestyleOptions.map(tag => (
                <motion.button
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleLifestyle(tag)}
                  className={`tag ${formData.lifestyle_tags.includes(tag) ? 'active' : ''}`}
                  style={{ cursor: 'pointer', fontSize: 13, padding: '8px 16px' }}
                >
                  {tag}
                </motion.button>
              ))}
            </div>

            <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-300)', fontSize: 13 }}>
                  Smoking
                </label>
                <select
                  value={formData.smoking}
                  onChange={(e) => setFormData({ ...formData, smoking: e.target.value })}
                  className="input-field"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="never">Never</option>
                  <option value="social">Socially</option>
                  <option value="regular">Regularly</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-300)', fontSize: 13 }}>
                  Drinking
                </label>
                <select
                  value={formData.drinking}
                  onChange={(e) => setFormData({ ...formData, drinking: e.target.value })}
                  className="input-field"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="never">Never</option>
                  <option value="social">Socially</option>
                  <option value="regular">Regularly</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
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
            { icon: Crown, path: '/dashboard' },
            { icon: Compass, path: '/discover' },
            { icon: Heart, path: '/matches' },
            { icon: MessageCircle, path: '/matches' },
            { icon: User, path: '/profile', active: true }
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
    </div>
  );
};

export default Profile;
