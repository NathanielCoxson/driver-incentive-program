import React from 'react';
import DriverSidebar from '../Sidebar/Driver_Sidebar';
import useAuth from '../../hooks/useAuth';

function Profile() {
    const { auth } = useAuth();

    return (
        <main>
            <div className="sidebar-container">
                <DriverSidebar /> 
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
            </div>
        </main>)
}

export default Profile;
