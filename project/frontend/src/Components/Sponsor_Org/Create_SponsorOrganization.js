import './CreateSponsorOrganization.css';
import { useState } from 'react';

function CreateSponsorOrganization() {
    const [organizationName, setOrganizationName] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const baseURL = process.env.NODE_ENV === 'production'
        ? 'http://your-production-api-url'
        : 'http://localhost:3001/api/create-org';

    function handleSubmit(event) {
        event.preventDefault();
        setResponseMessage('');

        // Validate the form data if needed

        const organizationData = {
            OrganizationName: organizationName,
            // Add other fields as needed
        };

        fetch(baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(organizationData),
        })
        .then((res) => {
            if (res.status === 400) setResponseMessage('Invalid Input');
            if (res.status === 201) setResponseMessage('Success!');
        })
        .catch((err) => console.log(err));
    }

    return (
        <main>
            <section className="hero">
                <h2>Create Sponsor Organization</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="organizationName">Organization Name:</label>
                        <input
                            type="text"
                            id="organizationName"
                            name="organizationName"
                            required
                            value={organizationName}
                            onChange={(e) => setOrganizationName(e.target.value)}
                        />
                    </div>

                    {/* Add other form fields here as needed */}

                    <div className="response-message" id="responseMessage">
                        {responseMessage}
                    </div>
                    <button type="submit" className="cta-button">Create</button>
                </form>
            </section>
        </main>
    );
}

export default CreateSponsorOrganization;
