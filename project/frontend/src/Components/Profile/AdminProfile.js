import React from 'react';
import useAuth from '../../hooks/useAuth';

function AdminProfile(props) {
    return (
        <section className="hero">
            <h2>{props.admin?.Name}'s Profile</h2>
            <div className="profile-info">
                <p><strong>Role: </strong> {props.admin?.Role}</p>
                <p><strong>Username:</strong> {props.admin?.Username}</p>
                <p><strong>Email:</strong> {props.admin?.Email}</p>
            </div>
        </section>
    );
}

export default AdminProfile;
