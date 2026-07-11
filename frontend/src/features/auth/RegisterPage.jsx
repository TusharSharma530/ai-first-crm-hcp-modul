import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, Lock, Mail, ArrowRight, Shield, User, Phone, Building2,
  CheckCircle, XCircle
} from 'lucide-react';
import { registerUser, clearError } from './authSlice';
import '../../styles/auth.css';

const ROLES = [
  { value: 'user', label: 'User' },
  { value: 'manager', label: 'Manager' },
];

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: 'user',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const passwordStrength = useMemo(() => {
    const p = formData.password;
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
  }, [formData.password]);

  const passwordRequirements = useMemo(() => [], [formData.password]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const { confirmPassword, acceptTerms, ...rest } = formData;
    const userData = { ...rest, confirm_password: confirmPassword };
    const result = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-brand-panel">
            <div className="auth-brand-icon">
              <Shield size={48} strokeWidth={1.5} />
            </div>
            <h2 className="auth-brand-title">Join Our Platform</h2>
            <p className="auth-brand-subtitle">
              Create your account and start collaborating with your team today.
            </p>
            <div className="auth-brand-features">
              <div className="auth-brand-feature">
                <CheckIcon /> Free 14-day trial
              </div>
              <div className="auth-brand-feature">
                <CheckIcon /> No credit card required
              </div>
              <div className="auth-brand-feature">
                <CheckIcon /> Cancel anytime
              </div>
            </div>
          </div>

          <div className="auth-form-panel">
            <div className="auth-header">
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">Fill in your details to get started</p>
            </div>

            {error && (
              <div className="auth-error">
                <ErrorIcon />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label htmlFor="name">Full Name *</label>
                <div className="auth-input-group">
                  <User className="auth-input-icon" size={18} />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className={`auth-input ${errors.name ? 'auth-input-error' : ''}`}
                  />
                </div>
                {errors.name && <span className="auth-field-error">{errors.name}</span>}
              </div>

              <div className="auth-field">
                <label htmlFor="email">Email Address *</label>
                <div className="auth-input-group">
                  <Mail className="auth-input-icon" size={18} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                  />
                </div>
                {errors.email && <span className="auth-field-error">{errors.email}</span>}
              </div>

              <div className="auth-row">
                <div className="auth-field">
                  <label htmlFor="phone">Phone</label>
                  <div className="auth-input-group">
                    <Phone className="auth-input-icon" size={18} />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`auth-input ${errors.phone ? 'auth-input-error' : ''}`}
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
                      placeholder="Acme Inc."
                      value={formData.company}
                      onChange={handleChange}
                      className="auth-input"
                    />
                  </div>
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="role">Role *</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="auth-input auth-select"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password *</label>
                <div className="auth-input-group">
                  <Lock className="auth-input-icon" size={18} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`auth-input auth-input-password ${errors.password ? 'auth-input-error' : ''}`}
                  />
                  <button
                    type="button"
                    className="auth-input-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="auth-field-error">{errors.password}</span>}

                {formData.password && (
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

              <div className="auth-field">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <div className="auth-input-group">
                  <Lock className="auth-input-icon" size={18} />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`auth-input auth-input-password ${errors.confirmPassword ? 'auth-input-error' : ''}`}
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

              <div className="auth-field">
                <label className="auth-checkbox">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                  />
                  <span className="auth-checkbox-mark"></span>
                  <span className="auth-checkbox-label">
                    I agree to the <Link to="/terms" className="auth-link-inline">Terms of Service</Link> and{' '}
                    <Link to="/privacy" className="auth-link-inline">Privacy Policy</Link>
                  </span>
                </label>
                {errors.acceptTerms && <span className="auth-field-error">{errors.acceptTerms}</span>}
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? (
                  <span className="auth-btn-loading">
                    <span className="spinner-small"></span>
                    Creating account...
                  </span>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>Already have an account?</span>
            </div>

            <div className="auth-footer">
              <Link to="/login" className="auth-link-btn">
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="auth-feature-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}
