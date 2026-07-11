import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Building2, Shield, Globe, Clock, Calendar, Edit3, Key
} from 'lucide-react';
import { fetchProfile } from './authSlice';
import '../../styles/auth.css';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, user]);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  if (loading && !user) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <span className="spinner"></span>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-card-header" style={{ flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <p style={{ color: '#ef4444' }}>Failed to load profile: {error}</p>
              <button className="profile-btn profile-btn-primary" onClick={() => dispatch(fetchProfile())}>
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account settings and preferences</p>
        </div>

        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar">
              <span>{getInitials(user?.name)}</span>
            </div>
            <div className="profile-card-info">
              <h2>{user?.name || 'User'}</h2>
              <p className="profile-role-badge">
                <Shield size={14} />
                {(user?.role || 'user').charAt(0).toUpperCase() + (user?.role || 'user').slice(1)}
              </p>
            </div>
            <div className="profile-card-actions">
              <button className="profile-btn profile-btn-primary" onClick={() => navigate('/profile/edit')}>
                <Edit3 size={16} />
                Edit Profile
              </button>
              <button className="profile-btn profile-btn-secondary" onClick={() => navigate('/change-password')}>
                <Key size={16} />
                Change Password
              </button>
            </div>
          </div>
        </div>

        <div className="profile-grid">
          <div className="profile-section">
            <h3 className="profile-section-title">
              <User size={18} />
              Personal Information
            </h3>
            <div className="profile-section-content">
              <ProfileField icon={<User size={16} />} label="Full Name" value={user?.name} />
              <ProfileField icon={<Mail size={16} />} label="Email Address" value={user?.email} />
              <ProfileField icon={<Phone size={16} />} label="Phone Number" value={user?.phone || 'Not provided'} />
              <ProfileField icon={<Building2 size={16} />} label="Company" value={user?.company || 'Not provided'} />
            </div>
          </div>

          <div className="profile-section">
            <h3 className="profile-section-title">
              <Shield size={18} />
              Account Details
            </h3>
            <div className="profile-section-content">
              <ProfileField
                icon={<Shield size={16} />}
                label="Role"
                value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
              />
              <ProfileField icon={<Globe size={16} />} label="Language" value={user?.language?.toUpperCase() || 'EN'} />
              <ProfileField icon={<Clock size={16} />} label="Timezone" value={user?.timezone || 'UTC'} />
            </div>
          </div>

          <div className="profile-section">
            <h3 className="profile-section-title">
              <Calendar size={18} />
              Activity
            </h3>
            <div className="profile-section-content">
              <ProfileField icon={<Calendar size={16} />} label="Member Since" value={formatDate(user?.created_at)} />
              <ProfileField icon={<Clock size={16} />} label="Last Login" value={formatDate(user?.last_login)} />
            </div>
          </div>

          {user?.bio && (
            <div className="profile-section profile-section-full">
              <h3 className="profile-section-title">
                <User size={18} />
                Bio
              </h3>
              <div className="profile-section-content">
                <p className="profile-bio">{user.bio}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileField({ icon, label, value }) {
  return (
    <div className="profile-field">
      <div className="profile-field-icon">{icon}</div>
      <div className="profile-field-content">
        <span className="profile-field-label">{label}</span>
        <span className="profile-field-value">{value || 'N/A'}</span>
      </div>
    </div>
  );
}
