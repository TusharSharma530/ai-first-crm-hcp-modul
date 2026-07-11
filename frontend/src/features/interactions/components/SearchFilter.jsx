import React, { useState } from 'react';

const SearchFilter = ({ 
  searchQuery, 
  onSearchChange, 
  filters, 
  onFilterChange, 
  onResetFilters,
  onApplyFilters 
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = Object.values(filters).filter(v => v && v !== 'all').length;

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="search-filter-container animate-fadeIn">
      <div className="search-bar">
        <div className="search-input-wrapper">
          <span className="search-input-icon" aria-hidden="true">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by doctor name, hospital, specialty, notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search interactions"
          />
        </div>
        <button
          className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
          aria-controls="filter-panel"
        >
          <span aria-hidden="true">⚙️</span>
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="filter-count-badge">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="filter-panel" id="filter-panel" role="region" aria-label="Filter options">
          <div className="filter-group">
            <label className="filter-label" htmlFor="filter-type">Interaction Type</label>
            <select
              id="filter-type"
              className="filter-select"
              value={filters.type || 'all'}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="call">📞 Call</option>
              <option value="meeting">🤝 Meeting</option>
              <option value="email">📧 Email</option>
              <option value="visit">🏥 Visit</option>
              <option value="conference">🎤 Conference</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label" htmlFor="filter-sentiment">Sentiment</label>
            <select
              id="filter-sentiment"
              className="filter-select"
              value={filters.sentiment || 'all'}
              onChange={(e) => handleFilterChange('sentiment', e.target.value)}
            >
              <option value="all">All Sentiments</option>
              <option value="positive">😊 Positive</option>
              <option value="neutral">😐 Neutral</option>
              <option value="negative">😞 Negative</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label" htmlFor="filter-followup">Follow-up Status</label>
            <select
              id="filter-followup"
              className="filter-select"
              value={filters.followUp || 'all'}
              onChange={(e) => handleFilterChange('followUp', e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="yes">⏰ Pending</option>
              <option value="no">✅ Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label" htmlFor="filter-date">Date Range</label>
            <input
              id="filter-date"
              type="date"
              className="filter-input"
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label" htmlFor="filter-specialty">Specialty</label>
            <select
              id="filter-specialty"
              className="filter-select"
              value={filters.specialty || 'all'}
              onChange={(e) => handleFilterChange('specialty', e.target.value)}
            >
              <option value="all">All Specialties</option>
              <option value="cardiology">Cardiology</option>
              <option value="neurology">Neurology</option>
              <option value="oncology">Oncology</option>
              <option value="pediatrics">Pediatrics</option>
              <option value="orthopedics">Orthopedics</option>
              <option value="dermatology">Dermatology</option>
              <option value="psychiatry">Psychiatry</option>
              <option value="radiology">Radiology</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label" htmlFor="filter-priority">Priority</label>
            <select
              id="filter-priority"
              className="filter-select"
              value={filters.priority || 'all'}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label" htmlFor="filter-ai">AI Summary</label>
            <select
              id="filter-ai"
              className="filter-select"
              value={filters.aiSummary || 'all'}
              onChange={(e) => handleFilterChange('aiSummary', e.target.value)}
            >
              <option value="all">All</option>
              <option value="yes">🤖 AI Generated</option>
              <option value="no">📝 Manual</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label" htmlFor="filter-search">Doctor Name</label>
            <input
              id="filter-search"
              type="text"
              className="filter-input"
              placeholder="Search doctor..."
              value={filters.doctorName || ''}
              onChange={(e) => handleFilterChange('doctorName', e.target.value)}
            />
          </div>

          <div className="filter-actions">
            <button className="btn-search" onClick={onApplyFilters}>
              🔍 Apply Filters
            </button>
            <button className="btn-reset" onClick={onResetFilters}>
              ↺ Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(SearchFilter);
