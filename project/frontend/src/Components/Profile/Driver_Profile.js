import React from 'react';
import useAuth from '../../hooks/useAuth';

function DriverProfile() {
    const { auth } = useAuth();

    return (
        <section class="hero">
            <h2>Hello, {auth.Name}.</h2>
            <h2>Welcome to Your Profile</h2>
            <h1>My Profile</h1>
            <div class="profile-info">
                <p><strong>Username:</strong> {auth.Username}</p>
                <p><strong>Vehicle:</strong> Toyota Camry</p>
                <p><strong>Sponsor Company:</strong> ABC Motors</p>
                <p><strong>Phone Number:</strong> (123) 456-7890</p>
            </div>
        </section>
    );
}

export default DriverProfile;
