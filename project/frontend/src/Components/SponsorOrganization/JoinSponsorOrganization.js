import './JoinSponsorOrganization.css';
import { useState, useEffect } from 'react';

function JoinSponsorOrganization() {
    const [responseMessage, setResponseMessage] = useState('');
    const [Username, setUsername] = useState('');
    const [SponsorName, setSponsorName] = useState('');
    const [Reason, setReason] = useState('');
    const [options, setOptions] = useState([]);

    const baseURL = process.env.NODE_ENV === 'production'
        ? 'http://34.225.199.196/api'
        : 'http://localhost:3001/api';

    // Fetch sponsors from the database.
    useEffect(() => {
        const baseURL = process.env.NODE_ENV === 'production'
            ? 'http://34.225.199.196/api'
            : 'http://localhost:3001/api';
        fetch(`${baseURL}/sponsors`)
            .then(res => res.json())
            .then(res => {
                let newOptions = res.sponsors.map(sponsor => {
                    return {
                        value: sponsor.SponsorName,
                        label: sponsor.SponsorName
                    }
                });
                setOptions(newOptions);
                setSponsorName(newOptions[0].label);
            });
    }, []);

    function validateForm() {
        if (!Username || !Reason || !SponsorName) {
            setResponseMessage('All fields are required.');
            return false;
        }

        return true;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setResponseMessage('');

        if (!validateForm()) return;

        fetch(`${baseURL}/applications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Username, SponsorName, Reason }),
        })
            .then((res) => {
                // Status codes for setting response message.
                if (res.status === 400) setResponseMessage('Invalid Input');
                if (res.status === 404) setResponseMessage('User not found');
                if (res.status === 409) setResponseMessage("You've already submitted an application to that sponsor.")
                if (res.status === 201) setResponseMessage('Success!');
            })
            .catch((err) => console.log(err));
        // Clear the form when done.
        setUsername('');
        setReason('');
    };

    return (
        <section className="hero">
            <h2>Join Sponsor Organization</h2>
            <form id="joinSponsorForm" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        required
                        onChange={event => setUsername(event.target.value)}
                        value={Username}
                    />
                </div>

                <div>
                    <label htmlFor="reason">Reason for Applying:</label>
                    <textarea
                        id="reason"
                        name="reason"
                        rows="4"
                        required
                        onChange={event => setReason(event.target.value)}
                        value={Reason}
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="sponsorName">Sponsor Organization Name:</label>
                    <select
                        id="sponsorName"
                        name="sponsorName"
                        required
                        onChange={event => setSponsorName(event.target.value)}
                    >
                        {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                </div>

                <div className="response-message" id="responseMessage">
                    {responseMessage}
                </div>
                <button type="submit" className="cta-button">Join</button>
            </form>
        </section>
    );
}

export default JoinSponsorOrganization;
