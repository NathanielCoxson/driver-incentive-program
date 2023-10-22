import React, { useState } from 'react';
import './DriverDashboard.css';
import { Link } from 'react-router-dom';

function DriverDashboard() {
    // Simulated invitation data
    const invitation = {
        organizationName: 'Sample Organization', // Replace with actual organization name
        sponsorName: 'Sponsor Name', // Replace with actual sponsor name
    };

    const [invitationStatus, setInvitationStatus] = useState(''); // To track invitation status

    const acceptInvitation = () => {
        // Handle the logic to accept the invitation
        setInvitationStatus('Accepted');
    };

    const declineInvitation = () => {
        // Handle the logic to decline the invitation
        setInvitationStatus('Rejected');
    };

    return (
        <section className="hero">
            <h2>Welcome to Your Dashboard</h2>
            <p>Welcome to your driver dashboard. Here you can access various features and information.</p>
            <Link to="/dashboard" className="cta-button">Explore</Link>

            {/* Invitation section */}
            {invitation && (
                <div className="invitation-section">
                    <h3>Invitation to Join {invitation.organizationName}</h3>
                    <p>You have received an invitation from {invitation.sponsorName} to join {invitation.organizationName}.</p>
                    {invitationStatus === '' ? (
                        <>
                            <button onClick={acceptInvitation} className="cta-button">Accept</button>
                            <button onClick={declineInvitation} className="cta-button">Decline</button>
                        </>
                    ) : (
                        <p>{invitationStatus}</p>
                    )}
                </div>
            )}
        </section>
    );
}

export default DriverDashboard;
