import React from 'react';

const LockButton = ({ isLocked, onToggle }) => (
    <button className={`lock-btn ${isLocked ? 'active' : ''}`} onClick={onToggle} title={isLocked ? "Unlock" : "Lock"}>
        {isLocked ? '🔒' : '🔓'}
    </button>
);

export default LockButton;
