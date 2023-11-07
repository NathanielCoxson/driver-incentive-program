import React from 'react';
import useAuth from '../../hooks/useAuth';
import DriverProfile from './DriverProfile';
import SponsorProfile from './SponsorProfile';
import AdminProfile from './AdminProfile';  
import { Link, useLocation } from 'react-router-dom';

function Profile() {
    const {auth} = useAuth();
    const location = useLocation();
    const {user} = location.state;

    return (
        <>
            {user?.Role === 'driver' && <DriverProfile driver={user}/>}
            {user?.Role === 'sponsor' && <SponsorProfile sponsor={user}/>}
            {user?.Role === 'admin' && <AdminProfile admin={user}/>}
            {(auth?.UID === user?.UID || auth?.Role === 'admin' || (auth?.Role === 'sponsor' && user?.Role === 'driver')) 
                && <Link to='/dashboard/edit_profile' state={{ user: user}}>Edit Profile</Link>}

        </>
    );
}

export default Profile;
