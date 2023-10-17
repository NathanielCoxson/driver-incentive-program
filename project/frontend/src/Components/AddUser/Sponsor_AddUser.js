import "./Sponsor_AddUser.css"
import { Link } from 'react-router-dom';

function SponsorAddUser() {
    return (
        <section className="hero">
            <h2>What type of user do you want to add?</h2>
            <Link to="/sponsor_dashboard/sponsor_add_user/sponsor_add_driver" className="cta-button">Add Driver User</Link>
            <p></p>
            <Link to="/sponsor_dashboard/sponsor_add_user/sponsor_add_sponsor" className="cta-button"> Add Sponsor User</Link>
        </section>
    );
}

export default SponsorAddUser;