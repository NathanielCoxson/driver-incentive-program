import React from 'react';
import './DriverPoints.css';

function DriverPoints() {
    return (
        <section className="hero">
            <h2>Welcome to Your Point Dashboard</h2>
            <p>Welcome to your driver dashboard. Here you can access various features and information.</p>
            <h2>Points</h2>
            <div className="points-info">
                <p>You have <strong>##</strong> Points</p>
            </div>
        </section>
    );
}

export default DriverPoints;