import React from 'react';

const Badge = ({ type, value, icon }) => {
  const getBadgeClass = () => {
    switch (type) {
      case 'interaction':
        return `badge badge-${value}`;
      case 'sentiment':
        return `badge badge-${value}`;
      case 'followup':
        return `badge badge-${value === 'yes' ? 'pending' : 'completed'}`;
      case 'priority':
        return `badge badge-${value}`;
      case 'ai':
        return 'badge badge-ai';
      default:
        return 'badge';
    }
  };

  const getDisplayText = () => {
    switch (type) {
      case 'interaction':
        return value.charAt(0).toUpperCase() + value.slice(1);
      case 'sentiment':
        return value.charAt(0).toUpperCase() + value.slice(1);
      case 'followup':
        return value === 'yes' ? 'Pending' : 'Completed';
      case 'priority':
        return value.charAt(0).toUpperCase() + value.slice(1);
      default:
        return value;
    }
  };

  const getIcon = () => {
    if (icon) return icon;
    switch (type) {
      case 'interaction':
        const interactionIcons = {
          call: '📞',
          meeting: '🤝',
          email: '📧',
          visit: '🏥',
          conference: '🎤'
        };
        return interactionIcons[value] || '📋';
      case 'sentiment':
        const sentimentIcons = {
          positive: '😊',
          neutral: '😐',
          negative: '😞'
        };
        return sentimentIcons[value] || '❓';
      case 'followup':
        return value === 'yes' ? '⏰' : '✅';
      case 'priority':
        const priorityIcons = {
          high: '🔴',
          medium: '🟡',
          low: '🟢'
        };
        return priorityIcons[value] || '⚪';
      case 'ai':
        return '🤖';
      default:
        return '📋';
    }
  };

  return (
    <span className={getBadgeClass()} role="status">
      <span aria-hidden="true">{getIcon()}</span>
      <span>{getDisplayText()}</span>
    </span>
  );
};

export default React.memo(Badge);
