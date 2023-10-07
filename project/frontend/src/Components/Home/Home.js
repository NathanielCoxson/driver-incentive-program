import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
    return (<main>
        <section className="hero">
            <div id="breadcrumb" class="breadcrumb"></div>
            <h2>Drive Safely and Get Rewarded!</h2>
            <p>Join our program and earn rewards for your good driving behavior.</p>
            <Link to="/login" className="cta-button">Login</Link>
            <Link to="/register" className="sign-in-button">Sign Up</Link>
        </section>
    </main>)
}

export default Home;