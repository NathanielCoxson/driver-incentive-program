import React from 'react';

function DriverProfile(props) {
    return (
        <section className="hero">
            <h2>{props.driver?.Name}'s Profile</h2>
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
