import React, { useState } from 'react';
import './Sponsor_Dashboard.css';
import SponsorSidebar from '../Sidebar/Sponsor_sidebar';
import { Link } from 'react-router-dom';

function SponsorDashboard() {
    // Remove the following unused declarations
    // const [joinRequests, setJoinRequests] = useState([...]);
    // const [rejectionReason, setRejectionReason] = useState('');
    // const [showRejectionModal, setShowRejectionModal] = useState(false);
    // const rejectRequest = (driverName) => { ... }
    // const handleRejectWithReason = (reason) => { ... }

    const [acceptedRequests, setAcceptedRequests] = useState([]); // Track accepted requests

    const acceptRequest = (driverName) => {
        setAcceptedRequests((prevAcceptedRequests) => [
            ...prevAcceptedRequests,
            driverName,
        ]);
    };

    return (
        <main>
            <div className="sidebar-container">
                <SponsorSidebar />
                <section className="hero">
                    <h2>Welcome to Your Dashboard</h2>
                    <p>Welcome to your sponsor dashboard. Here you can access various features and information.</p>
                    <Link to="/sponsor_dashboard" className="cta-button">
                        Explore
                    </Link>

                    <div className="join-request-section">
                        <h3>Join Requests</h3>
                        {joinRequests.map((request, index) => (
                            <div key={index} className="join-request">
                                <p>
                                    <strong>Driver:</strong> {request.driverName}
                                </p>
                                <p>
                                    <strong>Reason:</strong> {request.requestReason}
                                </p>
                                {acceptedRequests.includes(request.driverName) ? (
                                    <p>Accepted</p>
                                ) : (
                                    <>
                                        <button onClick={() => acceptRequest(request.driverName)} className="cta-button">
                                            Accept
                                        </button>
                                        <Link to="/sponsor_dashboard/rejection_reason" className="cta-button">
                                            Reject
                                        </Link>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default SponsorDashboard;
