import React, { useState } from 'react';
import './SponsorPoints.css';

function SponsorPoints() {
    const [drivers, setDrivers] = useState([
        { name: 'Driver 1', points: 100 },
        { name: 'Driver 2', points: 75 },
        { name: 'Driver 3', points: 120 },
    ]);
    const [selectedDriver, setSelectedDriver] = useState('');
    const [pointsChange, setPointsChange] = useState('');

    const handlePointsChange = (action) => {
        const updatedDrivers = [...drivers];
        const driverIndex = drivers.findIndex((driver) => driver.name === selectedDriver);
        const [pointsAction, pointsValue] = pointsChange.split(',');

        if (!isNaN(pointsValue) && driverIndex !== -1) {
            if (action === 'add') {
                updatedDrivers[driverIndex].points += parseInt(pointsValue, 10);
            } else if (action === 'reduce') {
                updatedDrivers[driverIndex].points -= parseInt(pointsValue, 10);
            }

            setPointsChange('');
            setDrivers(updatedDrivers);
        }
    };

    return (
        <section className="hero">
            <h2>Welcome to Your Point Dashboard</h2>
            <p>Welcome to your sponsor dashboard. Here you can access various features and information.</p>
            <h2>Points Adjustment</h2>

            <div className="driver-list">
                {drivers.map((driver, index) => (
                    <div key={index} className="driver-entry">
                        <div className="driver-info">
                            <h3>{driver.name}</h3>
                            <p>Points: {driver.points}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="points-adjustment">
                <select value={selectedDriver} onChange={(e) => setSelectedDriver(e.target.value)} className="driver-dropdown">
                    <option value="">Select a Driver</option>
                    {drivers.map((driver) => (
                        <option key={driver.name} value={driver.name}>
                            {driver.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    value={pointsChange}
                    onChange={(e) => {
                        if (/^\d+$/.test(e.target.value) || e.target.value === '') {
                            setPointsChange(e.target.value);
                        }
                    }}
                    placeholder="Enter points change (numbers only)"
                />
                <button onClick={() => handlePointsChange('add') } className="cta-nutton">Add</button>
                <button onClick={() => handlePointsChange('reduce')} className="cta-nutton">Reduce</button>
            </div>
        </section>
    );
}

export default SponsorPoints;
