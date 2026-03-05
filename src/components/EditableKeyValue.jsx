import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
        <motion.div layout className={`kv ${locks[lockKey] ? 'locked' : ''} ${isEnabled === false ? 'disabled' : ''} ${customClass}`}>
            <motion.div layout="position" className="k">
                {label}
                <div style={{ display: 'flex', gap: '4px' }}>
                    <ToggleButton isEnabled={isEnabled !== false} onToggle={() => toggleEnable && toggleEnable(lockKey)} />
                    <LockButton isLocked={locks[lockKey]} onToggle={() => toggleLock(lockKey)} />
                </div>
            </motion.div>
            {isEditing ? (
                <motion.textarea
                    layout
                    autoFocus className="v" value={tempVal}
                    onChange={(e) => setTempVal(e.target.value)} onBlur={handleBlur}
                    rows={rows}
                />
            ) : (
                <motion.div layout="position" className="v editable" onClick={() => setIsEditing(true)} title="Click to edit! ✏️">{value}</motion.div>
            )}
        </motion.div>
    );
};

export default EditableKeyValue;
