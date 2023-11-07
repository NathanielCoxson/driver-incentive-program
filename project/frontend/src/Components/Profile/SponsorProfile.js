import React from 'react';

function SponsorProfile(props) {
    return (
        <section className="hero">
            <h2>{props.sponsor?.Name}'s Profile</h2>
            <div className="profile-info">
                <p><strong>Role: </strong> {props.sponsor?.Role}</p>
                <p><strong>Username:</strong> {props.sponsor?.Username}</p>
                <p><strong>Sponsor Company:</strong> {props.sponsor?.SponsorName}</p>
                <p><strong>Email:</strong> {props.sponsor?.Email}</p>
            </div>
        </section>
    );
}

export default SponsorProfile;
