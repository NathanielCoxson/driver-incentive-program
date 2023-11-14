import React, { useState, useEffect } from 'react';
import  axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import './SponsorPoints.css';

function SponsorPoints() {
    const { auth } = useAuth();
    /* const [drivers, setDrivers] = useState([
        { name: 'Driver 1', points: 100, reason: '' },
        { name: 'Driver 2', points: 75, reason: '' },
        { name: 'Driver 3', points: 120, reason: '' },
    ]); */
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState('');
    const [pointsChange, setPointsChange] = useState('');
    const [reason, setReason] = useState('');

    useEffect(() => {
        const updateDrivers = async() => {
            try {
                const response = await axios.get("applications/drivers/" + auth?.sponsors[0]?.SponsorName);
                if(response){
                    const apps = [];
                    for (const res of response.data){
                        const request = {
                            SponsorName: auth?.sponsors[0]?.SponsorName,
                            Username: res.Username,
                        };
                        let pointsResponse = null;
                        let p = 0;
                        try{
                            pointsResponse = await axios.post("transactions/points", request);
                            p = pointsResponse.data.points[0].Points;
                        }
                        catch(err){
                            if(err.response.status === 404)
                                p = 0;
                        }
                        const curDriver = {
                            name: res.Name,
                            username: res.Username,
                            points: p? p : 0
                        };
                        apps.push(curDriver);
                    }
                    setDrivers(apps);
                }
            } catch (err) {
                console.error("Error fetching drivers: ", err);
            }
        };
        updateDrivers();
    }, [drivers, auth?.sponsors]);

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
                <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason"
                />
                <button onClick={() => handlePointsChange('add')} className="cta-button">Add</button>
                <button onClick={() => handlePointsChange('reduce')} className="cta-button">Reduce</button>
            </div>
        </section>
    );
}

export default SponsorPoints;
