import './SwitchView.css';
import { useNavigate} from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function AdminView() {
    const { auth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        console.log("Event", event);
        event.preventDefault();

        auth.view = event.target.value;
        console.log("auth:", auth);
        navigate("/", {replace: true});
    } 

    return (<main>
        <section className="hero">
            <h2>View Selection</h2>
            <button onClick={handleSubmit} value={"admin"} className="cta-button">View As Admin</button>
            <button onClick={handleSubmit} value={"driver"} className="cta-button">View As Driver</button>
            <button onClick={handleSubmit} value={"sponsor"} className="cta-button">View As Sponsor</button>
        </section>
    </main>)
}

export default AdminView;