import "./Driver_Sidebar.css"
import { Link } from 'react-router-dom';

function AdminSidebar() {
    return (
        <div className="sidebar">
            <ul>
                <li><Link to="/admin_dashboard">Admin Home</Link></li>
                <li><Link to="/admin_dashboard/admin_profile">Admin Profile</Link></li>
                <li><Link to="/admin_dashboard/admin_add_user">Add User</Link></li>                
                <li><Link to="/admin_dashboard/admin_messagebox">Message Box</Link></li>
            </ul>
        </div>
    );
}

export default AdminSidebar;



