import React from 'react';
import useAuth from '../../hooks/useAuth';
import DriverProfile from './DriverProfile';
import SponsorProfile from './SponsorProfile';
import AdminProfile from './AdminProfile';  

function Profile() {
    const { auth } = useAuth();

    return (
        <>
            {auth?.Role === 'driver' && <DriverProfile />}
            {auth?.Role === 'sponsor' && <SponsorProfile />}
            {auth?.Role === 'admin' && <AdminProfile />}
        </>
    );
}

export default Profile;
