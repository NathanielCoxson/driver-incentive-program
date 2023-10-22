import React, { useState } from 'react';
import './SponsorPoints.css';

function SponsorPoints() {
    const [pointsChange, setPointsChange] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    // Function to handle the form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Split the pointsChange string into its components
        const [action, points, driver] = pointsChange.split(',');

        // Validate the input
        if (!['add', 'reduce'].includes(action)) {
            setResponseMessage('Invalid action. Use "add" or "reduce".');
        } else if (isNaN(points) || points === '') {
            setResponseMessage('Points must be a number.');
        } else if (!driver) {
            setResponseMessage('Driver name is required.');
        } else {
            // Example: Send a request to your server with action, points, and driver
            // You can use an API or other communication method to perform this action

            // After successful points adjustment, clear the form and display a success message
            setPointsChange('');
            setResponseMessage(`Points ${action}ed successfully for ${driver}.`);
        }
    };

    return (
        <section className="hero">
            <h2>Welcome to Your Point Dashboard</h2>
            <p>Welcome to your sponsor dashboard. Here you can access various features and information.</p>
            <h2>Points Adjustment</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="pointsChange">Points Change (e.g., add,10,Driver Name):</label>
                    <input
                        type="text"
                        id="pointsChange"
                        name="pointsChange"
                        value={pointsChange}
                        onChange={(e) => setPointsChange(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="cta-button">
                    Submit Change
                </button>
            </form>
            {responseMessage && <p>{responseMessage}</p>}
        </section>
    );
}

export default SponsorPoints;
