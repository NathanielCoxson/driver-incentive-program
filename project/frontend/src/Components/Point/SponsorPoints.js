import React, { useState, useEffect, useCallback } from 'react';
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
    const [driverErr, setDriverErr] = useState(false);
    const [pointsErr, setPointsErr] = useState(false);
    const [reasonErr, setReasonErr] = useState(false);
    const [success, setSuccess] = useState('');
    const SponsorName = auth?.sponsors[0]?.SponsorName;
    const SID = auth?.sponsors[0]?.SID;

    const updateDrivers = useCallback( async() => {
        try {
            const response = await axios.get(`applications/drivers/${SponsorName}`);
            if(response){
                const d = response.data.map((res) => {
                    const curDriver = {
                        name: res.Name,
                        username: res.Username,
                        UID: res.UID,
                        points: res.Points
                    };
                    return curDriver;
                });
                setDrivers(d);
            }
        } catch (err) {
            if (process.env.NODE_ENV === 'development') console.error("Error fetching drivers: ", err);
        }
    }, [auth?.sponsors]);
    
    useEffect(() => {
        updateDrivers();
    }, [updateDrivers]);

    const handlePointsChange = async() => {
        const points = parseInt(pointsChange);
        if(!(selectedDriver === '') && !(isNaN(points)) && !(reason === '')){
            try{
                const tDate = new Date();
                const transaction = {
                    UID: selectedDriver,
                    SID: SID,
                    TransactionDate: (tDate).toISOString().slice(0, 19).replace('T', ' '),
                    TransactionAmount: points,
                    Reason: reason
                }
                const response = await axios.post("transactions", transaction);
                updateDrivers();
                setSelectedDriver('');
                setPointsChange('');
                setReason('');
                setSuccess('success');
            }
            catch(err){
                if (process.env.NODE_ENV === 'development') console.log("Error adding transaction: ", err);
                setSuccess('fail');
            }
        }
        else{
            setSuccess('fail');
        }
        setDriverErr(selectedDriver === '');
        setPointsErr(isNaN(points));
        setReasonErr(reason === '');
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
                        <option key={driver.name} value={driver.UID}>
                            {driver.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    value={pointsChange}
                    onChange={(e) => {
                        if (/^\-?$|^\-?[\d]+$/.test(e.target.value) || e.target.value === '') {
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
                <button onClick={() => handlePointsChange()} className="cta-button">Post</button>

                {success === 'success' && (
                    <p><strong>Point adjustment successful.</strong></p>
                )}

                {success === 'fail' && (
                    <p><strong>Point adjustment unsuccessful. Some problem occured.</strong></p>
                )}

                {driverErr && (
                    <p>Please select a driver.</p>
                )}

                {pointsErr && (
                    <p>Please enter a valid point value.</p>
                )}

                {reasonErr && (
                    <p>Please enter a reason.</p>
                )}

            </div>
        </section>
    );
}

export default SponsorPoints;
