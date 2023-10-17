import "./Driver_Sidebar.css"
import { Link } from 'react-router-dom';

function DriverSidebar() {
    return (
        <div className="sidebar">
            <ul>
                <li><Link to="/dashboard">Driver Home</Link></li>
                <li><Link to="profile">Driver Profile</Link></li>
                <li><Link to="/dashboard/driver_point">Driver Point</Link></li>
                <li><Link to="/dashboard/driver_sponsor_organization">Driver's Sponsor Organization</Link></li>
                <li><Link to="/dashboard/catalog">Driver Catalog</Link></li>
                <li><Link to="/dashboard/driver_messagebox">Message Box</Link></li>
            </ul>
        </div>
    );
}

export default DriverSidebar;



