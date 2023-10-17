import './App.css';
import Home from '../Home/Home';
import About from '../About/About';
import Contact from '../Contact/Contact';
import Login from '../Login/Login';
import Register from '../Register/Register';
import ResetPassword from '../ResetPassword/ResetPassword';
import Layout from '../Layout/Layout';
import RequireAuth from '../RequireAuth/RequireAuth';
import { Route, Routes } from 'react-router-dom';
import Missing from '../Missing/Missing';
import Unauthorized from '../Unauthorized/Unauthorized';
import DriverPoint from '../Point/Driver_Point';
import Catalog from '../Catalog/Catalog';
import JoinSponsorOrganization from '../SponsorOrganization/JoinSponsorOrganization';
import SponsorOrganization from '../SponsorOrganization/SponsorOrganization';
import CreateSponsorOrganization from '../SponsorOrganization/CreateSponsorOrganization';
import SponsorAddUser from '../AddUser/SponsorAddUser';
import SponsorAddDriver from '../AddUser/SponsorAddDriver';
import SponsorAddSponsor from '../AddUser/SponsorAddSponsor';
import PersistLogin from '../PersistLogin/PersistLogin';
import Dashboard from '../Dashboard/Dashboard';
import DashboardLayout from '../Dashboard/DashboardLayout';
import Profile from '../Profile/Profile';

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





        {/* private */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={['driver', 'admin', 'sponsor']} />}>
            <Route path="dashboard" element={<DashboardLayout />}>
              {/* universal */}
              <Route path="profile" element={<Profile />} />
              <Route path="sponsor_organization" element={<SponsorOrganization />} /> {/* Could be hidden for admins or not */}
              <Route path="catalog" element={<Catalog />} />
              <Route path="join_sponsor_organization" element={<JoinSponsorOrganization />} />

              {/* driver */}
              <Route element={<RequireAuth allowedRoles={['driver', 'admin']} />}>
                <Route path="driver_point" element={<DriverPoint />} />
              </Route>

              {/* sponsor */}
              <Route element={<RequireAuth allowedRoles={['sponsor', 'admin']} />}>
                <Route path="sponsor_add_user" element={<SponsorAddUser />} />
                <Route path="sponsor_add_user/sponsor_add_driver" element={<SponsorAddDriver />} />
                <Route path="sponsor_add_user/sponsor_add_sponsor" element={<SponsorAddSponsor />} />
                <Route path="create_sponsor_organization" element={<CreateSponsorOrganization />} />
              </Route>

              {/* admin */}


              {/* catch all */}
              <Route path="" element={<Dashboard />} />
            </Route>
          </Route>
        </Route>


        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
