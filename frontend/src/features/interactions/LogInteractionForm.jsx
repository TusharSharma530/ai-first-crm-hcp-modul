import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createInteraction, fetchInteractions } from './interactionSlice';

const LogInteractionForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    hcp_name: '',
    hcp_email: '',
    hcp_specialty: '',
    hcp_organization: '',
    interaction_type: 'call',
    interaction_date: new Date().toISOString().slice(0, 16),
    notes: '',
    follow_up_required: 'no',
    follow_up_date: '',
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const autoFill = () => {
    const names = ['Dr. Rajesh Sharma', 'Dr. Priya Patel', 'Dr. Amit Kumar', 'Dr. Sneha Gupta', 'Dr. Rahul Verma', 'Dr. Ananya Singh', 'Dr. Vikram Mehta', 'Dr. Neha Reddy'];
    const specialties = ['Cardiology', 'Neurology', 'Oncology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Psychiatry', 'Radiology'];
    const organizations = ['AIIMS Delhi', 'Apollo Hospital', 'Fortis Healthcare', 'Max Hospital', 'Manipal Hospital', 'Narayana Health', 'Sir Ganga Ram Hospital', 'Metro Hospital'];
    const types = ['call', 'meeting', 'email', 'visit', 'conference'];
    const sentiments = ['positive', 'neutral', 'negative'];
    const topics = ['New drug launch', 'Clinical trial results', 'Patient outcomes', 'Prescription patterns', 'Medical conference', 'Treatment guidelines', 'Drug efficacy', 'Side effects discussion'];

    const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const randomEmail = (name) => name.toLowerCase().replace(/[^a-z]/g, '').replace('dr', '') + '@hospital.com';

    const name = randomItem(names);
    const followUp = Math.random() > 0.5 ? 'yes' : 'no';

    setFormData({
      hcp_name: name,
      hcp_email: randomEmail(name),
      hcp_specialty: randomItem(specialties),
      hcp_organization: randomItem(organizations),
      interaction_type: randomItem(types),
      interaction_date: new Date().toISOString().slice(0, 16),
      notes: `Discussed ${randomItem(topics)} with ${name}. ${randomItem(sentiments)} response received. Follow-up needed on ${randomItem(topics).toLowerCase()}.`,
      follow_up_required: followUp,
      follow_up_date: followUp === 'yes' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16) : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const submitData = {
        ...formData,
        interaction_date: formData.interaction_date ? formData.interaction_date + ':00' : new Date().toISOString(),
        follow_up_date: formData.follow_up_date ? formData.follow_up_date + ':00' : null,
      };
      await dispatch(createInteraction(submitData)).unwrap();
      dispatch(fetchInteractions());
      setStatus('success');
      setFormData({
        hcp_name: '',
        hcp_email: '',
        hcp_specialty: '',
        hcp_organization: '',
        interaction_type: 'call',
        interaction_date: new Date().toISOString().slice(0, 16),
        notes: '',
        follow_up_required: 'no',
        follow_up_date: '',
      });
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const styles = {
    container: { maxWidth: '100%', margin: '0 auto' },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '1.25rem'
    },
    headerIcon: {
      width: '40px',
      height: '40px',
      background: 'linear-gradient(135deg, #1a73e8, #4285f4)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      boxShadow: '0 2px 8px rgba(26,115,232,0.3)'
    },
    title: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#1a1a2e',
      margin: 0
    },
    subtitle: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.85rem',
      color: '#666',
      margin: 0
    },
    card: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
      border: '1px solid #e8eaed'
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontWeight: 500,
      color: '#374151',
      fontSize: '0.875rem',
      fontFamily: 'Inter, sans-serif'
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontFamily: 'Inter, sans-serif',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      outline: 'none'
    },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
    field: { marginBottom: '1rem' },
    button: {
      width: '100%',
      padding: '12px',
      background: status === 'loading' ? '#93c5fd' : 'linear-gradient(135deg, #1a73e8, #1557b0)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: status === 'loading' ? 'not-allowed' : 'pointer',
      fontFamily: 'Inter, sans-serif',
      boxShadow: '0 2px 8px rgba(26,115,232,0.3)',
      transition: 'all 0.2s',
      marginTop: '0.5rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerIcon}>📝</div>
        <div>
          <h2 style={styles.title}>Log HCP Interaction</h2>
          <p style={styles.subtitle}>Record your healthcare professional engagement</p>
        </div>
      </div>
      
      {status === 'success' && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#ecfdf5',
          border: '1px solid #6ee7b7',
          borderRadius: '8px',
          marginBottom: '1rem',
          color: '#065f46',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '18px' }}>✅</span> Interaction logged successfully!
        </div>
      )}
      
      {status === 'error' && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          marginBottom: '1rem',
          color: '#991b1b',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '18px' }}>❌</span> Error logging interaction. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.field}>
          <label style={styles.label}>HCP Name *</label>
          <input
            type="text"
            name="hcp_name"
            value={formData.hcp_name}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="e.g. Dr. Rajesh Sharma"
            onFocus={(e) => { e.target.style.borderColor = '#1a73e8'; e.target.style.boxShadow = '0 0 0 3px rgba(26,115,232,0.1)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        <div style={styles.row}>
          <div>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="hcp_email"
              value={formData.hcp_email}
              onChange={handleChange}
              style={styles.input}
              placeholder="doctor@hospital.com"
              onFocus={(e) => { e.target.style.borderColor = '#1a73e8'; e.target.style.boxShadow = '0 0 0 3px rgba(26,115,232,0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div>
            <label style={styles.label}>Specialty</label>
            <input
              type="text"
              name="hcp_specialty"
              value={formData.hcp_specialty}
              onChange={handleChange}
              style={styles.input}
              placeholder="e.g. Cardiology"
              onFocus={(e) => { e.target.style.borderColor = '#1a73e8'; e.target.style.boxShadow = '0 0 0 3px rgba(26,115,232,0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Organization</label>
          <input
            type="text"
            name="hcp_organization"
            value={formData.hcp_organization}
            onChange={handleChange}
            style={styles.input}
            placeholder="e.g. AIIMS Delhi"
            onFocus={(e) => { e.target.style.borderColor = '#1a73e8'; e.target.style.boxShadow = '0 0 0 3px rgba(26,115,232,0.1)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        <div style={styles.row}>
          <div>
            <label style={styles.label}>Interaction Type *</label>
            <select
              name="interaction_type"
              value={formData.interaction_type}
              onChange={handleChange}
              style={{ ...styles.input, backgroundColor: 'white', cursor: 'pointer' }}
            >
              <option value="call">📞 Call</option>
              <option value="meeting">🤝 Meeting</option>
              <option value="email">📧 Email</option>
              <option value="visit">🏥 Visit</option>
              <option value="conference">🎤 Conference</option>
            </select>
          </div>
          <div>
            <label style={styles.label}>Date *</label>
            <input
              type="datetime-local"
              name="interaction_date"
              value={formData.interaction_date}
              onChange={handleChange}
              required
              style={{ ...styles.input, cursor: 'pointer' }}
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Notes *</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            required
            rows={3}
            style={{ ...styles.input, resize: 'vertical', lineHeight: '1.5' }}
            placeholder="Describe the interaction details, topics discussed, outcomes..."
            onFocus={(e) => { e.target.style.borderColor = '#1a73e8'; e.target.style.boxShadow = '0 0 0 3px rgba(26,115,232,0.1)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        <div style={styles.row}>
          <div>
            <label style={styles.label}>Follow-up Required</label>
            <select
              name="follow_up_required"
              value={formData.follow_up_required}
              onChange={handleChange}
              style={{ ...styles.input, backgroundColor: 'white', cursor: 'pointer' }}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          {formData.follow_up_required === 'yes' && (
            <div>
              <label style={styles.label}>Follow-up Date</label>
              <input
                type="datetime-local"
                name="follow_up_date"
                value={formData.follow_up_date}
                onChange={handleChange}
                style={{ ...styles.input, cursor: 'pointer' }}
              />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={autoFill}
            style={{
              flex: 1,
              padding: '12px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.target.style.boxShadow = '0 4px 16px rgba(16,185,129,0.4)'; }}
            onMouseOut={(e) => { e.target.style.boxShadow = '0 2px 8px rgba(16,185,129,0.3)'; }}
          >
            ⚡ Auto Fill
          </button>
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              flex: 2,
              padding: '12px',
              background: status === 'loading' ? '#93c5fd' : 'linear-gradient(135deg, #1a73e8, #1557b0)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 2px 8px rgba(26,115,232,0.3)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { if (status !== 'loading') e.target.style.boxShadow = '0 4px 16px rgba(26,115,232,0.4)'; }}
            onMouseOut={(e) => { e.target.style.boxShadow = '0 2px 8px rgba(26,115,232,0.3)'; }}
          >
            {status === 'loading' ? '⏳ Logging...' : '💾 Log Interaction'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogInteractionForm;
