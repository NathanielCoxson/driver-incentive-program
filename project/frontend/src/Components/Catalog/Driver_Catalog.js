import React from 'react';
import './catalog.css';
import DriverSidebar from '../Sidebar/Driver_Sidebar';
import { Link } from 'react-router-dom';

function DriverCatalog() {
    return (
        <main>
            <div className="sidebar-container">
                <DriverSidebar /> {/* Include the DriverSidebar component here */}
                <section className="hero">
                <h2>Welcome to Your Driver's Catalog</h2>
                    <div class="sponsor-info">
                        <p> Here is a list of catalog item you chould choose from.</p>
                        <p> ... </p>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default DriverCatalog;