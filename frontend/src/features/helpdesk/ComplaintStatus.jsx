import { useState } from 'react';
import '../../styles/complaint-status.css';

const complaintsData = [
  { id: 1, subject: 'Login page not loading', category: 'bug', status: 'resolved', priority: 'high', date: '2026-07-08', assignee: 'Dev Team' },
  { id: 2, subject: 'Data export crashing', category: 'bug', status: 'pending', priority: 'critical', date: '2026-07-09', assignee: 'Backend Team' },
  { id: 3, subject: 'Mobile view broken', category: 'ui', status: 'in-progress', priority: 'medium', date: '2026-07-09', assignee: 'Frontend Team' },
  { id: 4, subject: 'Slow page load time', category: 'performance', status: 'resolved', priority: 'high', date: '2026-07-07', assignee: 'DevOps' },
  { id: 5, subject: 'Search showing wrong data', category: 'data', status: 'pending', priority: 'critical', date: '2026-07-10', assignee: 'Backend Team' },
  { id: 6, subject: 'Add dark mode', category: 'feature', status: 'in-progress', priority: 'low', date: '2026-07-06', assignee: 'Frontend Team' },
  { id: 7, subject: 'CSV export missing columns', category: 'bug', status: 'resolved', priority: 'medium', date: '2026-07-08', assignee: 'Dev Team' },
  { id: 8, subject: 'Chat not responding', category: 'bug', status: 'pending', priority: 'high', date: '2026-07-10', assignee: 'AI Team' },
  { id: 9, subject: 'Dashboard charts lag', category: 'performance', status: 'resolved', priority: 'medium', date: '2026-07-05', assignee: 'DevOps' },
  { id: 10, subject: 'User session timeout', category: 'security', status: 'in-progress', priority: 'high', date: '2026-07-09', assignee: 'Security Team' },
  { id: 11, subject: 'Form validation missing', category: 'ui', status: 'resolved', priority: 'low', date: '2026-07-04', assignee: 'Frontend Team' },
  { id: 12, subject: 'API rate limiting', category: 'security', status: 'pending', priority: 'critical', date: '2026-07-10', assignee: 'Backend Team' },
];

const ComplaintStatus = () => {
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

  const resolvedPercent = (counts.resolved / counts.total) * 100;
  const pendingPercent = (counts.pending / counts.total) * 100;
  const inProgressPercent = (counts['in-progress'] / counts.total) * 100;

  return (
    <div className="complaint-status">
      <div className="complaint-header">
        <div className="complaint-header-left">
          <div className="complaint-header-icon">📊</div>
          <div>
            <h3 className="complaint-title">Complaint Status</h3>
            <p className="complaint-subtitle">{counts.total} total complaints</p>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="pie-chart-section">
        <div className="pie-chart-wrapper">
          <div
            className="pie-chart"
            style={{
              background: `conic-gradient(
                #10b981 0deg ${resolvedPercent * 3.6}deg,
                #f59e0b ${resolvedPercent * 3.6}deg ${(resolvedPercent + pendingPercent) * 3.6}deg,
                #3b82f6 ${(resolvedPercent + pendingPercent) * 3.6}deg 360deg
              )`
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
        {filteredComplaints.map(complaint => {
          const sc = statusConfig[complaint.status];
          const pc = priorityConfig[complaint.priority];
          const cc = categoryConfig[complaint.category];
          return (
            <div key={complaint.id} className="complaint-item" style={{ borderLeftColor: sc.color }}>
              <div className="complaint-item-header">
                <div className="complaint-item-left">
                  <span className="complaint-item-category">{cc.icon}</span>
                  <div>
                    <p className="complaint-item-subject">{complaint.subject}</p>
                    <p className="complaint-item-meta">
                      {complaint.assignee} • {complaint.date}
                    </p>
                  </div>
                </div>
                <div className="complaint-item-badges">
                  <span className="complaint-badge" style={{ backgroundColor: sc.bg, color: sc.color }}>
                    {sc.icon} {sc.label}
                  </span>
                  <span className="complaint-priority" style={{ color: pc.color }}>
                    {pc.icon}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComplaintStatus;
