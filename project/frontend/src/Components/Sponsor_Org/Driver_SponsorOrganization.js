import React from 'react';
import './Driver_SponsorOrganization.css';
import { Link } from 'react-router-dom';

function DriverSponsorOrganization() {
    return (
        <section className="hero">
            <h2>Welcome to Your Driver's Sponsor Organization Dashboard</h2>
            <div class="sponsor-info">
                <p><strong>Sponsor Company:</strong> ABC Motors</p>
                <p>Looking for a Sponsor?</p>
                <Link to="../join_sponsor_organization" className="cta-button">Join An Sponsor Organization</Link>
            </div>
        </section>
    );
}

export default DriverSponsorOrganization;