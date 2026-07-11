import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateComplaintStatus } from './complaintsSlice';

const ComplaintStatus = () => {
  const dispatch = useDispatch();
  const { items: complaintsData } = useSelector(state => state.complaints);
  const [filter, setFilter] = useState('all');

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
    dispatch(updateComplaintStatus({ id, status: newStatus }));
  };

  return (
    <div className="crm-card">
      <div className="crm-card-header">
        <div className="crm-card-header-left">
          <div className="crm-card-header-icon purple">📊</div>
          <div>
            <h2 className="crm-card-title">Complaint Status</h2>
            <p className="crm-card-subtitle">{counts.total} total complaints</p>
          </div>
        </div>
      </div>

      <div className="crm-card-body">
        {/* Pie Chart */}
        <div className="pie-chart-section">
          <div className="pie-chart-wrapper">
            <div
              className="pie-chart"
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
              <div className="pie-chart-center">
                <span className="pie-chart-total">{counts.total}</span>
                <span className="pie-chart-label">Total</span>
              </div>
            </div>
          </div>

          <div className="pie-legend">
            <div className="pie-legend-item">
              <span className="pie-legend-dot" style={{ backgroundColor: '#10b981' }}></span>
              <span className="pie-legend-label">Resolved</span>
              <span className="pie-legend-value">{counts.resolved}</span>
              <span className="pie-legend-percent">{resolvedPercent.toFixed(0)}%</span>
            </div>
            <div className="pie-legend-item">
              <span className="pie-legend-dot" style={{ backgroundColor: '#f59e0b' }}></span>
              <span className="pie-legend-label">Pending</span>
              <span className="pie-legend-value">{counts.pending}</span>
              <span className="pie-legend-percent">{pendingPercent.toFixed(0)}%</span>
            </div>
            <div className="pie-legend-item">
              <span className="pie-legend-dot" style={{ backgroundColor: '#3b82f6' }}></span>
              <span className="pie-legend-label">In Progress</span>
              <span className="pie-legend-value">{counts['in-progress']}</span>
              <span className="pie-legend-percent">{inProgressPercent.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="status-cards">
          {Object.entries(statusConfig).map(([key, config]) => (
            <div
              key={key}
              className={`status-card ${filter === key ? 'active' : ''}`}
              onClick={() => setFilter(filter === key ? 'all' : key)}
              style={{ '--status-color': config.color }}
            >
              <span className="status-card-icon">{config.icon}</span>
              <span className="status-card-count">{counts[key]}</span>
              <span className="status-card-label">{config.label}</span>
            </div>
          ))}
        </div>

        {/* Complaints List */}
        <div className="complaints-list">
          {filteredComplaints.length === 0 ? (
            <div className="complaints-empty">No complaints found</div>
          ) : (
            filteredComplaints.map(complaint => {
              const sc = statusConfig[complaint.status];
              const pc = priorityConfig[complaint.priority];
              const cc = categoryConfig[complaint.category];
              return (
                <div key={complaint.id} className="complaint-item" style={{ borderLeftColor: sc.color }}>
                  <div className="complaint-item-header">
                    <div className="complaint-item-left">
                      <span className="complaint-item-category">{cc?.icon || '📋'}</span>
                      <div>
                        <p className="complaint-item-subject">{complaint.subject}</p>
                        <p className="complaint-item-meta">
                          {complaint.assignee} • {complaint.date}
                        </p>
                      </div>
                    </div>
                    <div className="complaint-item-badges">
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
                      <span className="complaint-priority" style={{ color: pc?.color }}>
                        {pc?.icon}
                      </span>
                    </div>
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
