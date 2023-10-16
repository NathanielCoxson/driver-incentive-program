import './Sponsor_AddUser.css';
import { useState } from 'react';

function SponsorAddDriver() {
    const [responseMessage, setResponseMessage] = useState('');

    const baseURL = process.env.NODE_ENV === 'production'
        ? 'http://34.225.199.196/api/users/register' // Adjust the URL as needed
        : 'http://localhost:3001/api/users/register';

    // This function handles form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        setResponseMessage('');

        const input = event.target;

        // Validate the form data if needed

        const user = {
            Username: input.username.value,
            Password: input.password.value,
            Name: input.name.value,
            Role: 'driver', // Set the role to 'driver' for sponsor-added drivers
            Email: input.email.value,
        };

        fetch(baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
        .then((res) => {
            if (res.status === 400) setResponseMessage('Invalid Input');
            if (res.status === 201) setResponseMessage('Driver added successfully!');
        })
        .catch((err) => console.log(err));
    };

    return (
        <main>
            <div className="sidebar-container">
                <SponsorSidebar /> {/* Include the DriverSidebar component here */}
                <section className="hero">
                    <h2>Add Driver</h2>
                    <form id="addDriverForm" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name">Name:</label>
                            <input type="text" id="name" name="name" required />
                        </div>

                        <div>
                            <label htmlFor="email">Email:</label>
                            <input type="text" id="email" name="email" required />
                        </div>

                        <div>
                            <label htmlFor="username">Username:</label>
                            <input type="text" id="username" name="username" required />
                        </div>

                        <div>
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" name="password" required />
                        </div>

                        <div>
                            <label htmlFor="retypePassword">Retype Password:</label>
                            <input type="password" id="retypePassword" name="retypePassword" required />
                        </div>

                        <div className="password-validation" id="passwordValidation">
                            {responseMessage}
                        </div>
                        <button type="submit" className="cta-button">Add Driver</button>
                    </form>
                </section>
            </div>
        </main>
    );
}

export default SponsorAddDriver;
