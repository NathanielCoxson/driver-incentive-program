import React from 'react';
import './DriverDashboard.css';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function DriverDashboard() {
    const {auth} = useAuth(); 
    return (
        <section className="hero">
            {(auth?.view != auth?.Role) && <p style={{color: 'yellow'}}>{auth?.view} view</p>}
            <h2>Welcome to Your Dashboard</h2>
            <p>Welcome to your driver dashboard. Here you can access various features and information.</p>
            <Link to="/dashboard" className="cta-button">Explore</Link>
        </section>
    );
}

export default DriverDashboard;
