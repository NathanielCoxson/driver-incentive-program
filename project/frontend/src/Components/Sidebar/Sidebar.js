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
                        <li><Link to=".">Driver Home</Link></li>
                        <li><Link to="profile" state={{user: auth}}>Driver Profile</Link></li>
                        <li><Link to="driver_points">Driver Point</Link></li>
                        <li><Link to="sponsor_organization">Driver's Sponsor Organization</Link></li>
                        <li><Link to={`sponsors/${auth?.sponsors[0]?.SponsorName}/catalog`}>Driver Catalog</Link></li>
                        <li><Link to="orders">Orders</Link></li>   
                        <li><Link to="driver_messagebox">Message Box</Link></li>
                    </>
                }

                {auth?.Role === 'sponsor' &&
                    <>
                        <li><Link to=".">Sponsor Home</Link></li>
                        <li><Link to="profile" state={{user: auth}}>Sponsor Profile</Link></li>
                        <li><Link to="sponsor_points">Sponsor Point</Link></li>
                        <li><Link to="sponsor_driver_list" state={{sponsor: auth?.sponsors[0]?.SponsorName}}>List of Drivers</Link></li>
                        <li><Link to="sponsor_add_user">Add User</Link></li>
                        <li><Link to={`sponsors/${auth?.sponsors[0]?.SponsorName}/catalog`}>Sponsor Catalog</Link></li>
                        <li><Link to="sponsor_report"> Sponsor Report</Link></li>
                        <li><Link to="sponsor_view_as">View As </Link></li>
                        <li><Link to="sponsor_messagebox">Message Box</Link></li>
                    </>
                }

                {auth?.Role === 'admin' &&
                    <>
                        <li><Link to=".">Admin Home</Link></li>
                        <li><Link to="profile" state={{user: auth}}>Admin Profile</Link></li>
                        <li><Link to="admin_add_user">Add User</Link></li>
                        <li><Link to="assign_drivers">Assign Driver/Sponsor </Link></li>
                        <li><Link to="admin_report"> Admin Report</Link></li>
                        <li><Link to="admin_list">View All Admin</Link></li>
                        <li><Link to="sponsor_list">View All Sponsors</Link></li>
                        <li><Link to="driver_list">View All Drivers</Link></li>
                        <li><Link to="admin_view_as">View As </Link></li>
                        <li><Link to="admin_messagebox">Message Box</Link></li>
                    </>
                }
            </ul>
        </div>
    );
}

export default Sidebar;



