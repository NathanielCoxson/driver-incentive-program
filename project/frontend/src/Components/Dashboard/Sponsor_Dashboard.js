import React from 'react';
import './Sponsor_Dashboard.css';

import { Link } from 'react-router-dom';

function SponsorDashboard() {
    return (
        <main>
            <div className="sidebar-container">

                <section className="hero">
                    <h2>Welcome to Your Dashboard</h2>
                    <p>Welcome to your sponsor dashboard. Here you can access various features and information.</p>             
                    <Link to="/sponsor_dashboard" className="cta-button">Explore</Link>
                </section>
            </div>
        </main>
    );
}

export default SponsorDashboard;
