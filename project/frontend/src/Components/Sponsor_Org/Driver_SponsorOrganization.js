import React from 'react';
import './Driver_SponsorOrganization.css';
import DriverSidebar from '../Sidebar/Driver_Sidebar';
import { Link } from 'react-router-dom';

function DriverSponsorOrganization() {
    return (
        <main>
            <div className="sidebar-container">
                <DriverSidebar /> {/* Include the DriverSidebar component here */}
                <section className="hero">
                <h2>Welcome to Your Driver's Sponsor Organization Dashboard</h2>
                    <div class="sponsor-info">
                        <p><strong>Sponsor Company:</strong> ABC Motors</p>
                        <p>Looking for a Sponsor?</p>
                        <Link to="/driver_sponsor_organization/join_sponsor_organization" className="cta-button">Join An Sponsor Organization</Link>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default DriverSponsorOrganization;