import "./Sidebar.css"
import { Link } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";

function Sidebar() {
    const { auth } = useAuth();
    return (
        <div className="sidebar">
            <ul>
                {auth?.Role === 'driver' &&
                    <>
                        <li><Link to="/dashboard">Driver Home</Link></li>
                        <li><Link to="profile">Driver Profile</Link></li>
                        <li><Link to="/dashboard/driver_point">Driver Point</Link></li>
                        <li><Link to="/dashboard/driver_sponsor_organization">Driver's Sponsor Organization</Link></li>
                        <li><Link to="/dashboard/catalog">Driver Catalog</Link></li>
                        <li><Link to="/dashboard/driver_messagebox">Message Box</Link></li>
                    </>
                }

                {auth?.Role === 'sponsor' &&
                    <>
                        <li><Link to="/sponsor_dashboard">Sponsor Home</Link></li>
                        <li><Link to="/sponsor_dashboard/sponsor_profile">Sponsor Profile</Link></li>
                        <li><Link to="/sponsor_dashboard/sponsor_organization">Sponsor Organization</Link></li>
                        <li><Link to="/sponsor_dashboard/sponsor_add_user">Add User</Link></li>
                        <li><Link to="/sponsor_dashboard/sponsor_catalog">Sponsor Catalog</Link></li>
                        <li><Link to="/sponsor_dashboard/sponsor_messagebox">Message Box</Link></li>
                    </>
                }

                {auth?.Role === 'admin' &&
                    <>
                        <li><Link to="/admin_dashboard">Admin Home</Link></li>
                        <li><Link to="/admin_dashboard/admin_profile">Admin Profile</Link></li>
                        <li><Link to="/admin_dashboard/admin_add_user">Add User</Link></li>
                        <li><Link to="/admin_dashboard/admin_messagebox">Message Box</Link></li>
                    </>
                }
            </ul>
        </div>
    );
}

export default Sidebar;



