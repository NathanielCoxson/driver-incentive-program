import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function RejectionReason() {
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectionMessage, setRejectionMessage] = useState('');
    const [isRejected, setIsRejected] = useState(false);

    const handleRejectWithReason = () => {
        if (rejectionReason) {
            setRejectionMessage(`Rejected with reason: ${rejectionReason}`);
            setIsRejected(true);
        }
    };

    return (
        <section className="hero">
            <h2>Reject Reason</h2>
            <p>Please provide a reason for rejecting the join request.</p>

            <div className="rejection-form">
                <textarea
                    placeholder="Reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                />
            </div>

            {isRejected ? (
                <div className="rejection-message">
                    <p>{rejectionMessage}</p>
                </div>
            ) : (
                <button onClick={handleRejectWithReason} className="cta-button">
                    Reject
                </button>
            )}

            <Link to="/dashboard" className="cta-button">
                Go Back
            </Link>
        </section>
    );
}

export default RejectionReason;
