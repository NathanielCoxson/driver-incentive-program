import './driver_dashboard.css';
import { Link } from 'react-router-dom';

function DriverDashboard() {
    return (
        <main>
            <div class="sidebar">
                <ul>
                    <li><a href="driver_dashboard.html">Dashboard Home</a></li>
                    <li><a href="profile.html">Profile</a></li>
                    <li><a href="sponsor-organization.html">Sponsor Organization</a></li>
                    <li><a href="catalog.html">Catalog</a></li>
                </ul>
            </div>
            <section className="hero">
                <h2>Welcome to Your Dashboard</h2>
                <p>Welcome to your driver dashboard. Here you can access various features and information.</p>
                <a href="#" className="cta-button">Explore</a>
            </section>
        </main>
    );
}

export default DriverDashboard;
