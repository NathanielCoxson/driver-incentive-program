import React from 'react';

function SponsorProfile(props) {
    return (
        <section className="hero">
            <h2>{props.sponsor?.Name}'s Profile</h2>
            <div className="profile-info">
                <p><strong>Username:</strong> {props.sponsor?.Username}</p>
                <p><strong>Sponsor Company:</strong> ABC Motors</p>
                <p><strong>Email:</strong> example@email.com</p>
            </div>
        </section>
    );
}

export default SponsorProfile;
