import "./Navbar.css"
import { Link } from 'react-router-dom';

function Navbar() {

    return (
        <div className="Navbar">
            <header>
                <h1>Welcome to Good Driver Program</h1>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Link to="/catalog">Catalog</Link></li>
                        <li><Link to="/rewards">Rewards</Link></li>
                    </ul>
                </nav>
            </header>
        </div>
    )
}

export default Navbar;