import React from 'react';

const ToggleButton = ({ isEnabled, onToggle }) => {
    return (
        <button
            className={`lock-btn toggle-btn ${isEnabled ? 'active' : ''}`}
            onClick={onToggle}
            title={isEnabled ? "Click to exclude from export" : "Click to include in export"}
        >
            {isEnabled ? '👁️' : '🚫'}
        </button>
    );
};

export default ToggleButton;
