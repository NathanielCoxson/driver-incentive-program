import './Home.css';
import { Link } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';
import useAuth from '../../hooks/useAuth';
import useRefreshToken from '../../hooks/uesRefreshToken';
import { useCallback, useEffect, useState } from 'react';

function Logout() {
    const logout = useLogout();
    const { auth, persist } = useAuth();
    const [loggedIn, setLoggedIn] =  useState(auth?.Username ? true : false);
    const refresh = useRefreshToken();

    const handleLogout = async () => {
        await logout();
        // Wait for logout to finish and then set logged in to false.
        setLoggedIn(false);
    }

    const tryRefresh = useCallback(async () => {
        try {
            if (persist) {
                const accessToken = await refresh();
                // If refresh was successful, set logged in to true
                if (accessToken) setLoggedIn(true);
            }
        } catch (err) {
            if (process.env.NODE_ENV === 'development') console.log(err);
        }
    }, [persist, refresh]);

    useEffect(() => {
        // Try to log back in if user is not logged in.
        if (!loggedIn) tryRefresh();
    }, [loggedIn, tryRefresh]);

    return (
        <main>
            <section className="hero">
                <h2>Logout</h2>
                <p>Do you want to logout?</p>
                    {loggedIn && <button onClick={handleLogout} className='home-button'>Logout</button>}
            </section>
        </main>
    );
}

export default Logout;
