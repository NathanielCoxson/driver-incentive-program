import './App.css';
import Home from '../Home/Home';
import Navbar from '../Navbar/Navbar';
import About from '../About/About';
import Catalog from '../Catalog/Driver_Catalog';
import Contact from '../Contact/Contact';
import Rewards from '../Rewards/Rewards';
import Login from '../Login/Login';
import Footer from '../Footer/Footer';
import Register from '../Register/Register';
import BreadCrumb from '../BreadCrumb/BreadCrumb'; 
import ResetPassword from '../ResetPassword/ResetPassword';
import DriverDashboard from '../Dashboard/Driver_Dashboard';
import DriverProfile from '../Profile/Driver_Profile';
import DriverPoint from '../Point/Driver_Point';
import DriverSponsorOrganization from '../Sponsor_Org/Driver_SponsorOrganization';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DriverCatalog from '../Catalog/Driver_Catalog';
import JoinSponsorOrganization from '../Sponsor_Org/Join_SponsorOrganization';
import SponsorDashboard from '../Dashboard/Sponsor_Dashboard';
import SponsorProfile from '../Profile/Sponsor_Profile';
import SponsorOrganization from '../Sponsor_Org/Sponsor_Organization';
import CreateSponsorOrganization from '../Sponsor_Org/Create_SponsorOrganization';
import SponsorAddUser from '../AddUser/Sponsor_AddUser';
import SponsorAddDriver from '../AddUser/Sponsor_AddDriver';
import SponsorAddSponsor from '../AddUser/Sponsor_AddSponsor';
import AdminDashboard from '../Dashboard/Admin_Dashboard';
import AdminProfile from '../Profile/Admin_Profile';
import AdminAddUser from '../AddUser/Admin_AddUser';
import AdminAddDriver from '../AddUser/Admin_AddDriver';
import AdminAddSponsor from '../AddUser/Admin_AddSponsor';
import AdminAddAdmin from '../AddUser/Admin_AddAdmin';

function App() {
  return (
    <Router>
    <div className="App">
      <Navbar />
      <BreadCrumb />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password-reset" element= {<ResetPassword />} />
          <Route path="/driver_dashboard" element= {<DriverDashboard />} />
          <Route path="/driver_dashboard/driver_profile" element= {<DriverProfile />} />
          <Route path="/driver_dashboard/driver_point" element= {<DriverPoint />} />
          <Route path="/driver_dashboard/driver_sponsor_organization" element= {<DriverSponsorOrganization />} />
          <Route path="/driver_dashboard/driver_catalog" element= {<DriverCatalog />} />
          <Route path="/driver_dashboard/driver_sponsor_organization/join_sponsor_organization" element= {<JoinSponsorOrganization />} />
          <Route path="/sponsor_dashboard" element= {<SponsorDashboard />} />
          <Route path="/sponsor_dashboard/sponsor_profile" element= {<SponsorProfile />} />
          <Route path="/sponsor_dashboard/sponsor_organization" element= {<SponsorOrganization />} />
          <Route path="/sponsor_dashboard/sponsor_organization/join_sponsor_organization" element= {<JoinSponsorOrganization />} />
          <Route path="/sponsor_dashboard/sponsor_organization/create_sponsor_organization" element= {<CreateSponsorOrganization />} />
          <Route path="/sponsor_dashboard/sponsor_add_user" element= {<SponsorAddUser />} />
          <Route path="/sponsor_dashboard/sponsor_add_user/sponsor_add_driver" element= {<SponsorAddDriver />} />
          <Route path="/sponsor_dashboard/sponsor_add_user/sponsor_add_sponsor" element= {<SponsorAddSponsor />} />
          <Route path="/admin_dashboard" element= {<AdminDashboard />} />
          <Route path="/admin_dashboard/admin_profile" element= {<AdminProfile />} />
          <Route path="/admin_dashboard/admin_add_user" element= {<AdminAddUser />} />
          <Route path="/admin_dashboard/admin_add_user/admin_add_driver" element= {<AdminAddDriver />} />
          <Route path="/admin_dashboard/admin_add_user/admin_add_sponsor" element= {<AdminAddSponsor />} />
          <Route path="/admin_dashboard/admin_add_user/admin_add_admin" element= {<AdminAddAdmin />} />

        </Routes>
      <Footer />
    </div>
    </Router>
  );
}

export default App;
