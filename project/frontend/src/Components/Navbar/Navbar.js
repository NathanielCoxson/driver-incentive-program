import "./Navbar.css"
import { Link } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";

function Navbar() {
    const { auth } = useAuth();

    return (
        <div className="Navbar">
            <header>
                <h1>Welcome to Good Driver Program</h1>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        {auth?.Username && <li><Link to='/dashboard'>Dashboard</Link></li>}
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </nav>
            </header>
        </div>
    )
}

export default Navbar;