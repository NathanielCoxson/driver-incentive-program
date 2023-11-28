import AdminDashboard from "./AdminDashboard";
import DriverDashboard from "./DriverDashboard";
import SponsorDashboard from "./SponsorDashboard";
import useAuth from "../../hooks/useAuth";

function Dashboard() {
    // Pull auth object
    const { auth } = useAuth();
    console.log(auth);

    return (
        <>
            {auth?.view === 'admin' && <AdminDashboard />}
            {auth?.view === 'sponsor' && <SponsorDashboard />}
            {auth?.view === 'driver' && <DriverDashboard />}
        </>
    );
}

export default Dashboard;