import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function RejectionReason() {
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectionMessage, setRejectionMessage] = useState('');

    const handleRejectWithReason = () => {
        if (rejectionReason) {
            setRejectionMessage(`Rejected with reason: ${rejectionReason}`);
        }
    };

    return (
        <main>
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

                <button onClick={handleRejectWithReason} className="cta-button">
                    Reject
                </button>

                {rejectionMessage && (
                    <div className="rejection-message">
                        <p>{rejectionMessage}</p>
                    </div>
                )}

                <Link to="/sponsor_dashboard" className="cta-button">
                    Go Back
                </Link>
            </section>
        </main>
    );
}

export default RejectionReason;
