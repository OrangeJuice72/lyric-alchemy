import React, { useState, useEffect } from 'react';
import LockButton from './LockButton';

const EditableKeyValue = ({ label, value, lockKey, locks, toggleLock, onEditSave, customClass = "" }) => {
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
        <div className={`kv ${locks[lockKey] ? 'locked' : ''} ${customClass}`}>
            <div className="k">
                {label}
                <LockButton isLocked={locks[lockKey]} onToggle={() => toggleLock(lockKey)} />
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
