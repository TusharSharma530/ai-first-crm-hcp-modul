import React from 'react';

const EmptyState = ({ 
  icon = '📋', 
  title = 'No interactions found', 
  text = 'Start by creating your first interaction or adjust your filters.',
  buttonText = 'Create First Interaction',
  onButtonClick 
}) => {
  return (
    <div className="empty-state-container animate-fadeIn" role="status">
      <div className="empty-state-icon" aria-hidden="true">
        {icon}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-text">{text}</p>
      {onButtonClick && (
        <button 
          className="empty-state-btn"
          onClick={onButtonClick}
          aria-label={buttonText}
        >
          <span aria-hidden="true">+</span>
          <span>{buttonText}</span>
        </button>
      )}
    </div>
  );
};

export default React.memo(EmptyState);
