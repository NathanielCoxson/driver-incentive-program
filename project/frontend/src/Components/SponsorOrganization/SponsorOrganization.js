import React from 'react';
import './SponsorOrganization.css';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function SponsorOrganization() {
    const { auth } = useAuth();

    return (
        <section className="hero">
            <h2>Welcome to Your Sponsor Organization Dashboard</h2>
            <div class="sponsor-info">
                <p><strong>Sponsor Company:</strong> ABC Motors</p>
                <p>Looking for a Sponsor?</p>
                <Link to="../join_sponsor_organization" className="cta-button">Join a Sponsor Organization</Link>

                {auth?.Role === 'sponsor' &&
                    <>
                        < p > Or Create Your Own:</p>
                        <Link to="../create_sponsor_organization" className="cta-button"> Create An Sponsor Organization</Link>
                    </>
                }

            </div>
        </section >
    );
}

export default SponsorOrganization;