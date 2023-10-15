import React from 'react';
import './Driver_Dashboard.css';
import DriverSidebar from './DriverSidebar'; 
import { Link } from 'react-router-dom';

function DriverDashboard() {
    return (
        <main>
            <div className="sidebar-container">
                <DriverSidebar /> {/* Include the DriverSidebar component here */}
                <section className="hero">
                    <h2>Welcome to Your Dashboard</h2>
                    <p>Welcome to your driver dashboard. Here you can access various features and information.</p>
                    <a href="#" className="cta-button">Explore</a>
                </section>
            </div>
        </main>
    );
}

export default DriverDashboard;
