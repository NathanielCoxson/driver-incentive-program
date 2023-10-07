import './Home.css';
import { Link } from 'react-router-dom';
import BreadCrumb from '../BreadCrumb/BreadCrumb'; // Import BreadCrumb component

function Home() {
    return (
        <main>
            <BreadCrumb /> {/* Include the BreadCrumb component here */}
            <section className="hero">
                <h2>Drive Safely and Get Rewarded!</h2>
                <p>Join our program and earn rewards for your good driving behavior.</p>
                <Link to="/login" className="cta-button">Login</Link>
                <Link to="/register" className="sign-in-button">Sign Up</Link>
            </section>
        </main>
    );
}

export default Home;
