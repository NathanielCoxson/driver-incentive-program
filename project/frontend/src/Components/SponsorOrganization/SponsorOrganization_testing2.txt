import React, { useState } from 'react';
import './SponsorOrganization.css';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function SponsorOrganization() {
    const { auth } = useAuth();

    // Simulated organization data, replace with actual data
    const sponsorOrganizations = [
        { id: 1, name: 'Organization 1', profile: 'Profile for Organization 1' },
        { id: 2, name: 'Organization 2', profile: 'Profile for Organization 2' },
        { id: 3, name: 'Organization 3', profile: 'Profile for Organization 3' },
    ];

    const [selectedOrganization, setSelectedOrganization] = useState('');
    const [organizationProfile, setOrganizationProfile] = useState('');

    // Handle organization selection
    const handleOrganizationChange = (event) => {
        const selectedOrgName = event.target.value;
        setSelectedOrganization(selectedOrgName);

        // Find the profile for the selected organization
        const profile = sponsorOrganizations.find((org) => org.name === selectedOrgName)?.profile;
        setOrganizationProfile(profile || '');
    };

    return (
        <section className="hero">
            <h2>Welcome to Your Sponsor Organization Dashboard</h2>
            <div className="sponsor-info">
                {auth?.Role === 'driver' && auth?.HasSponsorOrganization ? (
                    <>
                        <p>Select Your Sponsor Organization:</p>
                        <select value={selectedOrganization} onChange={handleOrganizationChange} className="sponsor-organization-dropdown">
                            <option value="">Select an Organization</option>
                            {sponsorOrganizations.map((organization) => (
                                <option key={organization.id} value={organization.name}>
                                    {organization.name}
                                </option>
                            ))}
                        </select>
                    </>
                ) : (
                    <p>Please join an organization</p>
                )}

                {selectedOrganization && (
                    <div className="organization-profile">
                        <h3>Organization Profile:</h3>
                        <p>{organizationProfile}</p>
                    </div>
                )}

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
