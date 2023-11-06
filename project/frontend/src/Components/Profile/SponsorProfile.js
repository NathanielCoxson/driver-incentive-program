import React from 'react';
import useAuth from '../../hooks/useAuth';

function SponsorProfile(props) {
    return (
        <section className="hero">
            <h2>Hello, {props.sponsor?.Name}.</h2>
            <h2>Welcome to Your's Profile Dashboard</h2>
            <h1>My Profile</h1>
            <div className="profile-info">
                <p><strong>Username:</strong> {props.sponsor?.Username}</p>
                <p><strong>Sponsor Company:</strong> ABC Motors</p>
                <p><strong>Email:</strong> example@email.com</p>
            </div>
        </section>
    );
}

export default SponsorProfile;
