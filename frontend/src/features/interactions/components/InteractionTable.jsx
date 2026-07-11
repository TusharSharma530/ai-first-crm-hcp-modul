import React, { useState, useMemo } from 'react';
import Badge from './Badge';

const InteractionTable = ({ 
  interactions, 
  onView, 
  onEdit, 
  onDelete, 
  onAIInsights,
  currentPage,
  itemsPerPage,
  onPageChange,
  sortConfig,
  onSort
}) => {
  const [selectedRows, setSelectedRows] = useState(new Set());

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return 'No summary available';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(new Set(interactions.map(i => i.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSort = (key) => {
    onSort(key);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Pagination
  const totalPages = Math.ceil(interactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInteractions = interactions.slice(startIndex, endIndex);

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          className={`page-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => onPageChange(i)}
          aria-label={`Page ${i}`}
          aria-current={currentPage === i ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="table-container animate-slideUp">
      <div className="table-header">
        <div className="table-header-left">
          <h3 className="table-title">Interactions</h3>
          <span className="table-count">
            {interactions.length} record{interactions.length !== 1 ? 's' : ''}
            {selectedRows.size > 0 && ` • ${selectedRows.size} selected`}
          </span>
        </div>
        <div className="table-header-right">
          <div className="view-toggle" role="group" aria-label="View options">
            <button 
              className="view-toggle-btn active"
              aria-label="Table view"
              aria-pressed="true"
            >
              ☰
            </button>
            <button 
              className="view-toggle-btn"
              aria-label="Grid view"
              aria-pressed="false"
            >
              ⊞
            </button>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table" role="grid">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  checked={selectedRows.size === currentInteractions.length && currentInteractions.length > 0}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </th>
              <th onClick={() => handleSort('hcp_name')}>
                Doctor {getSortIcon('hcp_name')}
              </th>
              <th onClick={() => handleSort('hcp_organization')}>
                Hospital {getSortIcon('hcp_organization')}
              </th>
              <th onClick={() => handleSort('hcp_specialty')}>
                Specialty {getSortIcon('hcp_specialty')}
              </th>
              <th onClick={() => handleSort('interaction_type')}>
                Type {getSortIcon('interaction_type')}
              </th>
              <th onClick={() => handleSort('interaction_date')}>
                Date {getSortIcon('interaction_date')}
              </th>
              <th onClick={() => handleSort('follow_up_required')}>
                Follow-up {getSortIcon('follow_up_required')}
              </th>
              <th onClick={() => handleSort('sentiment')}>
                Sentiment {getSortIcon('sentiment')}
              </th>
              <th>AI Summary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentInteractions.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '40px' }}>
                  No interactions found
                </td>
              </tr>
            ) : (
              currentInteractions.map((interaction) => (
                <tr 
                  key={interaction.id}
                  className={selectedRows.has(interaction.id) ? 'selected' : ''}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.has(interaction.id)}
                      onChange={() => handleSelectRow(interaction.id)}
                      aria-label={`Select ${interaction.hcp_name}`}
                    />
                  </td>
                  <td>
                    <div className="cell-doctor">
                      <div className="doctor-avatar">
                        {getInitials(interaction.hcp_name)}
                      </div>
                      <div className="doctor-info">
                        <p className="doctor-name">{interaction.hcp_name || 'Unknown'}</p>
                        <p className="doctor-email">{interaction.hcp_email || 'No email'}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="cell-hospital">
                      <div className="hospital-icon" aria-hidden="true">🏥</div>
                      <span className="hospital-name">{interaction.hcp_organization || 'N/A'}</span>
                    </div>
                  </td>
                  <td>{interaction.hcp_specialty || 'N/A'}</td>
                  <td>
                    <Badge type="interaction" value={interaction.interaction_type} />
                  </td>
                  <td>{formatDate(interaction.interaction_date)}</td>
                  <td>
                    <Badge type="followup" value={interaction.follow_up_required} />
                  </td>
                  <td>
                    <Badge type="sentiment" value={interaction.sentiment || 'neutral'} />
                  </td>
                  <td>
                    <div className="summary-preview">
                      <div className="summary-truncated">
                        {truncateText(interaction.summary, 80)}
                      </div>
                      {interaction.summary && interaction.summary.length > 80 && (
                        <span 
                          className="summary-view-more"
                          onClick={() => onView(interaction)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && onView(interaction)}
                        >
                          View More
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn view"
                        onClick={() => onView(interaction)}
                        data-tooltip="View Details"
                        aria-label={`View details for ${interaction.hcp_name}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                      <button
                        className="action-btn edit"
                        onClick={() => onEdit(interaction)}
                        data-tooltip="Edit"
                        aria-label={`Edit interaction with ${interaction.hcp_name}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete this interaction with ${interaction.hcp_name}?`)) {
                            onDelete(interaction.id);
                          }
                        }}
                        data-tooltip="Delete"
                        aria-label={`Delete interaction with ${interaction.hcp_name}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                      </button>
                      <button
                        className="action-btn ai"
                        onClick={() => onAIInsights(interaction)}
                        data-tooltip="AI Insights"
                        aria-label={`View AI insights for ${interaction.hcp_name}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/>
                          <path d="M16 14h.01"/>
                          <path d="M8 14h.01"/>
                          <path d="M12 17v4"/>
                          <path d="M8 21h8"/>
                          <circle cx="12" cy="6" r="1" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {interactions.length > 0 && (
        <div className="table-pagination">
          <div className="pagination-info">
            Showing {startIndex + 1} to {Math.min(endIndex, interactions.length)} of {interactions.length} entries
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              ← Prev
            </button>
            <div className="pagination-pages">
              {renderPageNumbers()}
            </div>
            <button
              className="pagination-btn"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(InteractionTable);
