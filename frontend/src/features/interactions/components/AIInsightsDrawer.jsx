import React, { useEffect, useRef } from 'react';
import Badge from './Badge';

const AIInsightsDrawer = ({ interaction, isOpen, onClose }) => {
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

  if (!isOpen || !interaction) return null;

  // Generate mock AI insights based on the interaction data
  const generateInsights = () => {
    const insights = {
      sentimentAnalysis: {
        score: interaction.sentiment === 'positive' ? 0.85 : 
               interaction.sentiment === 'negative' ? 0.25 : 0.5,
        label: interaction.sentiment || 'neutral',
        confidence: 0.92
      },
      keyEntities: {
        doctor: interaction.hcp_name || 'Unknown',
        hospital: interaction.hcp_organization || 'Not specified',
        specialty: interaction.hcp_specialty || 'Not specified',
        topics: interaction.key_topics ? interaction.key_topics.split(',').map(t => t.trim()) : ['General discussion']
      },
      engagementMetrics: {
        interactionQuality: interaction.sentiment === 'positive' ? 'High' : 
                           interaction.sentiment === 'negative' ? 'Low' : 'Medium',
        followUpPriority: interaction.follow_up_required === 'yes' ? 'High' : 'Normal',
        relationshipStrength: interaction.sentiment === 'positive' ? 'Strong' : 
                             interaction.sentiment === 'negative' ? 'Needs Attention' : 'Developing'
      },
      recommendations: [
        interaction.follow_up_required === 'yes' ? 
          `Schedule follow-up by ${new Date(interaction.follow_up_date || Date.now() + 7*24*60*60*1000).toLocaleDateString()}` :
          'Consider scheduling a follow-up to maintain engagement',
        interaction.sentiment === 'positive' ? 
          'Doctor shows strong interest - prioritize this relationship' :
          interaction.sentiment === 'negative' ? 
          'Address concerns raised and provide additional support' :
          'Build on this interaction to strengthen the relationship',
        'Share relevant clinical data and case studies',
        'Update CRM notes with latest interaction details'
      ],
      nextBestActions: [
        { action: 'Send thank you email', priority: 'medium', deadline: '2 days' },
        { action: 'Share clinical trial data', priority: 'high', deadline: '1 week' },
        { action: 'Schedule product demo', priority: 'low', deadline: '2 weeks' }
      ]
    };
    return insights;
  };

  const insights = generateInsights();

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
        aria-labelledby="ai-drawer-title"
        tabIndex={-1}
      >
        <div className="drawer-header" style={{ background: 'linear-gradient(135deg, #faf5ff, #ede9fe)' }}>
          <div className="drawer-header-left">
            <div className="drawer-icon" style={{ background: 'linear-gradient(135deg, #a855f7, #9333ea)' }}>🤖</div>
            <div>
              <h2 id="ai-drawer-title" className="drawer-title">AI Insights</h2>
              <p className="drawer-subtitle">AI-powered analysis for {interaction.hcp_name}</p>
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
          {/* Sentiment Analysis */}
          <div className="drawer-section">
            <h4 className="drawer-section-title">
              <span aria-hidden="true">📊</span> Sentiment Analysis
            </h4>
            <div className="insight-card">
              <div className="sentiment-gauge">
                <div className="gauge-bar">
                  <div 
                    className="gauge-fill" 
                    style={{ 
                      width: `${insights.sentimentAnalysis.score * 100}%`,
                      backgroundColor: insights.sentimentAnalysis.score > 0.6 ? '#10b981' : 
                                      insights.sentimentAnalysis.score < 0.4 ? '#ef4444' : '#f59e0b'
                    }} 
                  />
                </div>
                <div className="gauge-labels">
                  <span>Negative</span>
                  <span>Neutral</span>
                  <span>Positive</span>
                </div>
              </div>
              <div className="sentiment-details">
                <Badge type="sentiment" value={insights.sentimentAnalysis.label} />
                <span className="confidence">Confidence: {(insights.sentimentAnalysis.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Key Entities */}
          <div className="drawer-section">
            <h4 className="drawer-section-title">
              <span aria-hidden="true">🏷️</span> Extracted Entities
            </h4>
            <div className="drawer-detail-grid">
              <div className="drawer-detail-item">
                <span className="drawer-detail-label">Doctor</span>
                <span className="drawer-detail-value">{insights.keyEntities.doctor}</span>
              </div>
              <div className="drawer-detail-item">
                <span className="drawer-detail-label">Hospital</span>
                <span className="drawer-detail-value">{insights.keyEntities.hospital}</span>
              </div>
              <div className="drawer-detail-item">
                <span className="drawer-detail-label">Specialty</span>
                <span className="drawer-detail-value">{insights.keyEntities.specialty}</span>
              </div>
              <div className="drawer-detail-item">
                <span className="drawer-detail-label">Topics</span>
                <div className="drawer-tags">
                  {insights.keyEntities.topics.map((topic, idx) => (
                    <span key={idx} className="drawer-tag">{topic}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="drawer-section">
            <h4 className="drawer-section-title">
              <span aria-hidden="true">📈</span> Engagement Metrics
            </h4>
            <div className="metrics-grid">
              <div className="metric-card">
                <span className="metric-label">Interaction Quality</span>
                <span className={`metric-value ${insights.engagementMetrics.interactionQuality.toLowerCase()}`}>
                  {insights.engagementMetrics.interactionQuality}
                </span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Follow-up Priority</span>
                <span className={`metric-value ${insights.engagementMetrics.followUpPriority.toLowerCase()}`}>
                  {insights.engagementMetrics.followUpPriority}
                </span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Relationship Strength</span>
                <span className={`metric-value ${insights.engagementMetrics.relationshipStrength.toLowerCase().replace(' ', '-')}`}>
                  {insights.engagementMetrics.relationshipStrength}
                </span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="drawer-section">
            <h4 className="drawer-section-title">
              <span aria-hidden="true">💡</span> AI Recommendations
            </h4>
            <ul className="recommendations-list">
              {insights.recommendations.map((rec, idx) => (
                <li key={idx} className="recommendation-item">
                  <span className="recommendation-icon">✓</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Next Best Actions */}
          <div className="drawer-section">
            <h4 className="drawer-section-title">
              <span aria-hidden="true">🎯</span> Next Best Actions
            </h4>
            <div className="actions-list">
              {insights.nextBestActions.map((action, idx) => (
                <div key={idx} className="action-item">
                  <div className="action-info">
                    <span className="action-name">{action.action}</span>
                    <span className="action-deadline">Deadline: {action.deadline}</span>
                  </div>
                  <Badge type="priority" value={action.priority} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="drawer-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default AIInsightsDrawer;
