import React, { useState, useEffect } from 'react';
import LockButton from './LockButton';
import ToggleButton from './ToggleButton';

const EditableKeyValue = ({ label, value, lockKey, locks, toggleLock, isEnabled = true, toggleEnable, onEditSave, customClass = "" }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempVal, setTempVal] = useState(value);

    useEffect(() => { setTempVal(value); }, [value]);

    const handleBlur = () => {
        setIsEditing(false);
        if (tempVal !== value) {
            onEditSave(lockKey, tempVal);
        }
    };

    const rows = (tempVal || "").split('\n').length || 1;

    return (
        <div className={`kv ${locks[lockKey] ? 'locked' : ''} ${isEnabled === false ? 'disabled' : ''} ${customClass}`}>
            <div className="k">
                {label}
                <div style={{ display: 'flex', gap: '4px' }}>
                    <ToggleButton isEnabled={isEnabled !== false} onToggle={() => toggleEnable && toggleEnable(lockKey)} />
                    <LockButton isLocked={locks[lockKey]} onToggle={() => toggleLock(lockKey)} />
                </div>
            </div>
            {isEditing ? (
                <textarea
                    autoFocus className="v" value={tempVal}
                    onChange={(e) => setTempVal(e.target.value)} onBlur={handleBlur}
                    rows={rows}
                />
            ) : (
                <div className="v editable" onClick={() => setIsEditing(true)} title="Click to edit! ✏️">{value}</div>
            )}
        </div>
    );
};

export default EditableKeyValue;
