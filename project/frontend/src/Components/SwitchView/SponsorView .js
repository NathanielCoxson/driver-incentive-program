import './SwitchView.css';
import { Link } from 'react-router-dom';

function SponsorView() {

    return (<main>
        <section className="hero">
            <h2>View</h2>
            <Link to="driver_dashboard" className="cta-button">View As Driver</Link>
        </section>
    </main>)
}

export default SponsorView;