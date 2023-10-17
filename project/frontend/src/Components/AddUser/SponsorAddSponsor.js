import { useState } from 'react';

function SponsorAddSponsor() {
    const [responseMessage, setResponseMessage] = useState('');

    const baseURL = process.env.NODE_ENV === 'production'
        ? 'http://34.225.199.196/api/users/register' // Adjust the URL as needed
        : 'http://localhost:3001/api/users/register';

    const passwordRequirementsMessage =
        'Password must be:\n' +
        '- At least eight characters long\n' +
        '- Contain one uppercase letter\n' +
        '- Contain one lowercase letter\n' +
        '- Contain one number\n' +
        '- Contain one special character';

    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

    const handleSubmit = (event) => {
        event.preventDefault();
        setResponseMessage('');

        const input = event.target;

        const password = input.password.value;
        const retypePassword = input.retypePassword.value;

        if (!password.match(passwordRegex)) {
            setResponseMessage(passwordRequirementsMessage);
            return;
        }

        if (password !== retypePassword) {
            setResponseMessage("Passwords do not match.");
            return;
        }

        const user = {
            Username: input.username.value,
            Password: input.password.value,
            Name: input.name.value,
            Role: 'sponsor', // Set the role to 'sponsor' for sponsor-added sponsors
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
                if (res.status === 201) setResponseMessage('Sponsor added successfully!');
            })
            .catch((err) => console.log(err));
    };

    return (
        <section className="hero">
            <h2>Add Sponsor</h2>
            <p>Please register the sponsor you want to add to the system.</p>
            <form id="addSponsorForm" onSubmit={handleSubmit}>
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

                <div className="password-requirements">
                    <p>Password requirements:</p>
                    <ul>
                        <li> At least eight characters long</li>
                        <li> Contain one uppercase letter</li>
                        <li> Contain one lowercase letter</li>
                        <li> Contain one number</li>
                        <li> Contain one special character</li>
                    </ul>
                </div>

                <div className="password-validation" id="passwordValidation">
                    {responseMessage}
                </div>
                <button type="submit" className="cta-button">Add Sponsor</button>
            </form>
        </section>
    );
}

export default SponsorAddSponsor;
