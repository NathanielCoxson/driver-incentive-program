import React, { useState } from 'react';
import './SponsorOrganization.css';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function SponsorOrganization() {
    const { auth } = useAuth();

    // Simulated organization data, replace with actual data
    const sponsorOrganizations = [
        { id: 1, name: 'Organization 1' },
        { id: 2, name: 'Organization 2' },
        { id: 3, name: 'Organization 3' },
    ];

    const [selectedOrganization, setSelectedOrganization] = useState('');

    // Handle organization selection
    const handleOrganizationChange = (event) => {
        setSelectedOrganization(event.target.value);
    };

    return (
        <section className="hero">
            <h2>Welcome to Your Sponsor Organization Dashboard</h2>
            <div className="sponsor-info">
                {auth?.Role === 'driver' ? (
                    <>
                        <p>Select Your Sponsor Organization:</p>
                        <select value={selectedOrganization} onChange={handleOrganizationChange} className="sponsor-organization-dropdown">
                            <option value="">Select an Organization</option>
                            {sponsorOrganizations.map((organization) => (
                                <option key={organization.id} value={organization.name}>
                                    {organization.name}
                                </option>
                            ))}
                            <option value="Please join an organization">Please join an organization</option>
                        </select>
                    </>
                ) : null}

                <p>Looking for a Sponsor?</p>
                <Link to="../join_sponsor_organization" className="cta-button">
                    Join a Sponsor Organization
                </Link>

                {auth?.Role === 'sponsor' && (
                    <>
                        <p>Or Create Your Own:</p>
                        <Link to="../create_sponsor_organization" className="cta-button">
                            Create A Sponsor Organization
                        </Link>
                    </>
                )}
            </div>
        </section>
    );
}

export default SponsorOrganization;
