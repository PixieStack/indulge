import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, ArrowRight, ArrowLeft, Camera, Video, Mic, 
  MapPin, Ruler, GraduationCap, Wine, Cigarette, Heart,
  DollarSign, Check, Upload, Play, X, Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../contexts/AuthContext';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState(Array(8).fill(null));
  const [video, setVideo] = useState(null);
  const [voiceNote, setVoiceNote] = useState(null);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    orientation: 'straight',
    location: '',
    height: '',
    education: '',
    smoking: 'never',
    drinking: 'social',
    income_bracket: '',
    net_worth: '',
    allowance_expectation: '',
    lifestyle_tags: [],
    prompts: []
  });

  const steps = [
    { id: 1, title: 'Photos', icon: Camera },
    { id: 2, title: 'Video & Voice', icon: Video },
    { id: 3, title: 'About You', icon: Heart },
    { id: 4, title: 'Lifestyle', icon: Wine },
    { id: 5, title: 'Expectations', icon: DollarSign }
  ];

  const lifestyleOptions = [
    'Travel', 'Fine Dining', 'Fashion', 'Fitness', 'Art', 'Music',
    'Yachting', 'Wine', 'Golf', 'Spa', 'Shopping', 'Theater',
    'Photography', 'Cooking', 'Dancing', 'Reading', 'Tech', 'Nature',
    'Nightlife', 'Sports', 'Luxury Cars', 'Jewelry'
  ];

  const promptQuestions = [
    "My ideal first date would be...",
    "I show appreciation by...",
    "The way to my heart is...",
    "I'm looking for someone who...",
    "My favorite way to unwind is...",
    "A perfect weekend looks like..."
  ];

  const handlePhotoUpload = (index) => {
    // Simulate photo upload
    const newPhotos = [...photos];
    newPhotos[index] = { preview: `https://picsum.photos/400/500?random=${index}` };
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

  const handleComplete = async () => {
    setLoading(true);
    try {
      await api.put('/api/profile/me', {
        ...formData,
        profile_complete: true
      });
      updateUser({ ...formData, profile_complete: true });
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
    else handleComplete();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--black)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
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
            Profile Setup
          </span>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--gray-400)',
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          Skip for now
        </button>
      </header>

      {/* Progress Steps */}
      <div style={{ padding: '24px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: 8, maxWidth: 600, margin: '0 auto' }}>
          {steps.map((s, i) => (
            <div
              key={s.id}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: step >= s.id ? 'var(--gradient-gold)' : 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}>
                {step > s.id ? (
                  <Check size={18} color="#030508" />
                ) : (
                  <s.icon size={18} color={step >= s.id ? '#030508' : 'var(--gray-500)'} />
                )}
              </div>
              <span style={{ 
                fontSize: 11, 
                color: step >= s.id ? 'var(--gold)' : 'var(--gray-600)',
                fontWeight: step === s.id ? 600 : 400
              }}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '40px', overflow: 'auto' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            {/* Step 1: Photos */}
            {step === 1 && (
              <motion.div
                key="photos"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 style={{ fontSize: '1.8rem', marginBottom: 8, textAlign: 'center' }}>
                  Add Your Best <span className="gold-text">Photos</span>
                </h2>
                <p style={{ color: 'var(--gray-400)', textAlign: 'center', marginBottom: 40 }}>
                  Upload up to 8 photos. The first one will be your main profile picture.
                </p>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(4, 1fr)', 
                  gap: 16 
                }}>
                  {photos.map((photo, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => !photo && handlePhotoUpload(i)}
                      style={{
                        aspectRatio: '3/4',
                        background: photo 
                          ? `url(${photo.preview}) center/cover`
                          : 'rgba(255,255,255,0.03)',
                        borderRadius: 16,
                        border: i === 0 
                          ? '2px solid var(--gold)' 
                          : '2px dashed rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {!photo ? (
                        <div style={{ textAlign: 'center' }}>
                          <Plus size={24} color={i === 0 ? 'var(--gold)' : 'var(--gray-600)'} />
                          {i === 0 && (
                            <p style={{ fontSize: 10, color: 'var(--gold)', marginTop: 8 }}>Main Photo</p>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); removePhoto(i); }}
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: 'rgba(0,0,0,0.7)',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <X size={14} color="white" />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>

                <p style={{ 
                  textAlign: 'center', 
                  color: 'var(--gray-500)', 
                  fontSize: 13, 
                  marginTop: 24 
                }}>
                  Photos help you get 10x more matches. Show your personality!
                </p>
              </motion.div>
            )}

            {/* Step 2: Video & Voice */}
            {step === 2 && (
              <motion.div
                key="media"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 style={{ fontSize: '1.8rem', marginBottom: 8, textAlign: 'center' }}>
                  Show Your <span className="gold-text">Vibe</span>
                </h2>
                <p style={{ color: 'var(--gray-400)', textAlign: 'center', marginBottom: 40 }}>
                  Add a video and voice intro to stand out from the crowd
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  {/* Video Upload */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    style={{
                      aspectRatio: '9/16',
                      background: video 
                        ? 'var(--black-card)' 
                        : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.02) 100%)',
                      borderRadius: 20,
                      border: '2px dashed rgba(139, 92, 246, 0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: 'rgba(139, 92, 246, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16
                    }}>
                      <Video size={28} color="#8B5CF6" />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: 8 }}>Vibe Video</h3>
                    <p style={{ color: 'var(--gray-500)', fontSize: 13, textAlign: 'center', padding: '0 20px' }}>
                      15-second looping video showing your personality
                    </p>
                  </motion.div>

                  {/* Voice Upload */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    style={{
                      aspectRatio: '9/16',
                      background: voiceNote 
                        ? 'var(--black-card)' 
                        : 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0.02) 100%)',
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
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: 'rgba(236, 72, 153, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16
                    }}>
                      <Mic size={28} color="#EC4899" />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: 8 }}>Voice Intro</h3>
                    <p style={{ color: 'var(--gray-500)', fontSize: 13, textAlign: 'center', padding: '0 20px' }}>
                      30-second voice note introducing yourself
                    </p>
                  </motion.div>
                </div>

                <p style={{ 
                  textAlign: 'center', 
                  color: 'var(--gray-500)', 
                  fontSize: 13, 
                  marginTop: 24 
                }}>
                  Video and voice profiles get 5x more engagement
                </p>
              </motion.div>
            )}

            {/* Step 3: About You */}
            {step === 3 && (
              <motion.div
                key="about"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 style={{ fontSize: '1.8rem', marginBottom: 8, textAlign: 'center' }}>
                  Tell Us About <span className="gold-text">You</span>
                </h2>
                <p style={{ color: 'var(--gray-400)', textAlign: 'center', marginBottom: 40 }}>
                  Help us find your perfect match
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-300)', fontSize: 14 }}>
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
                    <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-300)', fontSize: 14 }}>
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

                  <div>
                    <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-300)', fontSize: 14 }}>
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
                    <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-300)', fontSize: 14 }}>
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

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-300)', fontSize: 14 }}>
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
                      <option value="some_college">Some College</option>
                      <option value="bachelors">Bachelor's Degree</option>
                      <option value="masters">Master's Degree</option>
                      <option value="doctorate">Doctorate</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Lifestyle */}
            {step === 4 && (
              <motion.div
                key="lifestyle"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 style={{ fontSize: '1.8rem', marginBottom: 8, textAlign: 'center' }}>
                  Your <span className="gold-text">Lifestyle</span>
                </h2>
                <p style={{ color: 'var(--gray-400)', textAlign: 'center', marginBottom: 40 }}>
                  Select up to 8 interests that define you
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                  {lifestyleOptions.map(tag => (
                    <motion.button
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleLifestyle(tag)}
                      className={`tag ${formData.lifestyle_tags.includes(tag) ? 'active' : ''}`}
                      style={{
                        cursor: 'pointer',
                        fontSize: 14,
                        padding: '10px 18px'
                      }}
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>

                <div style={{ 
                  marginTop: 40, 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: 20 
                }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-300)', fontSize: 14 }}>
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
                    <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-300)', fontSize: 14 }}>
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

            {/* Step 5: Expectations */}
            {step === 5 && (
              <motion.div
                key="expectations"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 style={{ fontSize: '1.8rem', marginBottom: 8, textAlign: 'center' }}>
                  Your <span className="gold-text">Expectations</span>
                </h2>
                <p style={{ color: 'var(--gray-400)', textAlign: 'center', marginBottom: 40 }}>
                  {user?.role === 'baby' 
                    ? 'What are you looking for in an arrangement?'
                    : 'Share your financial background to find compatible matches'}
                </p>

                {user?.role === 'baby' ? (
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-300)', fontSize: 14 }}>
                      Monthly Allowance Expectation
                    </label>
                    <select
                      value={formData.allowance_expectation}
                      onChange={(e) => setFormData({ ...formData, allowance_expectation: e.target.value })}
                      className="input-field"
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="">Select...</option>
                      <option value="negotiable">Negotiable</option>
                      <option value="1k-3k">$1,000 - $3,000</option>
                      <option value="3k-5k">$3,000 - $5,000</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k+">$10,000+</option>
                    </select>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 20 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-300)', fontSize: 14 }}>
                        Annual Income
                      </label>
                      <select
                        value={formData.income_bracket}
                        onChange={(e) => setFormData({ ...formData, income_bracket: e.target.value })}
                        className="input-field"
                        style={{ cursor: 'pointer' }}
                      >
                        <option value="">Select...</option>
                        <option value="100k-250k">$100K - $250K</option>
                        <option value="250k-500k">$250K - $500K</option>
                        <option value="500k-1m">$500K - $1M</option>
                        <option value="1m-5m">$1M - $5M</option>
                        <option value="5m+">$5M+</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: 8, color: 'var(--gray-300)', fontSize: 14 }}>
                        Net Worth
                      </label>
                      <select
                        value={formData.net_worth}
                        onChange={(e) => setFormData({ ...formData, net_worth: e.target.value })}
                        className="input-field"
                        style={{ cursor: 'pointer' }}
                      >
                        <option value="">Select...</option>
                        <option value="500k-1m">$500K - $1M</option>
                        <option value="1m-5m">$1M - $5M</option>
                        <option value="5m-10m">$5M - $10M</option>
                        <option value="10m+">$10M+</option>
                      </select>
                    </div>
                  </div>
                )}

                <div style={{
                  marginTop: 40,
                  padding: 24,
                  background: 'rgba(212, 175, 55, 0.05)',
                  borderRadius: 16,
                  border: '1px solid rgba(212, 175, 55, 0.1)'
                }}>
                  <p style={{ color: 'var(--gray-400)', fontSize: 14, textAlign: 'center' }}>
                    This information is kept confidential and only used to match you with compatible partners.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Navigation */}
      <div style={{
        padding: '20px 40px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {step > 1 ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={prevStep}
            className="btn btn-ghost"
          >
            <ArrowLeft size={18} /> Back
          </motion.button>
        ) : (
          <div />
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={nextStep}
          disabled={loading}
          className="btn btn-gold"
          style={{ minWidth: 160, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Saving...' : step === 5 ? (
            <>Complete Setup <Check size={18} /></>
          ) : (
            <>Continue <ArrowRight size={18} /></>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default ProfileSetup;
