import AdminDashboard from "./AdminDashboard";
import DriverDashboard from "./DriverDashboard";
import SponsorDashboard from "./SponsorDashboard";
import useAuth from "../../hooks/useAuth";

function Dashboard() {
    const { auth } = useAuth();

    return (
        <>
            {auth?.Role === 'admin' && <AdminDashboard />}
            {auth?.Role === 'sponsor' && <SponsorDashboard />}
            {auth?.Role === 'driver' && <DriverDashboard />}
        </>
    );
}

export default Dashboard;