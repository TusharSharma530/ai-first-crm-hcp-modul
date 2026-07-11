import React from 'react';
import Badge from './Badge';

const AIInsightsModal = ({ interaction, isOpen, onClose }) => {
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header ai-header">
          <div className="modal-header-left">
            <div className="modal-icon ai-icon">🤖</div>
            <div>
              <h2 className="modal-title">AI Insights</h2>
              <p className="modal-subtitle">AI-powered analysis for {interaction.hcp_name}</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-body">
          {/* Sentiment Analysis */}
          <div className="insight-section">
            <h3 className="insight-title">📊 Sentiment Analysis</h3>
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
          <div className="insight-section">
            <h3 className="insight-title">🏷️ Extracted Entities</h3>
            <div className="entities-grid">
              <div className="entity-item">
                <span className="entity-label">Doctor</span>
                <span className="entity-value">{insights.keyEntities.doctor}</span>
              </div>
              <div className="entity-item">
                <span className="entity-label">Hospital</span>
                <span className="entity-value">{insights.keyEntities.hospital}</span>
              </div>
              <div className="entity-item">
                <span className="entity-label">Specialty</span>
                <span className="entity-value">{insights.keyEntities.specialty}</span>
              </div>
              <div className="entity-item">
                <span className="entity-label">Topics</span>
                <div className="entity-tags">
                  {insights.keyEntities.topics.map((topic, idx) => (
                    <span key={idx} className="entity-tag">{topic}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="insight-section">
            <h3 className="insight-title">📈 Engagement Metrics</h3>
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
          <div className="insight-section">
            <h3 className="insight-title">💡 AI Recommendations</h3>
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
          <div className="insight-section">
            <h3 className="insight-title">🎯 Next Best Actions</h3>
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

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsModal;
