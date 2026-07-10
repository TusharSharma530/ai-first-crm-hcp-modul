const HCPProfileCard = ({ profile }) => {
  if (!profile) return null;

  const styles = {
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '1.25rem',
      border: '1px solid #e8eaed',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      marginTop: '0.5rem',
      marginBottom: '0.5rem'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '1rem',
      paddingBottom: '0.75rem',
      borderBottom: '1px solid #e8eaed'
    },
    avatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #1a73e8, #4285f4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      color: 'white',
      fontWeight: 600,
      fontFamily: 'Inter, sans-serif'
    },
    name: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '1rem',
      fontWeight: 600,
      color: '#1a1a2e',
      margin: 0
    },
    specialty: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.8rem',
      color: '#6b7280',
      margin: 0
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.75rem'
    },
    infoItem: {
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      padding: '0.75rem'
    },
    infoLabel: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.7rem',
      color: '#6b7280',
      marginBottom: '4px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    infoValue: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.85rem',
      color: '#1a1a2e',
      fontWeight: 500
    },
    badge: {
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: 500,
      backgroundColor: '#ecfdf5',
      color: '#059669'
    },
    fullWidth: {
      gridColumn: '1 / -1'
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'DR';
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.avatar}>
          {getInitials(profile.name)}
        </div>
        <div>
          <h3 style={styles.name}>{profile.name || 'Unknown Doctor'}</h3>
          <p style={styles.specialty}>{profile.specialty || 'General Practice'}</p>
        </div>
      </div>
      
      <div style={styles.infoGrid}>
        <div style={styles.infoItem}>
          <div style={styles.infoLabel}>Organization</div>
          <div style={styles.infoValue}>{profile.organization || 'N/A'}</div>
        </div>
        
        <div style={styles.infoItem}>
          <div style={styles.infoLabel}>Total Visits</div>
          <div style={styles.infoValue}>
            <span style={styles.badge}>{profile.total_interactions || 0}</span>
          </div>
        </div>
        
        {profile.email && (
          <div style={{ ...styles.infoItem, ...styles.fullWidth }}>
            <div style={styles.infoLabel}>Email</div>
            <div style={styles.infoValue}>{profile.email}</div>
          </div>
        )}
        
        {profile.last_interaction_date && (
          <div style={{ ...styles.infoItem, ...styles.fullWidth }}>
            <div style={styles.infoLabel}>Last Interaction</div>
            <div style={styles.infoValue}>{new Date(profile.last_interaction_date).toLocaleDateString()}</div>
          </div>
        )}
        
        {profile.recent_topics && (
          <div style={{ ...styles.infoItem, ...styles.fullWidth }}>
            <div style={styles.infoLabel}>Recent Topics</div>
            <div style={styles.infoValue}>{profile.recent_topics}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HCPProfileCard;