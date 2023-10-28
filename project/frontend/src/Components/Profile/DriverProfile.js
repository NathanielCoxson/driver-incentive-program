import React from 'react';
import useAuth from '../../hooks/useAuth';

function DriverProfile() {
    const { auth } = useAuth();

    return (
        <section className="hero">
            <h2>Hello, {auth?.Name}.</h2>
            <h2>Welcome to Your Profile</h2>
            <h1>My Profile</h1>
            <div className="profile-info">
                <p><strong>Username:</strong> {auth?.Username}</p>
                <p><strong>Vehicle:</strong> {auth?.vehicleInfo}</p>
                <p><strong>Sponsor Company:</strong> {auth?.SponsorOrganization}</p>
                <p><strong>Email:</strong> {auth?.Email}</p>
            
            </div>
        </section>
    );
}

export default DriverProfile;
