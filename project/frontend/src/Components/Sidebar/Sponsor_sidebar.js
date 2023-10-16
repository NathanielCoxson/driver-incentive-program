import "./Sponsor_Sidebar.css"
import { Link } from 'react-router-dom';

function SponsorSidebar() {
    return (
        <div className="sidebar">
            <ul>
                <li><Link to="/sponsor_dashboard">Sponsor Home</Link></li>
                <li><Link to="/sponsor_organization">Sponsor Organization</Link></li>
                <li><Link to="/sponsor_catalog">Sponsor Catalog</Link></li>
                <li><Link to="/sponsor_messagebox">Message Box</Link></li>
            </ul>
        </div>
    );
}

export default SponsorSidebar;



