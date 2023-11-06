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
            {auth?.Role === 'driver' && <DriverProfile driver={auth}/>}
            {auth?.Role === 'sponsor' && <SponsorProfile sponsor={auth}/>}
            {auth?.Role === 'admin' && <AdminProfile admin={auth}/>}
            <Link to='/dashboard/edit_profile'>Edit Profile</Link>
        </>
    );
}

export default Profile;
