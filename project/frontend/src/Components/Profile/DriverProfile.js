import React from 'react';
import useAuth from '../../hooks/useAuth';

function DriverProfile(props) {
    return (
        <section className="hero">
            <h2>Hello, {props.driver?.Name}.</h2>
            <h2>Welcome to Your Profile</h2>
            <h1>My Profile</h1>
            <div className="profile-info">
                <p><strong>Username:</strong> {props.driver?.Username}</p>
                <p><strong>Vehicle:</strong> {props.driver?.vehicleInfo}</p>
                <p><strong>Sponsor Company:</strong> {props.driver?.SponsorOrganization}</p>
                <p><strong>Email:</strong> {props.driver?.Email}</p>
            
            </div>
        </section>
    );
}

export default DriverProfile;
