import Navbar from "../Navbar/Navbar";
import Breadcrumb from "../BreadCrumb/BreadCrumb";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <div>
            <Navbar />
            <Breadcrumb />
            <Outlet />
            <Footer />
        </div>
    );
}

export default Layout;