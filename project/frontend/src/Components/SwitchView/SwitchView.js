import React from 'react';
import useAuth from '../../hooks/useAuth'; 
import { Link, useLocation } from 'react-router-dom';
import SponsorView from './SponsorView ';
import AdminView from './AdminView';


function SwitchView() {
    const {auth} = useAuth();
    const location = useLocation();
    const {user} = location.state;

    return (
        <>
            {user?.Role === 'sponsor' && < SponsorView sponsor={user}/>}
            {user?.Role === 'admin' && < AdminView admin={user}/>}

        </>
    );
}

export default SwitchView;
