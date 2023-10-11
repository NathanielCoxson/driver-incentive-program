import React, { useState } from 'react';
import './ResetPassword.css';

function ResetPassword() {
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
    const username = form.username.value;
    const newPassword = form.newPassword.value;
    const retypePassword = form.retypePassword.value;

    if (!newPassword.match(passwordRegex)) {
      setResponseMessage(passwordRequirementsMessage);
      return false;
    }

    if (newPassword !== retypePassword) {
      setResponseMessage('Passwords do not match.');
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
      Password: input.newPassword.value,
      // Additional fields here
    };

    // Your API request here

    // Example:
    fetch('/api/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((res) => {
        if (res.status === 400) setResponseMessage('Invalid Input');
        if (res.status === 409) setResponseMessage('Username already taken.');
        if (res.status === 201) setResponseMessage('Success!');
      })
      .catch((err) => console.log(err));
  };

  return (
    <main>
      <section className="hero">
        <h2>Password Reset</h2>
        <form id="resetForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className="form-group">
            <label for="newPassword">New Password:</label>
            <input type="password" id="newPassword" name="newPassword" required />
          </div>
          <div className="form-group">
            <label for="retypePassword">Retype Password:</label>
            <input type="password" id="retypePassword" name="retypePassword" required />
          </div>
          <div className="password-requirements">
            <p>Password requirements:</p>
            <ul>
              <li>At least eight characters long</li>
              <li>Contain one uppercase letter</li>
              <li>Contain one lowercase letter</li>
              <li>Contain one number</li>
              <li>Contain one special character</li>
            </ul>
          </div>
          <div className="password-validation" id="passwordValidation">
            {responseMessage}
          </div>
          <button type="submit" className="cta-button">Submit</button>
        </form>
      </section>
    </main>
  );
}

export default ResetPassword;
