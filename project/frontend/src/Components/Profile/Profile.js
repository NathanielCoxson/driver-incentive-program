
function Profile() {
    const userName = "John Doe";
    return (
        <main>
            <section class="hero">
                <h2>Hello, {userName}.</h2>
                <h1>My Profile</h1>              
                <div class="profile-info">
                    <p><strong>Username:</strong> JohnDoe123</p>
                    <p><strong>Vehicle:</strong> Toyota Camry</p>
                    <p><strong>Sponsor Company:</strong> ABC Motors</p>
                    <p><strong>Phone Number:</strong> (123) 456-7890</p>
                </div>
                
            </section>
        </main>)
}

export default Profile;
