import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
} from 'lucide-react';
import '../styles/layout.css';

const navItems = [
  { path: '/', label: 'Interactions', icon: ClipboardCheck },
  { path: '/interactions', label: 'Interaction History', icon: History },
  { path: '/docs', label: 'Knowledge Base', icon: BookOpen },
];

const AppHeader = () => {
  const location = useLocation();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
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

  return (
    <header className="app-header">
      <div className="header-inner">

        {/* ─── Left: Brand ─── */}
        <div className="header-brand">
          <Link to="/" className="header-brand-link">
            <div className="header-logo">
              <Stethoscope size={22} strokeWidth={2.2} />
            </div>
            <div className="header-brand-text">
              <span className="header-brand-name">AI-First CRM</span>
              <span className="header-brand-tagline">Enterprise Healthcare Platform</span>
            </div>
          </Link>
        </div>

        {/* ─── Center: Navigation Pills ─── */}
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

        {/* ─── Right: Utilities ─── */}
        <div className="header-right">

          {/* Global Search */}
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

          {/* User Profile */}
          <div className="header-profile-wrapper" ref={profileRef}>
            <button
              className="header-profile-btn"
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              aria-label="User profile menu"
            >
              <div className="header-avatar">RS</div>
              <div className="header-profile-info">
                <span className="header-profile-name">Rahul Sharma</span>
                <span className="header-profile-role">Medical Rep</span>
              </div>
              <ChevronDown size={16} className={`header-profile-chevron ${profileOpen ? 'open' : ''}`} />
            </button>
            {profileOpen && (
              <div className="header-dropdown header-profile-dropdown">
                <button className="header-dropdown-item">
                  <User size={16} />
                  <span>My Profile</span>
                </button>
                <button className="header-dropdown-item">
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <div className="header-dropdown-divider" />
                <button className="header-dropdown-item danger">
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="header-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="header-mobile-nav">
          <div className="header-mobile-search">
            <Search size={16} />
            <input type="text" placeholder="Search..." className="header-mobile-search-input" />
          </div>
          {navItems.map((item) => {
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
          <div className="header-mobile-divider" />
          <div className="header-mobile-profile">
            <div className="header-avatar">RS</div>
            <div>
              <p className="header-profile-name">Rahul Sharma</p>
              <span className="header-profile-role">Medical Rep</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <AppHeader />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
