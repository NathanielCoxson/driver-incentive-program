import React, { useState } from 'react';
import './DriverPoints.css';

function DriverPoints() {
    // Simulated organization data, replace with actual data
    const sponsorOrganizations = [
        { id: 1, name: 'Organization 1', points: 100 },
        { id: 2, name: 'Organization 2', points: 200 },
        { id: 3, name: 'Organization 3', points: 150 },
    ];

    const [selectedOrganization, setSelectedOrganization] = useState('');
    const [points, setPoints] = useState(0);

    // Handle organization selection
    const handleOrganizationChange = (event) => {
        const selectedOrgName = event.target.value;
        setSelectedOrganization(selectedOrgName);

        // Find the points for the selected organization
        const organization = sponsorOrganizations.find((org) => org.name === selectedOrgName);
        setPoints(organization ? organization.points : 0);
    };

    const hasOrganizations = sponsorOrganizations.length > 0;

    return (
        <section className="hero">
            <h2>Welcome to Your Point Dashboard</h2>
            <p>Welcome to your driver dashboard. Here you can access various features and information.</p>
            <h2>Points</h2>

            <div className="points-info">
                {hasOrganizations && (
                    <div className="organization-dropdown">
                        <label htmlFor="organizationSelect">Select Organization: </label>
                        <select id="organizationSelect" value={selectedOrganization} onChange={handleOrganizationChange}>
                            {hasOrganizations ? (
                                <option value="">No Organization</option>
                            ) : null}
                            {sponsorOrganizations.map((organization) => (
                                <option key={organization.id} value={organization.name}>
                                    {organization.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedOrganization && (
                    <p>You have <strong>{points}</strong> Points for {selectedOrganization}</p>
                )}
            </div>
        </section>
    );
}

export default DriverPoints;
