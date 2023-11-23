import React from 'react';
import './DriverDashboard.css';
import { Link } from 'react-router-dom';

function DriverDashboard() {
    return (
        <section className="hero">
            <h2>Welcome to Your Dashboard</h2>
            <p>Welcome to your driver dashboard. Here you can access various features and information.</p>
            <Link to="/dashboard" className="cta-button">Explore</Link>
        </section>
    );
}

export default DriverDashboard;
