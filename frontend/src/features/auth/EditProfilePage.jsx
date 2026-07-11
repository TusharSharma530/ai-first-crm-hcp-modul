import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Building2, Globe, Clock, Save, X } from 'lucide-react';
import { updateProfile, clearError } from './authSlice';
import '../../styles/auth.css';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
];

const TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'EST', label: 'EST (Eastern Standard Time)' },
  { value: 'PST', label: 'PST (Pacific Standard Time)' },
  { value: 'CST', label: 'CST (Central Standard Time)' },
];

export default function EditProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    bio: '',
    language: 'en',
    timezone: 'UTC',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        company: user.company || '',
        bio: user.bio || '',
        language: user.language || 'en',
        timezone: user.timezone || 'UTC',
      });
    }
  }, [user]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (formData.bio.length > 500) {
      newErrors.bio = 'Bio must be 500 characters or less';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await dispatch(updateProfile(formData));
    if (updateProfile.fulfilled.match(result)) {
      navigate('/profile');
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Edit Profile</h1>
          <p>Update your personal information</p>
        </div>

        <div className="profile-card">
          <form onSubmit={handleSubmit} className="profile-form">
            {error && <div className="auth-error"><span>{error}</span></div>}

            <div className="profile-form-grid">
              <div className="auth-field">
                <label htmlFor="name">Full Name *</label>
                <div className="auth-input-group">
                  <User className="auth-input-icon" size={18} />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`auth-input ${errors.name ? 'auth-input-error' : ''}`}
                  />
                </div>
                {errors.name && <span className="auth-field-error">{errors.name}</span>}
              </div>

              <div className="auth-field">
                <label htmlFor="phone">Phone Number</label>
                <div className="auth-input-group">
                  <Phone className="auth-input-icon" size={18} />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`auth-input ${errors.phone ? 'auth-input-error' : ''}`}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                {errors.phone && <span className="auth-field-error">{errors.phone}</span>}
              </div>

              <div className="auth-field">
                <label htmlFor="company">Company</label>
                <div className="auth-input-group">
                  <Building2 className="auth-input-icon" size={18} />
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    className="auth-input"
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="language">Language</label>
                <div className="auth-input-group">
                  <Globe className="auth-input-icon" size={18} />
                  <select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="auth-input auth-select"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="timezone">Timezone</label>
                <div className="auth-input-group">
                  <Clock className="auth-input-icon" size={18} />
                  <select
                    id="timezone"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    className="auth-input auth-select"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="auth-field profile-field-full">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className={`auth-input auth-textarea ${errors.bio ? 'auth-input-error' : ''}`}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  maxLength={500}
                />
                <span className="auth-field-hint">{formData.bio.length}/500 characters</span>
                {errors.bio && <span className="auth-field-error">{errors.bio}</span>}
              </div>
            </div>

            <div className="profile-form-actions">
              <button type="button" className="profile-btn profile-btn-secondary" onClick={() => navigate('/profile')}>
                <X size={16} />
                Cancel
              </button>
              <button type="submit" className="profile-btn profile-btn-primary" disabled={loading}>
                {loading ? (
                  <span className="auth-btn-loading">
                    <span className="spinner-small"></span>
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
