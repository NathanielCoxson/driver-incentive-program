import './Register.css';
import { useEffect, useState } from 'react';
import axios from '../../api/axios';

function Register({ role }) {
    const [responseMessage, setResponseMessage] = useState('');
    const [adminPinInput, setAdminPinInput] = useState(false);
    const [vehicleInfo, setVehicleInfo] = useState(false); // Initialize as an empty object

    const passwordRequirementsMessage =
        'Password must be:\n' +
        '- At least eight characters long\n' +
        '- Contain one uppercase letter\n' +
        '- Contain one lowercase letter\n' +
        '- Contain one number\n' +
        '- Contain one special character';

    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

    useEffect(() => {}, [vehicleInfo]);
    useEffect(() => {}, [adminPinInput]);

    function validateForm(form) {
        const Role = role || form.role.value;
        const adminPin = form.adminPin ? form.adminPin.value : '';
        const vehicleInfo = form.vehicleInfo ? form.vehicleInfo.value : '';
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

        if (Role === 'admin') {
            if (!adminPin) {
                setResponseMessage("Admin Pin is required for admin users.");
                return false;
            }
        }

        if (Role === 'driver') {
            if (!vehicleInfo) {
                setResponseMessage("Driver need to enter vehicle information");
                return false;
            }
        }

        return true;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setResponseMessage('');

        const input = event.target;
        const Role = role ? role : input.role.value;

        if (!validateForm(input)) return;

        let user = {
            Username: input.username.value,
            Password: input.password.value,
            Name: input.name.value,
            Role: Role,
            Email: input.email.value,
            PhoneNumber: input.phoneNumber, // Added phone number
        };

        if (Role === 'driver') {
            user.VehicleInfo = vehicleInfo; // Added vehicle information for driver role
        }

        try {
            await axios.post('/users/register', user, {
                params: input.adminPin && {
                    AdminPin: input.adminPin.value,
                },
            });
            setResponseMessage('Success!');
        } catch (err) {
            if (!err?.response) {
                setResponseMessage('No Server Response');
            } else if (err.response?.status === 400) {
                setResponseMessage('Invalid Input');
            } else if (err.response?.status === 500) {
                setResponseMessage('Error creating your account. Please try again later.');
            } else if (err.response?.status === 409) {
                if (err.response.data === 'Email already taken') setResponseMessage('That email has already been taken.');
                if (err.response.data === 'Username already taken') setResponseMessage('That username has already been taken.');
            } else {
                setResponseMessage('Login Failed');
            }
        }
    }

    const handleSelectChange = (event) => {
        setAdminPinInput(event.target.value === 'admin');
        setVehicleInfo(event.target.value === 'driver');
    };


    return (
        <section className="hero">
            {role ? (
                <h2>Add {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
            ) : (
                <h2>Sign Up</h2>
            )}

            <form id="signInForm" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" required />
                </div>

                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="text" id="email" name="email" required />
                </div>

                <div>
                    <label htmlFor="PhoneNumber">Phone Number:</label>
                    <input type="text" id="PhoneNumber" name="PhoneNumber" required />
                </div>

                {!role && (
                    <div>
                        <label htmlFor="role">User Type:</label>
                        <select onChange={handleSelectChange} id="role" name="role" required >
                            <option value="driver">Driver</option>
                            <option value="sponsor">Sponsor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                )}

                {(adminPinInput || role === 'admin') && (
                    <div id="adminPinSection">
                        <label htmlFor="adminPin">Admin Pin:</label>
                        <input type="password" id="adminPin" name="adminPin" />
                    </div>
                )}
                
               

                {(vehicleInfo || role === 'driver') && (
                    <div>
                        <label htmlFor="vehicleInfo">Vehicle Information:</label>      
                        <input type="text" id="vehicleInfo" name="vehicleInfo" />
                    </div>
                )}


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

                <div className="password-validation" id="passwordValidation">{responseMessage}</div>
                <button type="submit" className="cta-button">Sign Up</button>
            </form>
        </section>
    );
}

export default Register;
