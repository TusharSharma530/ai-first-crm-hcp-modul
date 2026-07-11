import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInteractions, deleteInteraction } from './interactionSlice';
import '../../styles/interactions.css';

const InteractionsPage = () => {
  const dispatch = useDispatch();
  const { items: interactions, status } = useSelector(state => state.interactions);
  const [filter, setFilter] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('list');

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
    call: { icon: '📞', label: 'Call' },
    meeting: { icon: '🤝', label: 'Meeting' },
    email: { icon: '📧', label: 'Email' },
    visit: { icon: '🏥', label: 'Visit' },
    conference: { icon: '🎤', label: 'Conference' }
  };

  const sentimentConfig = {
    positive: { icon: '😊', label: 'Positive', activeClass: 'active-green' },
    neutral: { icon: '😐', label: 'Neutral', activeClass: 'active-yellow' },
    negative: { icon: '😞', label: 'Negative', activeClass: 'active-red' }
  };

  const typeCounts = useMemo(() => {
    return interactions.reduce((acc, i) => {
      acc[i.interaction_type] = (acc[i.interaction_type] || 0) + 1;
      return acc;
    }, {});
  }, [interactions]);

  const sentimentCounts = useMemo(() => {
    return interactions.reduce((acc, i) => {
      const s = i.sentiment?.toLowerCase() || 'neutral';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});
  }, [interactions]);

  const filteredInteractions = useMemo(() => {
    let result = interactions;

    if (filter !== 'all') {
      result = result.filter(i => i.interaction_type === filter);
    }

    if (sentimentFilter !== 'all') {
      result = result.filter(i => (i.sentiment?.toLowerCase() || 'neutral') === sentimentFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i =>
        i.hcp_name?.toLowerCase().includes(q) ||
        i.notes?.toLowerCase().includes(q) ||
        i.key_topics?.toLowerCase().includes(q) ||
        i.hcp_specialty?.toLowerCase().includes(q) ||
        i.hcp_organization?.toLowerCase().includes(q) ||
        i.summary?.toLowerCase().includes(q)
      );
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.interaction_date) - new Date(a.interaction_date);
        case 'oldest':
          return new Date(a.interaction_date) - new Date(b.interaction_date);
        case 'name-asc':
          return (a.hcp_name || '').localeCompare(b.hcp_name || '');
        case 'name-desc':
          return (b.hcp_name || '').localeCompare(a.hcp_name || '');
        default:
          return 0;
      }
    });

    return result;
  }, [interactions, filter, sentimentFilter, searchQuery, sortBy]);

  const exportCSV = () => {
    const headers = ['HCP Name', 'Specialty', 'Organization', 'Type', 'Sentiment', 'Notes', 'Summary', 'Topics', 'Date', 'Follow-up'];
    const rows = filteredInteractions.map(i => [
      i.hcp_name, i.hcp_specialty, i.hcp_organization, i.interaction_type,
      i.sentiment, `"${(i.notes || '').replace(/"/g, '""')}"`,
      `"${(i.summary || '').replace(/"/g, '""')}"`, i.key_topics,
      formatDate(i.interaction_date), i.follow_up_required ? formatDate(i.follow_up_date) : ''
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interactions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTypePillClass = (type) => {
    const colorMap = {
      call: 'active-green',
      meeting: 'active-blue',
      email: 'active-purple',
      visit: 'active-yellow',
      conference: 'active-red'
    };
    return colorMap[type] || 'active-blue';
  };

  if (status === 'loading') {
    return (
      <div className="loading-state">
        <div className="loading-icon">⏳</div>
        <p className="loading-text">Loading interactions...</p>
      </div>
    );
  }

  return (
    <div className="interactions-page">
      {/* Header */}
      <div className="interactions-header">
        <div className="header-brand">
          <div className="header-icon">📋</div>
          <div>
            <h2 className="header-title">All Interactions</h2>
            <p className="header-count">{filteredInteractions.length} of {interactions.length} records</p>
          </div>
        </div>
        <button className="export-btn" onClick={exportCSV}>
          📥 Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-label">📊 Total</div>
          <div className="stat-value">{interactions.length}</div>
        </div>

        {Object.entries(typeConfig).map(([type, config]) => (
          <div
            key={type}
            className={`stat-card type-${type} ${filter === type ? 'active' : ''}`}
            onClick={() => setFilter(filter === type ? 'all' : type)}
          >
            <div className="stat-label">
              <span className="stat-icon">{config.icon}</span>
              {config.label}
            </div>
            <div className="stat-value">{typeCounts[type] || 0}</div>
          </div>
        ))}
      </div>

      {/* Search & Controls */}
      <div className="controls-row">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name, notes, topics, specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="newest">📅 Newest First</option>
          <option value="oldest">📅 Oldest First</option>
          <option value="name-asc">🔤 Name A-Z</option>
          <option value="name-desc">🔤 Name Z-A</option>
        </select>

        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >☰</button>
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >⊞</button>
        </div>
      </div>

      {/* Sentiment Filter */}
      <div className="filter-row">
        <button
          className={`filter-pill ${sentimentFilter === 'all' ? 'active active-purple' : ''}`}
          onClick={() => setSentimentFilter('all')}
        >
          <span className="filter-icon">🔄</span>
          <span>All</span>
          <span className="filter-count">{interactions.length}</span>
        </button>
        {Object.entries(sentimentConfig).map(([sent, config]) => (
          <button
            key={sent}
            className={`filter-pill ${sentimentFilter === sent ? `active ${config.activeClass}` : ''}`}
            onClick={() => setSentimentFilter(sent)}
          >
            <span className="filter-icon">{config.icon}</span>
            <span>{config.label}</span>
            <span className="filter-count">{sentimentCounts[sent] || 0}</span>
          </button>
        ))}
      </div>

      {/* Type Filter */}
      <div className="filter-row">
        <button
          className={`filter-pill ${filter === 'all' ? 'active active-blue' : ''}`}
          onClick={() => setFilter('all')}
        >
          <span className="filter-icon">📋</span>
          <span>All</span>
          <span className="filter-count">{interactions.length}</span>
        </button>
        {['call', 'meeting', 'email', 'visit', 'conference'].map(type => (
          <button
            key={type}
            className={`filter-pill ${filter === type ? `active ${getTypePillClass(type)}` : ''}`}
            onClick={() => setFilter(type)}
          >
            <span className="filter-icon">{typeConfig[type].icon}</span>
            <span>{typeConfig[type].label}</span>
            <span className="filter-count">{typeCounts[type] || 0}</span>
          </button>
        ))}
      </div>

      {/* Results */}
      {filteredInteractions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{searchQuery ? '🔍' : '📭'}</div>
          <p className="empty-text">
            {searchQuery ? 'No results match your search' : 'No interactions found'}
          </p>
          {searchQuery && (
            <button className="empty-btn" onClick={() => setSearchQuery('')}>
              Clear Search
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid-view">
          {filteredInteractions.map((interaction) => (
            <div
              key={interaction.id}
              className="interaction-card-grid"
              data-type={interaction.interaction_type}
            >
              <div className="card-header">
                <div className="card-user">
                  <div className="avatar">{typeConfig[interaction.interaction_type]?.icon || '📞'}</div>
                  <div className="card-user-info">
                    <h3>{interaction.hcp_name}</h3>
                    <p className="card-user-meta">
                      {interaction.hcp_specialty || 'N/A'}
                      {interaction.hcp_organization && ` • ${interaction.hcp_organization}`}
                    </p>
                  </div>
                </div>
                <button className="delete-btn" onClick={() => handleDelete(interaction.id)}>🗑️</button>
              </div>
              <div className="card-badges">
                <span className="badge badge-type" data-type={interaction.interaction_type}>
                  {typeConfig[interaction.interaction_type]?.icon} {interaction.interaction_type}
                </span>
                {interaction.sentiment && (
                  <span className="badge badge-sentiment" data-sentiment={interaction.sentiment.toLowerCase()}>
                    {sentimentConfig[interaction.sentiment.toLowerCase()]?.icon} {interaction.sentiment}
                  </span>
                )}
              </div>
              <p className="card-notes-grid">
                {interaction.notes?.length > 140 ? interaction.notes.slice(0, 140) + '...' : interaction.notes}
              </p>
              {interaction.summary && (
                <div className="card-summary">
                  <span className="summary-label">📋 Summary: </span>
                  <span className="summary-text">
                    {interaction.summary.length > 120 ? interaction.summary.slice(0, 120) + '...' : interaction.summary}
                  </span>
                </div>
              )}
              {interaction.key_topics && (
                <div className="card-topics">
                  <span className="topics-label">🏷️ Topics: </span>
                  <span className="topics-text">{interaction.key_topics}</span>
                </div>
              )}
              <div className="card-footer">
                <span className="card-date">📅 {formatDate(interaction.interaction_date)}</span>
                {interaction.follow_up_required && (
                  <span className="badge badge-followup">⏰ Follow-up</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="list-view">
          {filteredInteractions.map((interaction) => (
            <div
              key={interaction.id}
              className="interaction-card-list"
              data-type={interaction.interaction_type}
            >
              <div className="card-header-list">
                <div className="card-user">
                  <div className="avatar">{typeConfig[interaction.interaction_type]?.icon || '📞'}</div>
                  <div className="card-user-info">
                    <div className="card-badges-inline">
                      <h3>{interaction.hcp_name}</h3>
                      <span className="badge badge-type" data-type={interaction.interaction_type}>
                        {typeConfig[interaction.interaction_type]?.icon} {interaction.interaction_type}
                      </span>
                      {interaction.sentiment && (
                        <span className="badge badge-sentiment" data-sentiment={interaction.sentiment.toLowerCase()}>
                          {sentimentConfig[interaction.sentiment.toLowerCase()]?.icon} {interaction.sentiment}
                        </span>
                      )}
                      {interaction.follow_up_required && (
                        <span className="badge badge-followup">⏰ Follow-up</span>
                      )}
                    </div>
                    <p className="card-user-meta-list">
                      <span>{interaction.hcp_specialty || 'N/A'}</span>
                      {interaction.hcp_organization && (
                        <>
                          <span className="card-meta-divider">•</span>
                          <span>{interaction.hcp_organization}</span>
                        </>
                      )}
                      <span className="card-meta-divider">|</span>
                      <span>📅 {formatDate(interaction.interaction_date)}</span>
                    </p>
                  </div>
                </div>
                <button className="delete-btn" onClick={() => handleDelete(interaction.id)}>🗑️</button>
              </div>

              <p className="card-notes-list">{interaction.notes}</p>

              {interaction.summary && (
                <div className="card-summary-list">
                  <span className="summary-label">📋 Summary: </span>
                  <span className="summary-text">{interaction.summary}</span>
                </div>
              )}

              {interaction.key_topics && (
                <div className="card-topics-list">
                  <span className="topics-label">🏷️ Topics: </span>
                  <span className="topics-text">{interaction.key_topics}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InteractionsPage;
