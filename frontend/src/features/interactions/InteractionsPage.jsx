import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInteractions, deleteInteraction } from './interactionSlice';

const InteractionsPage = () => {
  const dispatch = useDispatch();
  const { items: interactions, status } = useSelector(state => state.interactions);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchInteractions());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this interaction?')) {
      dispatch(deleteInteraction(id));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const typeConfig = {
    call: { color: '#10b981', bg: '#ecfdf5', icon: '📞' },
    meeting: { color: '#3b82f6', bg: '#eff6ff', icon: '🤝' },
    email: { color: '#8b5cf6', bg: '#f5f3ff', icon: '📧' },
    visit: { color: '#f59e0b', bg: '#fffbeb', icon: '🏥' },
    conference: { color: '#ec4899', bg: '#fdf2f8', icon: '🎤' }
  };

  const sentimentConfig = {
    positive: { color: '#059669', bg: '#ecfdf5' },
    neutral: { color: '#d97706', bg: '#fffbeb' },
    negative: { color: '#dc2626', bg: '#fef2f2' }
  };

  const filteredInteractions = filter === 'all' ? interactions :
    interactions.filter(i => i.interaction_type === filter);

  const typeCounts = interactions.reduce((acc, i) => {
    acc[i.interaction_type] = (acc[i.interaction_type] || 0) + 1;
    return acc;
  }, {});

  if (status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px', animation: 'pulse 1.5s infinite' }}>⏳</div>
        Loading interactions...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px',
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', boxShadow: '0 2px 8px rgba(139,92,246,0.3)'
          }}>📋</div>
          <div>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.5rem', fontWeight: 600, color: '#1a1a2e', margin: 0 }}>
              All Interactions
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#666', margin: 0 }}>
              {interactions.length} total records
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {['all', 'call', 'meeting', 'email', 'visit', 'conference'].map(type => (
          <button key={type} onClick={() => setFilter(type)} style={{
            padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 500,
            background: filter === type ? 'linear-gradient(135deg, #1a73e8, #1557b0)' : '#f3f4f6',
            color: filter === type ? 'white' : '#374151',
            transition: 'all 0.2s'
          }}>
            {type === 'all' ? '📋 All' : `${typeConfig[type]?.icon || ''} ${type.charAt(0).toUpperCase() + type.slice(1)}`}
            <span style={{
              marginLeft: '4px', padding: '1px 6px', borderRadius: '10px', fontSize: '0.7rem',
              backgroundColor: filter === type ? 'rgba(255,255,255,0.2)' : '#e5e7eb',
              color: filter === type ? 'white' : '#6b7280'
            }}>
              {type === 'all' ? interactions.length : (typeCounts[type] || 0)}
            </span>
          </button>
        ))}
      </div>

      {filteredInteractions.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '3rem', backgroundColor: 'white',
          borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e8eaed'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
          <p style={{ color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>No interactions found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredInteractions.map((interaction) => {
            const tc = typeConfig[interaction.interaction_type] || typeConfig.call;
            const sc = sentimentConfig[interaction.sentiment?.toLowerCase()] || null;
            
            return (
              <div key={interaction.id} style={{
                backgroundColor: 'white', padding: '16px 20px', borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.03)',
                border: '1px solid #e8eaed', borderLeft: `4px solid ${tc.color}`,
                transition: 'box-shadow 0.2s'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      backgroundColor: tc.bg, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '16px'
                    }}>{tc.icon}</div>
                    <div>
                      <h3 style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 600, color: '#1f2937' }}>
                        {interaction.hcp_name}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>
                        {interaction.hcp_specialty && `${interaction.hcp_specialty} `}
                        {interaction.hcp_specialty && interaction.hcp_organization && '• '}
                        {interaction.hcp_organization || ''}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '12px', fontSize: '0.7rem',
                      fontWeight: 500, backgroundColor: tc.bg, color: tc.color, textTransform: 'capitalize'
                    }}>{interaction.interaction_type}</span>
                    {sc && (
                      <span style={{
                        padding: '3px 10px', borderRadius: '12px', fontSize: '0.7rem',
                        fontWeight: 500, backgroundColor: sc.bg, color: sc.color, textTransform: 'capitalize'
                      }}>{interaction.sentiment}</span>
                    )}
                    <button onClick={() => handleDelete(interaction.id)} style={{
                      padding: '4px 8px', backgroundColor: '#fee2e2', color: '#dc2626',
                      border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem'
                    }}>🗑️</button>
                  </div>
                </div>

                <p style={{ margin: '0 0 8px 0', color: '#374151', fontSize: '0.875rem', lineHeight: '1.5' }}>
                  {interaction.notes}
                </p>

                {interaction.summary && (
                  <div style={{
                    padding: '8px 12px', backgroundColor: '#f9fafb', borderRadius: '8px',
                    marginBottom: '8px', border: '1px solid #f3f4f6'
                  }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>📋 Summary: </span>
                    <span style={{ fontSize: '0.8rem', color: '#374151' }}>{interaction.summary}</span>
                  </div>
                )}

                {interaction.key_topics && (
                  <div style={{ marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>🏷️ Topics: </span>
                    <span style={{ fontSize: '0.8rem', color: '#374151' }}>{interaction.key_topics}</span>
                  </div>
                )}

                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f3f4f6',
                  fontSize: '0.75rem', color: '#9ca3af'
                }}>
                  <span>📅 {formatDate(interaction.interaction_date)}</span>
                  {interaction.follow_up_required && (
                    <span style={{
                      padding: '2px 8px', backgroundColor: '#fffbeb', color: '#d97706',
                      borderRadius: '8px', fontWeight: 500
                    }}>⏰ Follow-up: {interaction.follow_up_date ? formatDate(interaction.follow_up_date) : 'Required'}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InteractionsPage;
