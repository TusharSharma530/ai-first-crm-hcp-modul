import React, { useState, useEffect } from 'react';

const EditModal = ({ interaction, isOpen, onClose, onSave }) => {
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-icon">✏️</div>
            <div>
              <h2 className="modal-title">Edit Interaction</h2>
              <p className="modal-subtitle">Update interaction details for {interaction.hcp_name}</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">HCP Name *</label>
              <input
                type="text"
                name="hcp_name"
                value={formData.hcp_name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="hcp_email"
                value={formData.hcp_email}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Specialty</label>
              <input
                type="text"
                name="hcp_specialty"
                value={formData.hcp_specialty}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Organization</label>
              <input
                type="text"
                name="hcp_organization"
                value={formData.hcp_organization}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Interaction Type *</label>
              <select
                name="interaction_type"
                value={formData.interaction_type}
                onChange={handleChange}
                className="form-select"
              >
                <option value="call">📞 Call</option>
                <option value="meeting">🤝 Meeting</option>
                <option value="email">📧 Email</option>
                <option value="visit">🏥 Visit</option>
                <option value="conference">🎤 Conference</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Sentiment</label>
              <select
                name="sentiment"
                value={formData.sentiment}
                onChange={handleChange}
                className="form-select"
              >
                <option value="positive">😊 Positive</option>
                <option value="neutral">😐 Neutral</option>
                <option value="negative">😞 Negative</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Interaction Date *</label>
            <input
              type="datetime-local"
              name="interaction_date"
              value={formData.interaction_date}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes *</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              required
              rows={4}
              className="form-textarea"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Follow-up Required</label>
              <select
                name="follow_up_required"
                value={formData.follow_up_required}
                onChange={handleChange}
                className="form-select"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            {formData.follow_up_required === 'yes' && (
              <div className="form-group">
                <label className="form-label">Follow-up Date</label>
                <input
                  type="datetime-local"
                  name="follow_up_date"
                  value={formData.follow_up_date}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            )}
          </div>
        </form>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? '⏳ Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
