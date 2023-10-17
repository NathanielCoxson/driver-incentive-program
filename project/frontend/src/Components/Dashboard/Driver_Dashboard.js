import React from 'react';
import './Driver_Dashboard.css';
import DriverSidebar from '../Sidebar/Driver_Sidebar';
import { Link } from 'react-router-dom';

function DriverDashboard() {
    // Simulated invitation data
    const invitation = {
        organizationName: 'Sample Organization', // Replace with actual organization name
        sponsorName: 'Sponsor Name', // Replace with actual sponsor name
    };

    const acceptInvitation = () => {
        // Handle the logic to accept the invitation
        alert('Invitation accepted');
    };

    const declineInvitation = () => {
        // Handle the logic to decline the invitation
        alert('Invitation declined');
    };

    return (
        <main>
            <div className="sidebar-container">
                <DriverSidebar />
                <section className="hero">
                    <h2>Welcome to Your Dashboard</h2>
                    <p>Welcome to your driver dashboard. Here you can access various features and information.</p>
                    <Link to="/driver_dashboard" className="cta-button">Explore</Link>

                    {/* Invitation section */}
                    {invitation && (
                        <div className="invitation-section">
                            <h3>Invitation to Join {invitation.organizationName}</h3>
                            <p>You have received an invitation from {invitation.sponsorName} to join {invitation.organizationName}.</p>
                            <button onClick={acceptInvitation} className="cta-button">Accept</button>
                            <button onClick={declineInvitation} className="cta-button">Decline</button>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default DriverDashboard;
