import React from 'react';

function DriverProfile(props) {
    return (
        <section className="hero">
            <h2>{props.driver?.Name}'s Profile</h2>
            <div className="profile-info">
                <p><strong>Role: </strong> {props.driver?.Role}</p>
                <p><strong>Username:</strong> {props.driver?.Username}</p>
                <p><strong>Sponsor Company:</strong> {props.driver?.SponsorName}</p>
                <p><strong>Email:</strong> {props.driver?.Email}</p>
            
            </div>
        </section>
    );
}

export default DriverProfile;
