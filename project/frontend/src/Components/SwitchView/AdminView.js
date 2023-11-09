import './SwitchView.css';

function AdminView() {

    return (<main>
        <section className="hero">
            <h2>View</h2>
            <Link to="dashboard" className="cta-button">View As Driver</Link>
            <Link to="dashboard" className="cta-button">View As Sponsor</Link>
        </section>
    </main>)
}

export default AdminView;