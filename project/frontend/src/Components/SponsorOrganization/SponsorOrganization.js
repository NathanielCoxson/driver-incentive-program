import React, { useState } from 'react';
import './SponsorOrganization.css';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function SponsorOrganization() {
    const { auth } = useAuth();
    const sponsors = auth?.sponsors;

    return (
        <section className="hero">
            <h2>Welcome to Your Sponsor Organization Dashboard</h2>
            <div className="sponsor-info">
                {auth?.Role === 'driver' && auth?.sponsors.length >= 0 ? (
                    <>
                        <p>Your Sponsor Organizations:</p>
                        <ol className="list">
                            {sponsors.map((sponsor) => (
                                <li key={sponsor.UID}>
                                    <p><strong>Name: </strong><em>{sponsor.SponsorName}</em></p>
                                    <Link to="/dashboard/sponsor_driver_list" state={{sponsor: sponsor.SponsorName}}>List of Drivers</Link>
                                </li>
                            ))}
                        </ol>
                    </>
                ) : (
                    <p>Please join an organization</p>
                )}

                <br/><div>
                    <p>Looking for a Sponsor?</p>
                    <Link to="../join_sponsor_organization" className="cta-button">
                        Join a Sponsor Organization
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default SponsorOrganization;
