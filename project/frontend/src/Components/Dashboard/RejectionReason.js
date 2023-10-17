import React, { useState } from 'react';
import './RejectionReason.css';
import { Link } from 'react-router-dom';

function RejectionReason() {
    const [rejectionReason, setRejectionReason] = useState('');

    const handleRejectWithReason = () => {
        if (rejectionReason) {
            alert(`Rejected with reason: ${rejectionReason}`);
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

                <Link to="/sponsor_dashboard" className="cta-button">
                    Go Back
                </Link>
            </section>
        </main>
    );
}

export default RejectionReason;
