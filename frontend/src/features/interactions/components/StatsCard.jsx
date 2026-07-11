import React from 'react';

const StatsCard = ({ icon, value, label, trend, trendValue, color = 'blue' }) => {
  return (
    <div className={`kpi-card ${color}`} role="article" aria-label={`${label}: ${value}`}>
      <div className="kpi-card-header">
        <div className="kpi-card-icon" aria-hidden="true">
          {icon}
        </div>
        {trend && (
          <div className={`kpi-card-trend ${trend}`}>
            <span aria-hidden="true">{trend === 'up' ? '↑' : '↓'}</span>
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className="kpi-card-value">{value}</div>
      <div className="kpi-card-label">{label}</div>
    </div>
  );
};

export default React.memo(StatsCard);
