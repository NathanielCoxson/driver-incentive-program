import './Home.css';
import { Link, useNavigate } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';
import useAuth from '../../hooks/useAuth';
import useRefreshToken from '../../hooks/uesRefreshToken';
import { useEffect } from 'react';

function Home() {
    const logout = useLogout();
    const { auth, persist } = useAuth();
    const refresh = useRefreshToken();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
    }

    const tryRefresh = async () => {
        try {
            await refresh();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (persist) tryRefresh();
    }, []);

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
