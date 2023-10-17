import './Home.css';
import { Link } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';

function Home() {
    const logout = useLogout();

    const handleLogout = async () => {
        await logout();
    }

    return (
        <main>
            <section className="hero">
                <h2>Drive Safely and Get Rewarded!</h2>
                <p>Join our program and earn rewards for your good driving behavior.</p>
                <Link to="/login" className="cta-button">Login</Link>
                <Link to="/register" className="sign-in-button">Sign Up</Link>
                <button onClick={handleLogout} className='sign-in-button'>Logout</button>
            </section>
        </main>
    );
}

export default Home;
