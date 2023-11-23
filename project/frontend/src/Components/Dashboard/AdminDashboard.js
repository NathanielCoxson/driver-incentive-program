import React from 'react';
import './AdminDashboard.css';
import { Link } from 'react-router-dom';

function AdminDashboard() {
    return (
        <section className="hero">
            <h2>Welcome to Your Dashboard</h2>
            <p>Welcome to your admin dashboard. Here you can access various features and information.</p>
            <Link to='/password-reset'>Forgot Password?</Link>
        </section>
    );
}

export default AdminDashboard;
