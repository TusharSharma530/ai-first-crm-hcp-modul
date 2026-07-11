import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Save, X, CheckCircle, XCircle } from 'lucide-react';
import { changePassword, clearError } from './authSlice';
import '../../styles/auth.css';

export default function ChangePasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const passwordStrength = useMemo(() => {
    const p = formData.newPassword;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { level: 0, label: 'Weak', color: '#ef4444' };
    if (score <= 2) return { level: 1, label: 'Medium', color: '#f59e0b' };
    if (score <= 3) return { level: 2, label: 'Strong', color: '#3b82f6' };
    return { level: 3, label: 'Very Strong', color: '#10b981' };
  }, [formData.newPassword]);

  const passwordRequirements = useMemo(() => [], [formData.newPassword]);

  const validate = () => {
    const newErrors = {};
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    const result = await dispatch(changePassword({
      current_password: formData.currentPassword,
      new_password: formData.newPassword,
      confirm_password: formData.confirmPassword,
    }));
    if (changePassword.fulfilled.match(result)) {
      setSuccess(true);
      setTimeout(() => navigate('/profile'), 2000);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Change Password</h1>
          <p>Update your password to keep your account secure</p>
        </div>

        <div className="profile-card">
          {success ? (
            <div className="password-success">
              <CheckCircle size={48} />
              <h3>Password Updated Successfully</h3>
              <p>Redirecting to your profile...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="profile-form">
              {error && <div className="auth-error"><span>{error}</span></div>}

              <div className="profile-form-grid">
                <div className="auth-field profile-field-full">
                  <label htmlFor="currentPassword">Current Password *</label>
                  <div className="auth-input-group">
                    <Lock className="auth-input-icon" size={18} />
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className={`auth-input auth-input-password ${errors.currentPassword ? 'auth-input-error' : ''}`}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="auth-input-toggle"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      tabIndex={-1}
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.currentPassword && <span className="auth-field-error">{errors.currentPassword}</span>}
                </div>

                <div className="auth-field profile-field-full">
                  <label htmlFor="newPassword">New Password *</label>
                  <div className="auth-input-group">
                    <Lock className="auth-input-icon" size={18} />
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={formData.newPassword}
                      onChange={handleChange}
                      className={`auth-input auth-input-password ${errors.newPassword ? 'auth-input-error' : ''}`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="auth-input-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      tabIndex={-1}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.newPassword && <span className="auth-field-error">{errors.newPassword}</span>}

                  {formData.newPassword && (
                    <>
                      <div className="password-strength">
                        <div className="password-strength-bar">
                          {[0, 1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={`password-strength-segment ${i <= passwordStrength.level ? 'active' : ''}`}
                              style={{ backgroundColor: i <= passwordStrength.level ? passwordStrength.color : undefined }}
                            />
                          ))}
                        </div>
                        <span className="password-strength-label" style={{ color: passwordStrength.color }}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="password-requirements">
                        {passwordRequirements.map((req, i) => (
                          <div key={i} className={`password-requirement ${req.met ? 'met' : ''}`}>
                            {req.met ? <CheckCircle size={14} /> : <XCircle size={14} />}
                            <span>{req.label}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="auth-field profile-field-full">
                  <label htmlFor="confirmPassword">Confirm New Password *</label>
                  <div className="auth-input-group">
                    <Lock className="auth-input-icon" size={18} />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`auth-input auth-input-password ${errors.confirmPassword ? 'auth-input-error' : ''}`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="auth-input-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="auth-field-error">{errors.confirmPassword}</span>}
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
                      Updating...
                    </span>
                  ) : (
                    <>
                      <Save size={16} />
                      Update Password
                    </>
                )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
