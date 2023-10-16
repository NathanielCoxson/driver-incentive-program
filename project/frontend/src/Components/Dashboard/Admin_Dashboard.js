import React from 'react';
import './Admin_Dashboard.css';
import AdminSidebar from '../Sidebar/Admin_Sidebar';
import { Link } from 'react-router-dom';

function AdminDashboard() {
    return (
        <main>
            <div className="sidebar-container">
                <AdminSidebar />
                <section className="hero">
                    <h2>Welcome to Your Dashboard</h2>
                    <p>Welcome to your admin dashboard. Here you can access various features and information.</p>             
                    <Link to="/admin_dashboard" className="cta-button">Explore</Link>
                </section>
            </div>
        </main>
    );
}

export default AdminDashboard;
