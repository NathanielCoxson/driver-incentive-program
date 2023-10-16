import React from 'react';
import SponsorSidebar from '../Sidebar/Sponsor_sidebar';

function SponsorProfile() {
    const userName = "John Doe";
    return (
        <main>
            <div className="sidebar-container">
                <SponsorSidebar /> 
                <section class="hero">
                    <h2>Hello, {userName}.</h2>
                    <h2>Welcome to Your's Profile Dashboard</h2>
                    <h1>My Profile</h1>              
                    <div class="profile-info">
                        <p><strong>Username:</strong> JohnDoe123</p>
                        <p><strong>Sponsor Company:</strong> ABC Motors</p>
                        <p><strong>Phone Number:</strong> (123) 456-7890</p>
                    </div>
                </section>
            </div>
        </main>)
}

export default SponsorProfile;
