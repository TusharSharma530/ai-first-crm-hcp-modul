import React, { useEffect, useRef } from 'react';
import Badge from './Badge';

const SideDrawer = ({ interaction, isOpen, onClose }) => {
  const drawerRef = useRef(null);

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

  if (!interaction) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

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
        aria-labelledby="drawer-title"
        tabIndex={-1}
      >
        <div className="drawer-header">
          <div className="drawer-header-left">
            <div className="drawer-icon" aria-hidden="true">📋</div>
            <div>
              <h2 id="drawer-title" className="drawer-title">Interaction Details</h2>
              <p className="drawer-subtitle">View complete interaction information</p>
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
          {/* Doctor Profile */}
          <div className="drawer-section">
            <div className="drawer-profile">
              <div className="drawer-profile-avatar">
                {getInitials(interaction.hcp_name)}
              </div>
              <div className="drawer-profile-info">
                <h3>{interaction.hcp_name || 'Unknown Doctor'}</h3>
                <p>{interaction.hcp_email || 'No email provided'}</p>
              </div>
            </div>
          </div>

          {/* Basic Details */}
          <div className="drawer-section">
            <h4 className="drawer-section-title">Basic Information</h4>
            <div className="drawer-detail-grid">
              <div className="drawer-detail-item">
                <span className="drawer-detail-label">Hospital</span>
                <span className="drawer-detail-value">
                  {interaction.hcp_organization || 'N/A'}
                </span>
              </div>
              <div className="drawer-detail-item">
                <span className="drawer-detail-label">Specialty</span>
                <span className="drawer-detail-value">
                  {interaction.hcp_specialty || 'N/A'}
                </span>
              </div>
              <div className="drawer-detail-item">
                <span className="drawer-detail-label">Interaction Type</span>
                <Badge type="interaction" value={interaction.interaction_type} />
              </div>
              <div className="drawer-detail-item">
                <span className="drawer-detail-label">Date & Time</span>
                <span className="drawer-detail-value">
                  {formatDate(interaction.interaction_date)}
                </span>
              </div>
              <div className="drawer-detail-item">
                <span className="drawer-detail-label">Sentiment</span>
                <Badge type="sentiment" value={interaction.sentiment || 'neutral'} />
              </div>
              <div className="drawer-detail-item">
                <span className="drawer-detail-label">Follow-up</span>
                <Badge type="followup" value={interaction.follow_up_required} />
              </div>
            </div>
          </div>

          {/* AI Summary */}
          {interaction.summary && (
            <div className="drawer-section">
              <h4 className="drawer-section-title">
                <span aria-hidden="true">🤖</span> AI Summary
              </h4>
              <div className="drawer-summary-box">
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.6', color: '#374151' }}>
                  {interaction.summary}
                </p>
              </div>
            </div>
          )}

          {/* Key Topics */}
          {interaction.key_topics && (
            <div className="drawer-section">
              <h4 className="drawer-section-title">
                <span aria-hidden="true">🏷️</span> Key Topics
              </h4>
              <div className="drawer-tags">
                {interaction.key_topics.split(',').map((topic, index) => (
                  <span key={index} className="drawer-tag">
                    {topic.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="drawer-section">
            <h4 className="drawer-section-title">
              <span aria-hidden="true">📝</span> Interaction Notes
            </h4>
            <div className="drawer-notes-box">
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.7', color: '#374151', whiteSpace: 'pre-wrap' }}>
                {interaction.notes || 'No notes available'}
              </p>
            </div>
          </div>

          {/* Follow-up Information */}
          {interaction.follow_up_required === 'yes' && interaction.follow_up_date && (
            <div className="drawer-section">
              <h4 className="drawer-section-title">
                <span aria-hidden="true">⏰</span> Follow-up Details
              </h4>
              <div className="drawer-detail-grid">
                <div className="drawer-detail-item">
                  <span className="drawer-detail-label">Follow-up Date</span>
                  <span className="drawer-detail-value">
                    {formatDate(interaction.follow_up_date)}
                  </span>
                </div>
                <div className="drawer-detail-item">
                  <span className="drawer-detail-label">Status</span>
                  <Badge type="followup" value="yes" />
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="drawer-section">
            <h4 className="drawer-section-title">
              <span aria-hidden="true">ℹ️</span> Metadata
            </h4>
            <div className="drawer-detail-grid">
              <div className="drawer-detail-item">
                <span className="drawer-detail-label">Record ID</span>
                <span className="drawer-detail-value" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {interaction.id}
                </span>
              </div>
              <div className="drawer-detail-item">
                <span className="drawer-detail-label">Created</span>
                <span className="drawer-detail-value">
                  {formatDate(interaction.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="drawer-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default React.memo(SideDrawer);
