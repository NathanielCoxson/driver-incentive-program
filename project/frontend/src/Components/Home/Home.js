import './Home.css';
import { Link } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';
import useAuth from '../../hooks/useAuth';
import useRefreshToken from '../../hooks/uesRefreshToken';
import { useEffect } from 'react';

function Home() {
    const logout = useLogout();
    const { auth, persist } = useAuth();
    const refresh = useRefreshToken();

    const handleLogout = async () => {
        await logout();
    }

    useEffect(() => {
        const tryRefresh = async () => {
            try {
                await refresh();
            } catch (err) {
                console.log(err);
            }
        }
        if (!auth?.accessToken && persist) tryRefresh();
    }, [persist, auth?.accessToken, refresh]);

    return (
        <main>
            <section className="hero home-section">
                <h2>Drive Safely and Get Rewarded!</h2>
                <p>Join our program and earn rewards for your good driving behavior.</p>
                <div className='home-buttons'>
                    {!auth.Username &&
                        <>
                            <Link to="/login" className='home-button'>Login</Link>
                            <Link to="/register" className='home-button'>Sign Up</Link>
                        </>
                    }
                    {auth?.Username && <button onClick={handleLogout} className='home-button'>Logout</button>}
                </div>
            </section>
        </main>
    );
}

export default Home;
