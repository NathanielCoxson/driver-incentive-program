import './Admin_AddUser.css'; // Update the CSS import
import AdminSidebar from '../Sidebar/Admin_Sidebar';
import { useState } from 'react';

function AdminAddAdmin() { // Update the component name
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

    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}/;

    function validateForm(form) {
        const password = form.password.value;
        const retypePassword = form.retypePassword.value;

        if (!password.match(passwordRegex)) {
            setResponseMessage(passwordRequirementsMessage);
            return false;
        }

        if (password !== retypePassword) {
            setResponseMessage("Passwords do not match.");
            return false;
        }

        return true;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setResponseMessage('');

        const input = event.target;
        if (!validateForm(input)) return;

        let user = {
            Username: input.username.value,
            Password: input.password.value,
            Name: input.name.value,
            Role: 'admin', // Set the role to 'admin' for admin-added admins
            Email: input.email.value,
        };
        let url = `${baseURL}?AdminPin=${encodeURIComponent(input.adminPin.value)}`;
        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user),
        })
        .then(res => {
            if (res.status === 400) setResponseMessage('Invalid Input');
            if (res.status === 500) setResponseMessage('Error creating your account. Please try again later.');
            if (res.status === 201) setResponseMessage('Success!');
            return res.json();
        })
        .then(res => {
            if (res) {
                if (res === 'Email already taken') setResponseMessage('That email has already been taken.');
                if (res === 'Username already taken') setResponseMessage('That username has already been taken.');
            }
        })
        .catch(err => console.log(err));
    }

    return (
        <main>
            <div className="sidebar-container">
                <AdminSidebar />
                <section className="hero">
                    <h2>Add Admin</h2>
                    <p>Please register the admin user you want to add to the system.</p>
                    <form id="addAdminForm" onSubmit={handleSubmit}>
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

                        <div>
                            <label htmlFor="adminPin">Admin Pin:</label>
                            <input type="password" id="adminPin" name="adminPin" required />
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
                        <button type="submit" className="cta-button">Add Admin</button>
                    </form>
                </section>
            </div>
        </main>
    );
}

export default AdminAddAdmin;
