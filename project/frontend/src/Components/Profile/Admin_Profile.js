import React from 'react';

function AdminProfile() {
    const userName = "John Doe";
    return (
        <main>
            <div className="sidebar-container">
                <section class="hero">
                    <h2>Hello, {userName}.</h2>
                    <h2>Welcome to Your's Profile Dashboard</h2>
                    <h1>My Profile</h1>              
                    <div class="profile-info">
                        <p><strong>Username:</strong> JohnDoe123</p>
                        <p><strong>Phone Number:</strong> (123) 456-7890</p>
                    </div>
                </section>
            </div>
        </main>)
}

export default AdminProfile;
