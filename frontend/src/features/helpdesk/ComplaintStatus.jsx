import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateComplaintStatusAsync, fetchComplaints } from './complaintsSlice';
import '../../styles/complaint-status.css';

const ComplaintStatus = () => {
  const dispatch = useDispatch();
  const { items: complaintsData, loading } = useSelector(state => state.complaints);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);

  const statusConfig = {
    'resolved': { color: '#10b981', bg: '#ecfdf5', icon: '✅', label: 'Resolved' },
    'pending': { color: '#f59e0b', bg: '#fffbeb', icon: '⏳', label: 'Pending' },
    'in-progress': { color: '#3b82f6', bg: '#eff6ff', icon: '🔄', label: 'In Progress' },
  };

  const priorityConfig = {
    'low': { color: '#10b981', icon: '🟢' },
    'medium': { color: '#f59e0b', icon: '🟡' },
    'high': { color: '#f97316', icon: '🟠' },
    'critical': { color: '#dc2626', icon: '🔴' },
  };

  const categoryConfig = {
    'bug': { icon: '🐛', label: 'Bug' },
    'feature': { icon: '💡', label: 'Feature' },
    'performance': { icon: '⚡', label: 'Performance' },
    'ui': { icon: '🎨', label: 'UI' },
    'data': { icon: '📊', label: 'Data' },
    'security': { icon: '🔒', label: 'Security' },
  };

  const counts = {
    resolved: complaintsData.filter(c => c.status === 'resolved').length,
    pending: complaintsData.filter(c => c.status === 'pending').length,
    'in-progress': complaintsData.filter(c => c.status === 'in-progress').length,
    total: complaintsData.length,
  };

  const filteredComplaints = filter === 'all'
    ? complaintsData
    : complaintsData.filter(c => c.status === filter);

  const resolvedPercent = counts.total > 0 ? (counts.resolved / counts.total) * 100 : 0;
  const pendingPercent = counts.total > 0 ? (counts.pending / counts.total) * 100 : 0;
  const inProgressPercent = counts.total > 0 ? (counts['in-progress'] / counts.total) * 100 : 0;

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateComplaintStatusAsync({ id, status: newStatus }));
  };

  return (
    <div className="complaint-card">
      <div className="complaint-card-header">
        <div className="complaint-card-header-left">
          <div className="complaint-card-icon">📊</div>
          <div>
            <h2 className="complaint-card-title">Complaint Status</h2>
            <p className="complaint-card-subtitle">{counts.total} total complaints</p>
          </div>
        </div>
      </div>

      <div className="complaint-card-body">
        {/* Chart Section */}
        <div className="complaint-chart-section">
          <div className="complaint-pie-wrapper">
            <div
              className="complaint-pie"
              style={{
                background: counts.total > 0
                  ? `conic-gradient(
                      #10b981 0deg ${resolvedPercent * 3.6}deg,
                      #f59e0b ${resolvedPercent * 3.6}deg ${(resolvedPercent + pendingPercent) * 3.6}deg,
                      #3b82f6 ${(resolvedPercent + pendingPercent) * 3.6}deg 360deg
                    )`
                  : '#e5e7eb'
              }}
            >
              <div className="complaint-pie-center">
                <span className="complaint-pie-total">{counts.total}</span>
                <span className="complaint-pie-label">Total</span>
              </div>
            </div>
          </div>

          <div className="complaint-legend">
            <div className="complaint-legend-item">
              <span className="complaint-legend-dot" style={{ backgroundColor: '#10b981' }}></span>
              <span className="complaint-legend-text">Resolved</span>
              <span className="complaint-legend-count">{counts.resolved}</span>
              <span className="complaint-legend-percent">{resolvedPercent.toFixed(0)}%</span>
            </div>
            <div className="complaint-legend-item">
              <span className="complaint-legend-dot" style={{ backgroundColor: '#f59e0b' }}></span>
              <span className="complaint-legend-text">Pending</span>
              <span className="complaint-legend-count">{counts.pending}</span>
              <span className="complaint-legend-percent">{pendingPercent.toFixed(0)}%</span>
            </div>
            <div className="complaint-legend-item">
              <span className="complaint-legend-dot" style={{ backgroundColor: '#3b82f6' }}></span>
              <span className="complaint-legend-text">In Progress</span>
              <span className="complaint-legend-count">{counts['in-progress']}</span>
              <span className="complaint-legend-percent">{inProgressPercent.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="complaint-status-cards">
          {Object.entries(statusConfig).map(([key, config]) => (
            <div
              key={key}
              className={`complaint-status-card ${filter === key ? 'active' : ''}`}
              onClick={() => setFilter(filter === key ? 'all' : key)}
              style={{ '--status-color': config.color, '--status-bg': config.bg }}
            >
              <span className="complaint-status-icon">{config.icon}</span>
              <span className="complaint-status-count">{counts[key]}</span>
              <span className="complaint-status-label">{config.label}</span>
            </div>
          ))}
        </div>

        {/* Complaints List */}
        <div className="complaint-list">
          {filteredComplaints.length === 0 ? (
            <div className="complaint-empty">No complaints found</div>
          ) : (
            filteredComplaints.map(complaint => {
              const sc = statusConfig[complaint.status];
              const pc = priorityConfig[complaint.priority];
              const cc = categoryConfig[complaint.category];
              return (
                <div key={complaint.id} className="complaint-item" style={{ borderLeftColor: sc.color }}>
                  <div className="complaint-item-top">
                    <span className="complaint-item-icon">{cc?.icon || '📋'}</span>
                    <div className="complaint-item-info">
                      <p className="complaint-item-subject">{complaint.subject}</p>
                      <p className="complaint-item-meta">
                        {complaint.reporter_name || complaint.assignee || 'Unassigned'} • {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>
                  <div className="complaint-item-bottom">
                    <select
                      className="complaint-status-select"
                      value={complaint.status}
                      onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                      style={{ backgroundColor: sc.bg, color: sc.color }}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="in-progress">🔄 In Progress</option>
                      <option value="resolved">✅ Resolved</option>
                    </select>
                    <span className="complaint-priority-badge" style={{ color: pc?.color }}>
                      {pc?.icon}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintStatus;
