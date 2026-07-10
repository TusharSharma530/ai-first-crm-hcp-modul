import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Log Interaction', icon: '📝' },
    { path: '/chat', label: 'AI Chat', icon: '💬' },
    { path: '/interactions', label: 'All Records', icon: '📋' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <nav style={{
        background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '8px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '20px'
          }}>🏥</div>
          <div>
            <h1 style={{ color: 'white', margin: 0, fontSize: '1.25rem', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              AI-First CRM
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.7rem', fontFamily: 'Inter, sans-serif' }}>
              HCP Interaction Module
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                color: location.pathname === link.path ? 'white' : 'rgba(255,255,255,0.75)',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontFamily: 'Inter, sans-serif',
                fontWeight: location.pathname === link.path ? 600 : 400,
                backgroundColor: location.pathname === link.path ? 'rgba(255,255,255,0.15)' : 'transparent',
                transition: 'all 0.2s'
              }}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </div>
      </nav>
      <main style={{ padding: '1.5rem 2rem', fontFamily: 'Inter, sans-serif' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
