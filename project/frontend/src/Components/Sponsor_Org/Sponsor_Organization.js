import React from 'react';
import './Sponsor_Organization.css';
import SponsorSidebar from '../Sidebar/Sponsor_sidebar';
import { Link } from 'react-router-dom';

function SponsorOrganization() {
    return (
        <main>
            <div className="sidebar-container">
                <SponsorSidebar /> {/* Include the DriverSidebar component here */}
                <section className="hero">
                <h2>Welcome to Your Sponsor Organization Dashboard</h2>
                    <div class="sponsor-info">
                        <p><strong>Sponsor Company:</strong> ABC Motors</p>
                    </div>
                    <p>Looking for a Sponsor?</p>
                    <Link to="/sponsor_dashboard/sponsor_organization/join_sponsor_organization" className="cta-button">Join An Sponsor Organization</Link>
                    <p>If not</p>
                    <Link to="//sponsor_dashboard/sponsor_organization/create_sponsor_organization" className="cta-button"> Create An Sponsor Organization</Link>

                </section>
            </div>
        </main>
    );
}

export default SponsorOrganization;