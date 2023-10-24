import React from 'react';
import useAuth from '../../hooks/useAuth';
import DriverProfile from './DriverProfile';
import SponsorProfile from './SponsorProfile';
import AdminProfile from './AdminProfile';  
import { Link } from 'react-router-dom';

function Profile() {
    const { auth } = useAuth();

    return (
        <>
            {auth?.Role === 'driver' && <DriverProfile />}
            {auth?.Role === 'sponsor' && <SponsorProfile />}
            {auth?.Role === 'admin' && <AdminProfile />}
            <Link to='/dashboard/edit_profile'>Edit Profile</Link>
        </>
    );
}

export default Profile;
