import React, { useState, useEffect } from 'react';

const EditableStep = ({ step, index, onStepEditSave }) => {
    const [name, hint, desc] = step;
    const [isEditing, setIsEditing] = useState(false);
    const [tempDesc, setTempDesc] = useState(desc);

    useEffect(() => { setTempDesc(desc); }, [desc]);

    const handleBlur = () => {
        setIsEditing(false);
        if (tempDesc !== desc) {
            onStepEditSave(index, tempDesc);
        }
    };

    const rows = (tempDesc || "").split('\n').length || 1;

    return (
        <div className="step">
            <div className="step-hd">
                <span className="step-name">{name}</span>
                <span className="step-hint">{hint}</span>
            </div>
            {isEditing ? (
                <textarea
                    autoFocus className="step-desc" value={tempDesc}
                    onChange={(e) => setTempDesc(e.target.value)} onBlur={handleBlur}
                    rows={rows}
                />
            ) : (
                <div className="step-desc editable" onClick={() => setIsEditing(true)} title="Click to edit! ✏️">{desc}</div>
            )}
        </div>
    );
};

export default EditableStep;
