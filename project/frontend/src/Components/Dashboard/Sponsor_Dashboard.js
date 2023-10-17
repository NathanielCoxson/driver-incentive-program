import React, { useState } from 'react';
import './Sponsor_Dashboard.css';
import SponsorSidebar from '../Sidebar/Sponsor_sidebar';
import { Link } from 'react-router-dom';

function SponsorDashboard() {
    const [joinRequests, setJoinRequests] = useState([
        {
            driverName: 'Driver 1', // Replace with actual driver's name
            requestReason: 'I want to join your organization', // Replace with the driver's request reason
        },
        {
            driverName: 'Driver 2', // Replace with actual driver's name
            requestReason: 'Please accept my request', // Replace with the driver's request reason
        },
        // Add more join requests as needed
    ]);

    const acceptRequest = (driverName) => {
        // Handle logic to accept the driver's request
        alert(`Accepted request from ${driverName}`);
    };

    const [rejectionReason, setRejectionReason] = useState('');
    const rejectRequest = (driverName) => {
        // Handle logic to reject the driver's request
        if (rejectionReason) {
            alert(`Rejected request from ${driverName} with reason: ${rejectionReason}`);
        } else {
            alert(`Please provide a reason for rejecting the request.`);
        }
    };

    return (
        <main>
            <div className="sidebar-container">
                <SponsorSidebar />
                <section className="hero">
                    <h2>Welcome to Your Dashboard</h2>
                    <p>Welcome to your sponsor dashboard. Here you can access various features and information.</p>
                    <Link to="/sponsor_dashboard" className="cta-button">Explore</Link>

                    {/* Join Request section */}
                    <div className="join-request-section">
                        <h3>Join Requests</h3>
                        {joinRequests.map((request, index) => (
                            <div key={index} className="join-request">
                                <p><strong>Driver:</strong> {request.driverName}</p>
                                <p><strong>Reason:</strong> {request.requestReason}</p>
                                <button onClick={() => acceptRequest(request.driverName)} className="cta-button">
                                    Accept
                                </button>
                                <button onClick={() => rejectRequest(request.driverName)} className="cta-button">
                                    Reject
                                </button>
                                {rejectionReason && (
                                    <div>
                                        <textarea
                                            placeholder="Reason for rejection"
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                        />
                                    </div>
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
