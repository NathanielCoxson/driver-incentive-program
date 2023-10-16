import "./Admin_AddUser.css"
import AdminSidebar from "../Sidebar/Admin_Sidebar";
import { Link } from 'react-router-dom';

function SponsorAddUser() {
    return (
        <main>
            <div className="sidebar-container">
                <AdminSidebar /> {/* Include the DriverSidebar component here */}
                <section className="hero">
                    <h2>What type of user do you want to add?</h2>
                    <Link to="/admin_dashboard/admin_add_user/admin_add_driver" className="cta-button">Add Driver User</Link>
                    <p></p>
                    <Link to="/admin_dashboard/admin_add_user/admin_add_sponsor" className="cta-button"> Add Sponsor User</Link>
                    <p></p>
                    <Link to="/admin_dashboard/admin_add_user/admin_add_admin" className="cta-button"> Add Admin User</Link>    
                </section>
            </div>
        </main>
    );
}

export default SponsorAddUser;