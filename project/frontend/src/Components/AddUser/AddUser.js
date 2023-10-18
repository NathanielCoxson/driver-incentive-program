import "./AddUser.css"
import { Link } from 'react-router-dom';

function AddUser({ isAdmin }) {
    return (
        <section className="hero">
            <h2>What type of user do you want to add?</h2>
            <Link to="add_driver" className="cta-button">Add Driver User</Link>
             <p></p>
             <Link to="add_sponsor" className="cta-button"> Add Sponsor User</Link>
             <p></p>
             {isAdmin && <Link to="add_admin" className="cta-button"> Add Admin User</Link>}
        </section>
    );
}

export default AddUser;