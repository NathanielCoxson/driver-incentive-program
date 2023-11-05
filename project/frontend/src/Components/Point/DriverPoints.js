import React, { useEffect, useState } from 'react';
import './DriverPoints.css';
import  axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';

function DriverPoints() {

    const [selectedOrganization, setSelectedOrganization] = useState('');
    const [points, setPoints] = useState(0);
    const { auth } = useAuth();
    const Sponsors = auth?.sponsors;
    const Username = auth?.Username;
    const sponsorOrganizations = Sponsors.map((s) => {
        let org = {
            id: s.SID,
            name: s.SponsorName,
            points: 0
        };
        return org;
    });

    // Handle organization selection
    const handleOrganizationChange = async (event) => {
        const selectedOrgName = event.target.value;
        setSelectedOrganization(selectedOrgName);

        if (selectedOrgName === '') {
            // When "No Organization" is selected
            setPoints(0);
        } else {
            try{
                // Find the points for the selected organization
                const request = {
                    SponsorName: selectedOrgName,
                    Username: Username,
                };
                const response = await axios.post('transactions/points', request);
                setPoints(response ? response.data.points[0].Points : 0);
            }
            catch(err){
                if (process.env.NODE_ENV === 'development');
                    console.log("Error retrieving points: ",err);
            }
        }
    };

    const hasOrganizations = sponsorOrganizations.length > 0;

    return (
        <section className="hero">
            <h2>Welcome to Your Point Dashboard</h2>
            <p>Welcome to your driver dashboard. Here you can access various features and information.</p>
            <h2>Points</h2>

            <div className="points-info">
                <div className="organization-dropdown">
                    <label htmlFor="organizationSelect">Select Organization: </label>
                    <select id="organizationSelect" value={selectedOrganization} onChange={handleOrganizationChange}>
                        <option value="">No Organization</option>
                        {hasOrganizations && sponsorOrganizations.map((organization) => (
                            <option key={organization.id} value={organization.name}>
                                {organization.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedOrganization === '' && (
                    <p>Please join an organization</p>
                )}

                {selectedOrganization && (
                    <p>You have <strong>{points}</strong> Points for {selectedOrganization}</p>
                )}
            </div>
        </section>
    );
}

export default DriverPoints;
