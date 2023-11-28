import React from 'react';
import useAuth from '../../hooks/useAuth';
import DriverProfile from './DriverProfile';
import SponsorProfile from './SponsorProfile';
import AdminProfile from './AdminProfile';  
import { Link, useLocation } from 'react-router-dom';

function Profile() {
    const {auth} = useAuth();
    const location = useLocation();

    var userProfile;
    
    if (auth?.Role !== auth?.view){
        userProfile = {
            Username: 'example'+auth?.view,
            Name: 'Example '+auth?.view,
            SponsorName: 'Example '+auth?.view+' 1',
            Role: auth?.view,
            view: auth?.view
        }
    } else {
        userProfile = location.state.user;
    }
    userProfile.view = auth?.view;
    
    const user = userProfile;
    console.log("user", user)
    console.log("userProfile", userProfile)

    return (
        <>
            {user?.view === 'driver' && <DriverProfile driver={user}/>}
            {user?.view === 'sponsor' && <SponsorProfile sponsor={user}/>}
            {user?.view === 'admin' && <AdminProfile admin={user}/>}
            {(auth?.UID === user?.UID || auth?.Role === 'admin' || (auth?.Role === 'sponsor' && user?.Role === 'driver')) 
                && auth?.view === auth?.Role
                && <Link to='/dashboard/edit_profile' state={{ user: user}}>Edit Profile</Link>}

        </>
    );
}

export default Profile;
