import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
    return (<main>
        <section className="hero">
            <h2>Drive Safely and Get Rewarded!</h2>
            <p>Join our program and earn rewards for your good driving behavior.</p>
<<<<<<< HEAD
            <Link to="/login" className="cta-button">Login</Link>
            <Link to="/register" className="sign-in-button">Sign Up</Link>
=======
            <a href="login" className="cta-button">Login</a>
            <a href="signin.html" className="sign-in-button">Sign In</a>
>>>>>>> main
        </section>
    </main>)
}

export default Home;