import './Home.css';
import { Link } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';
import useAuth from '../../hooks/useAuth';
import useRefreshToken from '../../hooks/uesRefreshToken';
import { useCallback, useEffect, useState } from 'react';

function Home() {
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
            console.log(err);
        }
    }, [persist, refresh]);

    useEffect(() => {
        // Try to log back in if user is not logged in.
        if (!loggedIn) tryRefresh();
    }, [loggedIn, tryRefresh]);

    return (
        <main>
            <section className="hero home-section">
                <h2>Drive Safely and Get Rewarded!</h2>
                <p>Join our program and earn rewards for your good driving behavior.</p>
                <div className='home-buttons'>
                    {!loggedIn &&
                        <>
                            <Link to="/login" className='home-button'>Login</Link>
                            <Link to="/register" className='home-button'>Sign Up</Link>
                        </>
                    }
                    {loggedIn && <button onClick={handleLogout} className='home-button'>Logout</button>}
                </div>
            </section>
        </main>
    );
}

export default Home;
