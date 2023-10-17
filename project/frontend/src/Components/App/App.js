import './App.css';
import Home from '../Home/Home';
import About from '../About/About';
import Contact from '../Contact/Contact';
import Rewards from '../Rewards/Rewards';
import Login from '../Login/Login';
import Register from '../Register/Register';
import DriverProfile from '../Profile/Driver_Profile';
import ResetPassword from '../ResetPassword/ResetPassword';
import Layout from '../Layout/Layout';
import RequireAuth from '../RequireAuth/RequireAuth';
import { Route, Routes } from 'react-router-dom';
import Missing from '../Missing/Missing';
import Unauthorized from '../Unauthorized/Unauthorized';
import DriverPoint from '../Point/Driver_Point';
import DriverSponsorOrganization from '../Sponsor_Org/Driver_SponsorOrganization';
import Catalog from '../Catalog/Catalog';
import JoinSponsorOrganization from '../Sponsor_Org/Join_SponsorOrganization';
import SponsorOrganization from '../Sponsor_Org/Sponsor_Organization';
import CreateSponsorOrganization from '../Sponsor_Org/Create_SponsorOrganization';
import SponsorAddUser from '../AddUser/Sponsor_AddUser';
import SponsorAddDriver from '../AddUser/Sponsor_AddDriver';
import SponsorAddSponsor from '../AddUser/Sponsor_AddSponsor';
import PersistLogin from '../PersistLogin/PersistLogin';
import Dashboard from '../Dashboard/Dashboard';
import DashboardLayout from '../Dashboard/DashboardLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password-reset" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />



        <Route path="/sponsor_dashboard/sponsor_organization" element={<SponsorOrganization />} />
        <Route path="/sponsor_dashboard/sponsor_organization/join_sponsor_organization" element={<JoinSponsorOrganization />} />
        <Route path="/sponsor_dashboard/sponsor_organization/create_sponsor_organization" element={<CreateSponsorOrganization />} />
        <Route path="/sponsor_dashboard/sponsor_add_user" element={<SponsorAddUser />} />
        <Route path="/sponsor_dashboard/sponsor_add_user/sponsor_add_driver" element={<SponsorAddDriver />} />
        <Route path="/sponsor_dashboard/sponsor_add_user/sponsor_add_sponsor" element={<SponsorAddSponsor />} />

        {/* private */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={['driver', 'admin', 'sponsor']} />}>
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route path="profile" element={<DriverProfile />} />
              <Route path="catalog" element={<Catalog />} />
              <Route path="driver_point" element={<DriverPoint />} />
              <Route path="driver_sponsor_organization" element={<DriverSponsorOrganization />} />
              <Route path="join_sponsor_organization" element={<JoinSponsorOrganization />} />
              <Route path="" element={<Dashboard />} />
            </Route>
          </Route>
        </Route>


        {/* catch all*/}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
