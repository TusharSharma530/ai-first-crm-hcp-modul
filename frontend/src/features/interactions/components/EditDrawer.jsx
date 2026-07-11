import React, { useState, useEffect, useRef } from 'react';

const EditDrawer = ({ interaction, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    hcp_name: '',
    hcp_email: '',
    hcp_specialty: '',
    hcp_organization: '',
    interaction_type: 'call',
    interaction_date: '',
    notes: '',
    sentiment: 'neutral',
    follow_up_required: 'no',
    follow_up_date: ''
  });
  const [saving, setSaving] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (interaction) {
      setFormData({
        hcp_name: interaction.hcp_name || '',
        hcp_email: interaction.hcp_email || '',
        hcp_specialty: interaction.hcp_specialty || '',
        hcp_organization: interaction.hcp_organization || '',
        interaction_type: interaction.interaction_type || 'call',
        interaction_date: interaction.interaction_date ? 
          new Date(interaction.interaction_date).toISOString().slice(0, 16) : '',
        notes: interaction.notes || '',
        sentiment: interaction.sentiment || 'neutral',
        follow_up_required: interaction.follow_up_required || 'no',
        follow_up_date: interaction.follow_up_date ? 
          new Date(interaction.follow_up_date).toISOString().slice(0, 16) : ''
      });
    }
  }, [interaction]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      drawerRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const submitData = {
      ...formData,
      interaction_date: formData.interaction_date ? formData.interaction_date + ':00' : null,
      follow_up_date: formData.follow_up_date ? formData.follow_up_date + ':00' : null
    };
    
    await onSave(interaction.id, submitData);
    setSaving(false);
  };

  if (!isOpen || !interaction) return null;

  return (
    <>
      <div 
        className={`drawer-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        ref={drawerRef}
        className={`drawer ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-drawer-title"
        tabIndex={-1}
      >
        <div className="drawer-header">
          <div className="drawer-header-left">
            <div className="drawer-icon" style={{ background: '#fff7ed', border: '1.5px solid #fed7aa' }}>✏️</div>
            <div>
              <h2 id="edit-drawer-title" className="drawer-title">Edit Interaction</h2>
              <p className="drawer-subtitle">Update details for {interaction.hcp_name}</p>
            </div>
          </div>
          <button 
            className="drawer-close" 
            onClick={onClose}
            aria-label="Close drawer"
          >
            ✕
          </button>
        </div>

        <div className="drawer-body">
          <form onSubmit={handleSubmit}>
            {/* Doctor Info Section */}
            <div className="drawer-section">
              <h4 className="drawer-section-title">
                <span aria-hidden="true">👤</span> Doctor Information
              </h4>
              <div className="drawer-form-grid">
                <div className="drawer-form-group">
                  <label className="drawer-form-label">HCP Name *</label>
                  <input
                    type="text"
                    name="hcp_name"
                    value={formData.hcp_name}
                    onChange={handleChange}
                    required
                    className="drawer-form-input"
                  />
                </div>
                <div className="drawer-form-group">
                  <label className="drawer-form-label">Email</label>
                  <input
                    type="email"
                    name="hcp_email"
                    value={formData.hcp_email}
                    onChange={handleChange}
                    className="drawer-form-input"
                  />
                </div>
                <div className="drawer-form-group">
                  <label className="drawer-form-label">Specialty</label>
                  <input
                    type="text"
                    name="hcp_specialty"
                    value={formData.hcp_specialty}
                    onChange={handleChange}
                    className="drawer-form-input"
                  />
                </div>
                <div className="drawer-form-group">
                  <label className="drawer-form-label">Organization</label>
                  <input
                    type="text"
                    name="hcp_organization"
                    value={formData.hcp_organization}
                    onChange={handleChange}
                    className="drawer-form-input"
                  />
                </div>
              </div>
            </div>

            {/* Interaction Details Section */}
            <div className="drawer-section">
              <h4 className="drawer-section-title">
                <span aria-hidden="true">📋</span> Interaction Details
              </h4>
              <div className="drawer-form-grid">
                <div className="drawer-form-group">
                  <label className="drawer-form-label">Type *</label>
                  <select
                    name="interaction_type"
                    value={formData.interaction_type}
                    onChange={handleChange}
                    className="drawer-form-select"
                  >
                    <option value="call">📞 Call</option>
                    <option value="meeting">🤝 Meeting</option>
                    <option value="email">📧 Email</option>
                    <option value="visit">🏥 Visit</option>
                    <option value="conference">🎤 Conference</option>
                  </select>
                </div>
                <div className="drawer-form-group">
                  <label className="drawer-form-label">Sentiment</label>
                  <select
                    name="sentiment"
                    value={formData.sentiment}
                    onChange={handleChange}
                    className="drawer-form-select"
                  >
                    <option value="positive">😊 Positive</option>
                    <option value="neutral">😐 Neutral</option>
                    <option value="negative">😞 Negative</option>
                  </select>
                </div>
                <div className="drawer-form-group full-width">
                  <label className="drawer-form-label">Date & Time *</label>
                  <input
                    type="datetime-local"
                    name="interaction_date"
                    value={formData.interaction_date}
                    onChange={handleChange}
                    required
                    className="drawer-form-input"
                  />
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="drawer-section">
              <h4 className="drawer-section-title">
                <span aria-hidden="true">📝</span> Notes
              </h4>
              <div className="drawer-form-group">
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="drawer-form-textarea"
                  placeholder="Enter interaction notes..."
                />
              </div>
            </div>

            {/* Follow-up Section */}
            <div className="drawer-section">
              <h4 className="drawer-section-title">
                <span aria-hidden="true">⏰</span> Follow-up
              </h4>
              <div className="drawer-form-grid">
                <div className="drawer-form-group">
                  <label className="drawer-form-label">Follow-up Required</label>
                  <select
                    name="follow_up_required"
                    value={formData.follow_up_required}
                    onChange={handleChange}
                    className="drawer-form-select"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                {formData.follow_up_required === 'yes' && (
                  <div className="drawer-form-group">
                    <label className="drawer-form-label">Follow-up Date</label>
                    <input
                      type="datetime-local"
                      name="follow_up_date"
                      value={formData.follow_up_date}
                      onChange={handleChange}
                      className="drawer-form-input"
                    />
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="drawer-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary premium-save-btn"
            onClick={handleSubmit}
            disabled={saving}
            aria-label={saving ? 'Saving changes...' : 'Save changes'}
          >
            {saving ? (
              <>
                <span className="premium-save-spinner"></span>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default EditDrawer;
