import "./Sponsor_AddUser.css"
import SponsorSidebar from "../Sidebar/Sponsor_sidebar";
import { Link } from 'react-router-dom';

function SponsorAddUser() {
    return (
        <main>
            <div className="sidebar-container">
                <SponsorSidebar /> {/* Include the DriverSidebar component here */}
                <section className="hero">
                    <h2>What type of user do you want to add?</h2>
                    <Link to="/sponsor_dashboard/sponsor_add_user/sponsor_add_driver" className="cta-button">Add Driver User</Link>
                    <p></p>
                    <Link to="/sponsor_dashboard/sponsor_add_user/sponsor_add_sponsor" className="cta-button"> Add Sponsor User</Link>
                </section>
            </div>
        </main>
    );
}

export default SponsorAddUser;