import React, { useState } from 'react';
import './SponsorPoints.css';

function SponsorPoints() {
    const [drivers, setDrivers] = useState([
        { name: 'Driver 1', points: 100, reason: '' },
        { name: 'Driver 2', points: 75, reason: '' },
        { name: 'Driver 3', points: 120, reason: '' },
    ]);
    const [selectedDriver, setSelectedDriver] = useState('');
    const [pointsChange, setPointsChange] = useState('');
    const [reason, setReason] = useState('');
    const [showReasonInput, setShowReasonInput] = useState(false);

    const handlePointsChange = (action) => {
        const updatedDrivers = [...drivers];
        const driverIndex = drivers.findIndex((driver) => driver.name === selectedDriver);
        const [pointsAction, pointsValue] = pointsChange.split(',');

        if (!isNaN(pointsValue) && driverIndex !== -1) {
            if (action === 'add') {
                updatedDrivers[driverIndex].points += parseInt(pointsValue, 10);
            } else if (action === 'reduce') {
                updatedDrivers[driverIndex].points -= parseInt(pointsValue, 10);
                setShowReasonInput(true); // Show the reason input when reducing points
            }

            updatedDrivers[driverIndex].reason = reason; // Store the reason

            setPointsChange('');
            setReason('');
            setDrivers(updatedDrivers);
        }
    };

    return (
        <section className="hero">
            <h2>Welcome to Your Point Dashboard</h2>
            <p>Welcome to your sponsor dashboard. Here you can access various features and information.</p>
            <h2>Points Adjustment</h2>

            <div className="driver-list">
                <div className="points-container">
                    {drivers.map((driver, index) => (
                        <div key={index} className="driver-entry">
                            <div className="driver-info">
                                <h3>{driver.name}</h3>
                            </div>
                            <p>Points: {driver.points}</p>
                            {driver.reason && <p>Reason: {driver.reason}</p>}
                        </div>
                    ))}
                </div>
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
                <button onClick={() => handlePointsChange('add')} className="cta-button">Add</button>
                <button onClick={() => handlePointsChange('reduce')} className="cta-button">Reduce</button>
                {showReasonInput && (
                    <div>
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter reason"
                        />
                    </div>
                )}
            </div>
        </section>
    );
}

export default SponsorPoints;
