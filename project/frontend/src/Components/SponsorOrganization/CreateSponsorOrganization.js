import './CreateSponsorOrganization.css';
import { useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

function CreateSponsorOrganization() {
    const [organizationName, setOrganizationName] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const axiosPrivate = useAxiosPrivate();

    async function handleSubmit(event) {
        event.preventDefault();
        setResponseMessage(''); 

        // Validate the form data if needed

        const organizationData = {
            SponsorName: organizationName,
            // Add other fields as needed
        };

        try {
            await axiosPrivate.post('/sponsors', organizationData);
            setResponseMessage('Success!');
        } catch (err) {
            if(process.env.NODE_ENV === 'development') console.log(err);
            if (!err?.response) {
                setResponseMessage('No Server Response');
            }
            else if (err.response?.status === 409) {
                setResponseMessage('Sponsor name already taken.')
            }
        }
    }

    return (
        <section className="hero">
            <h2>Create Sponsor Organization</h2>
            <form onSubmit={handleSubmit} className='create-sponsor-form'>
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
    );
}

export default CreateSponsorOrganization;
