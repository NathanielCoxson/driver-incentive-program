import React, { useState } from 'react';

function RejectionDriverJoin({ onClose, onReject }) {
    const [rejectionReason, setRejectionReason] = useState('');

    const handleReject = () => {
        if (rejectionReason) {
            onReject(rejectionReason);
        }
        onClose();
    };

    return (
        <div className="rejection-reason-modal">
            <h2>Provide Rejection Reason</h2>
            <textarea
                placeholder="Enter your rejection reason here..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
            />
            <button onClick={handleReject}>Reject</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    );
}

export default RejectionDriverJoin;
