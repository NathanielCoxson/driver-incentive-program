import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
    return (<main>
        <section className="hero">
            <h2>Drive Safely and Get Rewarded!</h2>
            <p>Join our program and earn rewards for your good driving behavior.</p>
        < HEAD>
            <Link to="/login" className="cta-button">Login</Link>
        </HEAD>

        </section>
    </main>)
}

export default Home;