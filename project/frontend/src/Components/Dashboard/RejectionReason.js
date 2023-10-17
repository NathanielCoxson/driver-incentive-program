import React, { useState } from 'react';

function RejectionReason({ onClose, onReject }) {
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        onReject(reason);
        onClose();
    };

    return (
        <div className="rejection-modal">
            <h2>Provide a Reason for Rejection</h2>
            <textarea
                rows="4"
                placeholder="Enter the reason for rejection..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
            />
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    );
}

export default RejectionReason;
