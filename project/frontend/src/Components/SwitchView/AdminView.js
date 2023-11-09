import './SwitchView.css';
import { Link } from 'react-router-dom';

function AdminView() {

    return (<main>
        <section className="hero">
            <h2>View</h2>
            <Link to="driver_dashboard" className="cta-button">View As Driver</Link>
            <p></p>
            <Link to="sponsor_dashboard" className="cta-button">View As Sponsor</Link>
        </section>
    </main>)
}

export default AdminView;