import { Link, useLocation } from 'react-router-dom';
import '../styles/layout.css';

const Layout = ({ children }) => {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Log Interaction', icon: '📝' },
    { path: '/interactions', label: 'All Records', icon: '📋' },
    { path: '/docs', label: 'Docs', icon: '📚' },
  ];

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-brand">
          <div className="nav-logo">🏥</div>
          <div>
            <h1 className="nav-title">AI-First CRM</h1>
            <p className="nav-subtitle">HCP Interaction Module</p>
          </div>
        </div>
        <div className="nav-links">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              <span className="nav-link-icon">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
