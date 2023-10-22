import React, { useState } from 'react';
import './SponsorPoints.css';

function SponsorPoints() {
    const [drivers, setDrivers] = useState([
        { name: 'Driver 1', points: 100 },
        { name: 'Driver 2', points: 75 },
        { name: 'Driver 3', points: 120 },
    ]);
    const [pointsChange, setPointsChange] = useState('');

    const handlePointsChange = (action, driverIndex) => {
        const updatedDrivers = [...drivers];
        const [pointsAction, pointsValue] = pointsChange.split(',');

        if (action === 'add') {
            updatedDrivers[driverIndex].points += parseInt(pointsValue, 10);
        } else if (action === 'reduce') {
            updatedDrivers[driverIndex].points -= parseInt(pointsValue, 10);
        }

        setPointsChange('');
        setDrivers(updatedDrivers);
    };

    return (
        <section className="hero">
            <h2>Welcome to Your Point Dashboard</h2>
            <p>Welcome to your sponsor dashboard. Here you can access various features and information.</p>
            <h2>Points Adjustment</h2>

            <div className="driver-list">
                {drivers.map((driver, index) => (
                    <div key={index} className="driver-entry">
                        <h3>{driver.name}</h3>
                        <p>Points: {driver.points}</p>
                        <input
                            type="text"
                            value={pointsChange}
                            onChange={(e) => setPointsChange(e.target.value)}
                            placeholder="Enter points change (e.g., add,10 or reduce,5)"
                        />
                        <button onClick={() => handlePointsChange('add', index)}>Add</button>
                        <button onClick={() => handlePointsChange('reduce', index)}>Reduce</button>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default SponsorPoints;
