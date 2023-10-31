import React from 'react';
import useAuth from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import  axios from '../../api/axios';

function EditProfile() {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [responseMessage, setResponseMessage] = useState('');

    const passwordRequirementsMessage =
        'Password must be:\n' +
        '- At least eight characters long\n' +
        '- Contain one uppercase letter\n' +
        '- Contain one lowercase letter\n' +
        '- Contain one number\n' +
        '- Contain one special character';

    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

    function validateForm(form) {
        const password = form.password.value;
        const retypePassword = form.retypePassword.value;

        if (!password.match(passwordRegex)) {
            setResponseMessage(passwordRequirementsMessage);
            form.password.value = ""
            form.retypePassword.value = ""
            return false;
        }

        if (password !== retypePassword) {
            setResponseMessage("Passwords do not match.");
            form.password.value = ""
            form.retypePassword.value = ""
            return false;
        }

        return true;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setResponseMessage('');

        const input = event.target;

        if (!validateForm(input)) return;

        let user = {
            Username: auth.Username,
            Password: input.password.value,
            Name: input.name.value,
            Email: input.email.value,
            PhoneNumber: input.phoneNumber
        };

        try {
            await axios.post('/users/edit-profile', user);
            auth.Password = user.Password
            auth.Name = user.Name
            auth.Email = user.Email
            auth.PhoneNumber = user.PhoneNumber
            setResponseMessage('Profile successfully updated!');
            navigate('/dashboard/profile', { replace: true })
        } catch (err) {
            if (!err?.response) {
                setResponseMessage('No Server Response');
            } else if (err.response?.status === 400) {
                setResponseMessage('Invalid Input');
            } else if (err.response?.status === 500) {
                setResponseMessage('Error updating your account. Please try again later.');
            } else if (err.response?.status === 409) {
                if (err.response.data === 'Email already taken') setResponseMessage('This email already has an account associated with it.');
            } else {
                setResponseMessage('Submission Failed');
            }
        }
    }

    return (
        <section className="hero">
            <h2>Hello, {auth?.Name}.</h2>
            <h2>Edit your profile</h2>
            <div className="profile-info">
                <form id="editProfile" onSubmit={handleSubmit}>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" required />
                    
                    <label htmlFor="email">Email:</label>
                    <input type="text" id="email" name="email" required />
                    
                    <label htmlFor="PhoneNumber">Phone Number:</label>
                    <input type="text" id="PhoneNumber" name="PhoneNumber" required />
                    
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />

                    <label htmlFor="retypePassword">Retype Password:</label>
                    <input type="password" id="retypePassword" name="retypePassword" required />
                    
                    <div className="password-validation" id="passwordValidation">{responseMessage}</div>
                    <button type="submit" className="cta-button">Submit Update</button>
                    <div>
                        <button><Link to="/profile">Cancel</Link></button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default EditProfile;
