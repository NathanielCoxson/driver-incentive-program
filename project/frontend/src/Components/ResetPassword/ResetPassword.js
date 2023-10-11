import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './ResetPassword.css';

function ResetPassword() {
  const [responseMessage, setResponseMessage] = useState('');
  const [token, setToken] = useState('');
  const [params, setParams] = useSearchParams();

  const baseURL = process.env.NODE_ENV === 'production' ?
        'http://34.225.199.196' :
        'http://localhost:3001';

  const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

  const passwordRequirementsMessage =
    'Password must be:\n' +
    '- At least eight characters long\n' +
    '- Contain one uppercase letter\n' +
    '- Contain one lowercase letter\n' +
    '- Contain one number\n' +
    '- Contain one special character';

  function validateForm(form) {
    const email = form.email.value;
    const newPassword = form.newPassword.value;
    const retypePassword = form.retypePassword.value;

    if (!passwordRegex.test(newPassword)) {
      setResponseMessage(passwordRequirementsMessage);
      return false;
    }

    if (!emailRegex.test(email)) {
      setResponseMessage('Invalid email address.')
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

    let passwordUpdate = {
      Email: input.email.value,
      Password: input.newPassword.value,
      Token: params.get('token'),
    };
    console.log(passwordUpdate);

    // Your API request here

    // Example:
    // fetch('/api/reset-password', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(user),
    // })
    //   .then((res) => {
    //     if (res.status === 400) setResponseMessage('Invalid Input');
    //     if (res.status === 409) setResponseMessage('Username already taken.');
    //     if (res.status === 201) setResponseMessage('Success!');
    //   })
    //   .catch((err) => console.log(err));
  };

  const handleEmailRequest = (event) => {
    event.preventDefault();
    if (!emailRegex.test(event.target.email.value)) {
      setResponseMessage('Invalid email address.')
    }

    const request = {
      Email: event.target.email.value
    }

    // Send request for an email to the server
    fetch(`${baseURL}/api/users/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })
      .then(res => {
        if (res.status === 202) setResponseMessage('An email has been sent to you with a link to reset your password.')
        else setResponseMessage('Error requesting password reset email.')
      });
  };

  return (
    <main>
      <section className="hero">
        <h2>Password Reset</h2>
        {params.get('token') ?
          <form id="resetForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label for="email">Email:</label>
              <input type="text" id="email" name="email" required />
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
            <div className="response-message" id="response-message">
              {responseMessage}
            </div>
            <button type="submit" className="cta-button">Submit</button>
          </form>
          :
          <form id="resetForm" onSubmit={handleEmailRequest}>
            <div className="form-group">
              <label for="email">Email:</label>
              <input type="text" id="email" name="email" required />
            </div>
            <div className="response-message" id="response-message">
              {responseMessage}
            </div>
            <button type="submit" className="cta-button">Submit</button>
          </form>
        }
      </section>
    </main>
  );
}

export default ResetPassword;
