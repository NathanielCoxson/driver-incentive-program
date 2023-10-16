import './Join_SponsorOrganization.css';
import { useState } from 'react';

function JoinSponsorOrganization() {
    const [responseMessage, setResponseMessage] = useState('');

    const baseURL = process.env.NODE_ENV === 'production'
        ? 'http://34.225.199.196/api/users/join-sponsor'
        : 'http://localhost:3001/api/users/join-sponsor';

    function validateForm(form) {
        const username = form.username.value;
        const reason = form.reason.value;
        const organization = form.organization.value;

        if (!username || !reason || !organization) {
            setResponseMessage('All fields are required.');
            return false;
        }

        return true;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setResponseMessage('');

        const input = event.target;
        if (!validateForm(input)) return;

        const user = {
            Username: input.username.value,
            Reason: input.reason.value,
            Organization: input.organization.value,
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
                if (res.status === 201) setResponseMessage('Success!');
            })
            .catch((err) => console.log(err));
    };

    return (
        <main>
            <section className="hero">
                <h2>Join Sponsor Organization</h2>
                <form id="joinSponsorForm" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" name="username" required />
                    </div>

                    <div>
                        <label htmlFor="reason">Reason for Applying:</label>
                        <textarea
                            id="reason"
                            name="reason"
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="organization">Sponsor Organization Name:</label>
                        <select id="organization" name="organization" required>
                            <option value="sponsor-org-1">Sponsor Organization 1</option>
                            <option value="sponsor-org-2">Sponsor Organization 2</option>
                            <option value="sponsor-org-3">Sponsor Organization 3</option>
                        </select>
                    </div>

                    <div className="response-message" id="responseMessage">
                        {responseMessage}
                    </div>
                    <button type="submit" className="cta-button">Join</button>
                </form>
            </section>
        </main>
    );
}

export default JoinSponsorOrganization;
