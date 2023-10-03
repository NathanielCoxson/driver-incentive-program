import "./Navbar.css"

function Navbar(){
    return (<div className="Navbar"><header>
        <h1>Welcome to Good Driver Program</h1>
        <nav>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="about">About Us</a></li>
                <li><a href="contact">Contact</a></li>
                <li><a href="catalog">Catalog</a></li>
                <li><a href="rewards">Rewards</a></li>
            </ul>
        </nav>
    </header>
    </div>
    )
}

export default Navbar;