import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createInteraction, fetchInteractions } from './interactionSlice';

const LogInteractionForm = () => {
  const dispatch = useDispatch();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState('');
  const [tempTime, setTempTime] = useState('');
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

  const openDatePicker = () => {
    const current = formData.interaction_date || new Date().toISOString().slice(0, 16);
    setTempDate(current.split('T')[0]);
    setTempTime(current.split('T')[1] || '12:00');
    setShowDatePicker(true);
  };

  const handleDateSet = () => {
    setFormData({ ...formData, interaction_date: `${tempDate}T${tempTime}` });
    setShowDatePicker(false);
  };

  const handleDateCancel = () => {
    setShowDatePicker(false);
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

  return (
    <div className="crm-card">
      <div className="crm-card-header">
        <div className="crm-card-header-left">
          <div className="crm-card-header-icon blue">📝</div>
          <div>
            <h2 className="crm-card-title">Log HCP Interaction</h2>
            <p className="crm-card-subtitle">Record your healthcare professional engagement</p>
          </div>
        </div>
      </div>

      <div className="crm-card-body">
        {status === 'success' && (
          <div className="crm-alert crm-alert-success">
            <span>✅</span> Interaction logged successfully!
          </div>
        )}
        
        {status === 'error' && (
          <div className="crm-alert crm-alert-error">
            <span>❌</span> Error logging interaction. Please try again.
          </div>
        )}

        <form onSubmit={handleSubmit} className="crm-form">
          <div className="crm-field">
            <label className="crm-label">HCP Name <span className="required">*</span></label>
            <input
              type="text"
              name="hcp_name"
              value={formData.hcp_name}
              onChange={handleChange}
              required
              className="crm-input"
              placeholder="e.g. Dr. Rajesh Sharma"
            />
          </div>

          <div className="crm-form-row">
            <div className="crm-field">
              <label className="crm-label">Email</label>
              <input
                type="email"
                name="hcp_email"
                value={formData.hcp_email}
                onChange={handleChange}
                className="crm-input"
                placeholder="doctor@hospital.com"
              />
            </div>
            <div className="crm-field">
              <label className="crm-label">Specialty</label>
              <input
                type="text"
                name="hcp_specialty"
                value={formData.hcp_specialty}
                onChange={handleChange}
                className="crm-input"
                placeholder="e.g. Cardiology"
              />
            </div>
          </div>

          <div className="crm-field">
            <label className="crm-label">Organization</label>
            <input
              type="text"
              name="hcp_organization"
              value={formData.hcp_organization}
              onChange={handleChange}
              className="crm-input"
              placeholder="e.g. AIIMS Delhi"
            />
          </div>

          <div className="crm-form-row">
            <div className="crm-field">
              <label className="crm-label">Interaction Type <span className="required">*</span></label>
              <select
                name="interaction_type"
                value={formData.interaction_type}
                onChange={handleChange}
                className="crm-select"
              >
                <option value="call">📞 Call</option>
                <option value="meeting">🤝 Meeting</option>
                <option value="email">📧 Email</option>
                <option value="visit">🏥 Visit</option>
                <option value="conference">🎤 Conference</option>
              </select>
            </div>
            <div className="crm-field">
              <label className="crm-label">Date <span className="required">*</span></label>
              <input
                type="text"
                value={formData.interaction_date ? formData.interaction_date.replace('T', ' ') : ''}
                readOnly
                onClick={openDatePicker}
                required
                className="crm-input"
                placeholder="Click to select date & time"
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>

          <div className="crm-field">
            <div className="crm-notes-wrapper">
              <label className="crm-label">Notes <span className="required">*</span></label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                required
                rows={4}
                className="crm-textarea"
                placeholder="Describe the interaction details, topics discussed, outcomes..."
                style={{ marginTop: '6px' }}
              />
              <button
                type="button"
                onClick={() => {
                  const name = formData.hcp_name || 'the doctor';
                  const org = formData.hcp_organization || 'their hospital';
                  const type = formData.interaction_type;
                  const typeNames = { call: 'call', meeting: 'meeting', email: 'email exchange', visit: 'visit', conference: 'conference' };
                  const typeName = typeNames[type] || 'interaction';
                  const generated = `Had a ${typeName} with ${name} from ${org}. Discussed current treatment protocols and patient outcomes. ${formData.follow_up_required === 'yes' ? 'Follow-up scheduled to review progress.' : 'Will continue to monitor and follow up as needed.'}`;
                  setFormData({ ...formData, notes: generated });
                }}
                title="Generate notes with AI"
                className="crm-ai-btn"
              >
                ✨
              </button>
            </div>
          </div>

          <div className="crm-form-row">
            <div className="crm-field">
              <label className="crm-label">Follow-up Required</label>
              <select
                name="follow_up_required"
                value={formData.follow_up_required}
                onChange={handleChange}
                className="crm-select"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            {formData.follow_up_required === 'yes' && (
              <div className="crm-field">
                <label className="crm-label">Follow-up Date</label>
                <input
                  type="datetime-local"
                  name="follow_up_date"
                  value={formData.follow_up_date}
                  onChange={handleChange}
                  className="crm-input"
                />
              </div>
            )}
          </div>

          <div className="crm-btn-row">
            <button type="button" onClick={autoFill} className="crm-btn crm-btn-success">
              ⚡ Auto Fill
            </button>
            <button type="submit" disabled={status === 'loading'} className="crm-btn crm-btn-primary">
              {status === 'loading' ? '⏳ Logging...' : '💾 Log Interaction'}
            </button>
          </div>
        </form>
      </div>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '24px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)', minWidth: '320px'
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem', fontWeight: 600, color: '#111827', fontFamily: 'Inter, sans-serif' }}>
              📅 Select Date & Time
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Date</label>
              <input
                type="date"
                value={tempDate}
                onChange={(e) => setTempDate(e.target.value)}
                style={{
                  width: '100%', padding: '10px', border: '1px solid #d1d5db',
                  borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Time</label>
              <input
                type="time"
                value={tempTime}
                onChange={(e) => setTempTime(e.target.value)}
                style={{
                  width: '100%', padding: '10px', border: '1px solid #d1d5db',
                  borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={handleDateCancel}
                style={{
                  flex: 1, padding: '10px', backgroundColor: '#f3f4f6', color: '#374151',
                  border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer',
                  fontWeight: 500, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDateSet}
                style={{
                  flex: 1, padding: '10px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer',
                  fontWeight: 500, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem'
                }}
              >
                ✓ Set
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogInteractionForm;
