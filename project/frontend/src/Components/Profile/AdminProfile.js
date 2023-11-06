import React from 'react';
import useAuth from '../../hooks/useAuth';

function AdminProfile(props) {
    return (
        <section className="hero">
            <h2>Hello, {props.admin?.Name}.</h2>
            <h2>Welcome to Your's Profile Dashboard</h2>
            <h1>My Profile</h1>
            <div className="profile-info">
                <p><strong>Username:</strong> {props.admin?.Username}</p>
                <p><strong>Phone Number:</strong> (123) 456-7890</p>
            </div>
        </section>
    );
}

export default AdminProfile;
