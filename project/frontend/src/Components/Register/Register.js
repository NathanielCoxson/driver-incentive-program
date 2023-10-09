import './Register.css';
import { useEffect, useState } from 'react';

function Register() {
    const [responseMessage, setResponseMessage] = useState('');
    const [adminPinInput, setAdminPinInput] = useState(false);
    

    const baseURL = process.env.NODE_ENV === 'production' ?
        'http://34.225.199.196/api/users/register' :
        'http://localhost:3001/api/users/register';
    const passwordRequirementsMessage =
        'Password must be:\nat least eight characters long,\ncontain one uppercase letter,\none lowercase letter,\none number,\nand one special character.';

    /*
            Has minimum 8 characters in length. Adjust it by modifying {8,}
            At least one uppercase English letter. You can remove this condition by removing (?=.*?[A-Z])
            At least one lowercase English letter.  You can remove this condition by removing (?=.*?[a-z])
            At least one digit. You can remove this condition by removing (?=.*?[0-9])
            At least one special character,  You can remove this condition by removing (?=.*?[#?!@$%^&*-])
        */
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

    useEffect(() => {}, [adminPinInput]);

    function validateForm(form) {
        // const name = form.name.value;
        const role = form.role.value;
        const adminPin = form.adminPin ? form.adminPin.value : '';
        const password = form.password.value;
        const retypePassword = form.retypePassword.value;

        // Password validation rules (same as previous example)

        if (!password.match(passwordRegex)) {
            setResponseMessage(passwordRequirementsMessage);
            return false;
        }

        if (password !== retypePassword) {
            setResponseMessage("Passwords do not match.");
            return false;
        }

        // Additional validation for admin users
        if (role === 'admin') {
            if (!adminPin) {
                setResponseMessage("Admin Pin is required for admin users.")
                return false;
            }
            // You can add further validation for the admin pin here if needed.
        }

        return true;
    }

    // Submit handler function
    const handleSubmit = (event) => {
        // Prevent page reload on submit
        event.preventDefault();
        // Hide previous error message
        setResponseMessage('');
        
        const input = event.target;
        if (!validateForm(input)) return;

        // Construct user object
        let user = {
            Username: input.username.value,
            Password: input.password.value,
            Name: input.name.value,
            Role: input.role.value,
        };
        let url = input.adminPin ? `${baseURL}?AdminPin=${encodeURIComponent(input.adminPin.value)}` : baseURL;
        // Post to /api/users/register
        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user),
        })
        .then(res => {
            if (res.status === 400) setResponseMessage('Invalid Input')
            if (res.status === 409) setResponseMessage('Username already taken.');
            if (res.status === 201) setResponseMessage('Success!');
        })
        .catch(err => console.log(err));
    }

    const handleSelectChange = (event) => {
        setAdminPinInput(event.target.value === 'admin' ? true : false);
    }

    return (
        <main>
            <section className="register-section">
                <h2>Sign Up</h2>
                <form id="signInForm" onSubmit={handleSubmit}>
                    <div>
                        <label for="name">Name:</label>
                        <input type="text" id="name" name="name" required />
                    </div>

                    <div>
                        <label for="role">User Type:</label>
                        <select onChange={handleSelectChange} id="roel" name="role" required>
                            <option value="driver">Driver</option>
                            <option value="sponsor">Sponsor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {adminPinInput &&
                        <div id="adminPinSection">
                            <label for="adminPin">Admin Pin:</label>
                            <input type="password" id="adminPin" name="adminPin" />
                        </div>
                    }


                    <div>
                        <label for="username">Username:</label>
                        <input type="text" id="username" name="username" required />
                    </div>

                    <div>
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password" required />
                    </div>

                    <div>
                        <label for="retypePassword">Retype Password:</label>
                        <input type="password" id="retypePassword" name="retypePassword" required />
                    </div>

                    <div class="password-validation" id="passwordValidation">{responseMessage}</div>
                    <button type="submit" class="cta-button">Sign Up</button>
                </form>
            </section>
        </main>
    );
};

export default Register;