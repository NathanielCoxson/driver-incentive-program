import React from 'react';
import './Driver_Point.css';
import DriverSidebar from '../Sidebar/Driver_Sidebar';

function DriverPoint() {
    return (
        <main>
            <div className="sidebar-container">
                <DriverSidebar /> {/* Include the DriverSidebar component here */}
                <section className="hero">
                    <h2>Welcome to Your Point Dashboard</h2>
                    <p>Welcome to your driver dashboard. Here you can access various features and information.</p>             
                    <h2>Points</h2>
                        <div class="points-info">
                            <p>You have <strong>##</strong> Points</p>
                        </div>
                </section>
            </div>
        </main>
    );
}

export default DriverPoint;