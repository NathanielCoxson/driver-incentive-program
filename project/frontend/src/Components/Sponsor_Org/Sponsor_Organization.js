import React from 'react';
import './Sponsor_Organization.css';
import SponsorSidebar from '../Sidebar/Sponsor_Sidebar';
import { Link } from 'react-router-dom';

function SponsorOrganization() {
    return (
        <main>
            <div className="sidebar-container">
                <SponsorSidebar /> {/* Include the DriverSidebar component here */}
                <section className="hero">
                <h2>Welcome to Your Driver's Sponsor Organization Dashboard</h2>
                    <div class="sponsor-info">
                        <p><strong>Sponsor Company:</strong> ABC Motors</p>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default SponsorOrganization;