import React, { useState } from 'react';
import './SponsorDashboard.css';
import { Link } from 'react-router-dom';

function SponsorDashboard() {
    const [joinRequests, setJoinRequests] = useState([
        {
            driverName: 'Driver 1',
            requestReason: 'I want to join your organization',
            status: 'Pending', // Add a status field to track request status
        },
        {
            driverName: 'Driver 2',
            requestReason: 'Please accept my request',
            status: 'Pending',
        },
        // Add more join requests as needed
    ]);

    const acceptOrRejectRequest = (driverName, accepted) => {
        const updatedRequests = joinRequests.map((request) => {
            if (request.driverName === driverName) {
                return { ...request, status: accepted ? 'Accepted' : 'Rejected' };
            }
            return request;
        });
        setJoinRequests(updatedRequests);
    };

    return (
        <section className="hero">
            <h2>Welcome to Your Dashboard</h2>
            <p>Welcome to your sponsor dashboard. Here you can access various features and information.</p>
            <Link to="/dashboard" className="cta-button">
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
                        {request.status === 'Accepted' ? (
                            <p>Accepted</p>
                        ) : request.status === 'Rejected' ? (
                            <p>Rejected</p>
                        ) : (
                            <>
                                <button onClick={() => acceptOrRejectRequest(request.driverName, true)} className="cta-button">
                                    Accept
                                </button>
                                <button onClick={() => acceptOrRejectRequest(request.driverName, false)} className="cta-button">
                                    Reject
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}

export default SponsorDashboard;
