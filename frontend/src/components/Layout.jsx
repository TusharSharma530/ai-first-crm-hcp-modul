import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ClipboardCheck,
  History,
  BookOpen,
  Stethoscope,
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Lock,
} from 'lucide-react';
import { logout } from '../features/auth/authSlice';
import '../styles/layout.css';

const navItems = [
  { path: '/', label: 'Interactions', icon: ClipboardCheck },
  { path: '/interactions', label: 'Interaction History', icon: History },
  { path: '/docs', label: 'Knowledge Base', icon: BookOpen },
];

const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setLogoutConfirm(true);
    setProfileOpen(false);
  };

  const confirmLogout = () => {
    dispatch(logout());
    setLogoutConfirm(false);
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getUserRole = (role) => {
    const roles = { admin: 'Administrator', manager: 'Manager', user: 'Medical Rep' };
    return roles[role] || 'Medical Rep';
  };

  return (
    <>
      <header className="app-header">
        <div className="header-inner">
          {/* Brand */}
          <div className="header-brand">
            <Link to={isAuthenticated ? '/' : '/login'} className="header-brand-link">
              <div className="header-logo">
                <Stethoscope size={22} strokeWidth={2.2} />
              </div>
              <div className="header-brand-text">
                <span className="header-brand-name">AI-First CRM</span>
                <span className="header-brand-tagline">Enterprise Healthcare Platform</span>
              </div>
            </Link>
          </div>

          {/* Center Nav */}
          {isAuthenticated && (
            <nav className="header-nav" role="navigation" aria-label="Main navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`header-nav-pill ${isActive ? 'active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon size={17} strokeWidth={isActive ? 2.3 : 1.8} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {!isAuthenticated && <div className="header-nav" />}

          {/* Right Utilities */}
          <div className="header-right">
            {isAuthenticated ? (
              <>
                {/* Search */}
                <div className={`header-search ${searchFocused ? 'focused' : ''}`}>
                  <Search size={16} className="header-search-icon" />
                  <input
                    type="text"
                    placeholder="Search HCPs, interactions..."
                    className="header-search-input"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    aria-label="Global search"
                  />
                  <kbd className="header-search-kbd">⌘K</kbd>
                </div>

                {/* AI Status */}
                <div className="header-ai-status">
                  <span className="header-ai-dot" />
                  <Sparkles size={14} className="header-ai-sparkle" />
                  <span className="header-ai-label">AI Online</span>
                </div>

                {/* Notifications */}
                <div className="header-notif-wrapper" ref={notifRef}>
                  <button
                    className="header-icon-btn"
                    onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                    aria-label="Notifications"
                  >
                    <Bell size={19} strokeWidth={1.8} />
                    <span className="header-notif-badge">3</span>
                  </button>
                  {notifOpen && (
                    <div className="header-dropdown header-notif-dropdown">
                      <div className="header-dropdown-title">Notifications</div>
                      <div className="header-notif-item">
                        <div className="header-notif-dot green" />
                        <div>
                          <p className="header-notif-text">New interaction logged with Dr. Sharma</p>
                          <span className="header-notif-time">2 min ago</span>
                        </div>
                      </div>
                      <div className="header-notif-item">
                        <div className="header-notif-dot blue" />
                        <div>
                          <p className="header-notif-text">AI analysis completed for Apollo Hospital</p>
                          <span className="header-notif-time">15 min ago</span>
                        </div>
                      </div>
                      <div className="header-notif-item">
                        <div className="header-notif-dot amber" />
                        <div>
                          <p className="header-notif-text">Follow-up reminder: Dr. Patel</p>
                          <span className="header-notif-time">1 hr ago</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile */}
                <div className="header-profile-wrapper" ref={profileRef}>
                  <button
                    className="header-profile-btn"
                    onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                    aria-label="User profile menu"
                  >
                    <div className="header-avatar">{getInitials(user?.name)}</div>
                    <div className="header-profile-info">
                      <span className="header-profile-name">{user?.name || 'User'}</span>
                      <span className="header-profile-role">{getUserRole(user?.role)}</span>
                    </div>
                    <ChevronDown size={16} className={`header-profile-chevron ${profileOpen ? 'open' : ''}`} />
                  </button>
                  {profileOpen && (
                    <div className="header-dropdown header-profile-dropdown">
                      <button className="header-dropdown-item" onClick={() => { navigate('/profile'); setProfileOpen(false); }}>
                        <User size={16} />
                        <span>My Profile</span>
                      </button>
                      <button className="header-dropdown-item" onClick={() => { navigate('/settings'); setProfileOpen(false); }}>
                        <Settings size={16} />
                        <span>Settings</span>
                      </button>
                      {user?.role === 'admin' && (
                        <button className="header-dropdown-item" onClick={() => setProfileOpen(false)}>
                          <Shield size={16} />
                          <span>Admin Panel</span>
                        </button>
                      )}
                      <div className="header-dropdown-divider" />
                      <button className="header-dropdown-item danger" onClick={handleLogout}>
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="header-nav-pill">
                  <Lock size={16} />
                  <span>Sign In</span>
                </Link>
                <Link to="/register" className="header-nav-pill active">
                  <span>Get Started</span>
                </Link>
              </>
            )}

            {/* Mobile Toggle */}
            <button
              className="header-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="header-mobile-nav">
            <div className="header-mobile-search">
              <Search size={16} />
              <input type="text" placeholder="Search..." className="header-mobile-search-input" />
            </div>
            {isAuthenticated && navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`header-mobile-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {isAuthenticated && (
              <>
                <div className="header-mobile-divider" />
                <Link to="/profile" className="header-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                  <User size={18} />
                  <span>My Profile</span>
                </Link>
                <Link to="/settings" className="header-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                  <Settings size={18} />
                  <span>Settings</span>
                </Link>
                <div className="header-mobile-divider" />
                <button className="header-mobile-link danger" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link to="/login" className="header-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                  <Lock size={18} />
                  <span>Sign In</span>
                </Link>
                <Link to="/register" className="header-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                  <span>Get Started</span>
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Logout Confirmation Modal */}
      {logoutConfirm && (
        <div className="logout-modal-overlay" onClick={() => setLogoutConfirm(false)}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="logout-modal-icon">
              <LogOut size={24} />
            </div>
            <h3 className="logout-modal-title">Sign Out</h3>
            <p className="logout-modal-text">Are you sure you want to sign out of your account?</p>
            <div className="logout-modal-actions">
              <button className="logout-modal-btn cancel" onClick={() => setLogoutConfirm(false)}>Cancel</button>
              <button className="logout-modal-btn confirm" onClick={confirmLogout}>Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Layout = ({ children, hideHeader = false }) => {
  return (
    <div className="layout">
      {!hideHeader && <AppHeader />}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
