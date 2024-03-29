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
import DriverPoints from '../Point/DriverPoints';
import SponsorPoints from '../Point/SponsorPoints';
import ViewSponsorOrganization from '../SponsorOrganization/ViewSponsorOrganization';
import Catalog from '../Catalog/Catalog';
import JoinSponsorOrganization from '../SponsorOrganization/JoinSponsorOrganization';
import SponsorOrganization from '../SponsorOrganization/SponsorOrganization';
import CreateSponsorOrganization from '../SponsorOrganization/CreateSponsorOrganization';
import PersistLogin from '../PersistLogin/PersistLogin';
import Dashboard from '../Dashboard/Dashboard';
import DashboardLayout from '../Dashboard/DashboardLayout';
import Profile from '../Profile/Profile';
import AddUser from '../AddUser/AddUser';
import RejectionReason from '../Dashboard/RejectionReason';
import CatalogSettings from '../Catalog/CatalogSettings';
import ShoppingCart from '../Catalog/ShoppingCart';
import Purchase from '../Purchase/Purchase';
import Orders from '../Orders/Orders';
import EditProfile from '../EditProfile/EditProfile';
import SponsorDriverList from '../SponsorDriverList/SponsorDriverList';
import SponsorReport from '../Report/SponsorReport';
import AdminReport from '../Report/AdminReport';
import ViewAdminList from '../ViewUsers/ViewAdminList';
import ViewSponsorList from '../ViewUsers/ViewSponsorList';
import ViewDriverList from '../ViewUsers/ViewDriverList';
import AssignSponsorDrivers from '../AssignSponsorDrivers/AssignSponsorDrivers';
import SponsorView from '../SwitchView/SponsorView ';
import AdminView from '../SwitchView/AdminView';
import MsgBox from '../MsgBox/MsgBox';
import Logout from '../Login/Logout';


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
            <Route path="dashboard" element={<DashboardLayout />}> {/* All users have a dashboard */}
              {/* universal */}
              <Route path="profile" element={<Profile />} /> {/* All users have a profile */}
              <Route path="sponsor_organization" element={<SponsorOrganization />} /> {/* Could be hidden for admins or not */}
              <Route path="catalog" element={<Catalog />} /> {/* Sponsors can see their own catalog along with drivers */}
              <Route path="join_sponsor_organization" element={<JoinSponsorOrganization />} />
              <Route path="edit_profile" element={<EditProfile />} />
              <Route path="sponsor_driver_list" element={<SponsorDriverList />} />
              <Route path="message_box" element={< MsgBox/>} />

              <Route path="sponsors/:SponsorName/catalog" element={<Catalog />} />

              {/* driver */}
              <Route element={<RequireAuth allowedRoles={['driver', 'sponsor', 'admin']} />}>
                <Route path="driver_points" element={<DriverPoints />} />
                <Route path="view_sponsor_organization" element={<ViewSponsorOrganization />} />
                <Route path="shoppingcart" element={<ShoppingCart />} />
                <Route path="purchase" element={<Purchase />} />
                <Route path="orders" element={<Orders />} />
                <Route path="logout" element={<Logout />} />
                
              </Route>

              {/* sponsor */}
              <Route element={<RequireAuth allowedRoles={['sponsor', 'admin']} />}>
                <Route path="sponsor_add_user" element={<AddUser />} />
                <Route path="sponsor_add_user/add_driver" element={<Register role='driver' />} />
                <Route path="sponsor_add_user/add_sponsor" element={<Register role='sponsor' />} />
                <Route path="create_sponsor_organization" element={<CreateSponsorOrganization />} />
                <Route path="sponsor_points" element={<SponsorPoints />} />
                <Route path="rejection_reason" element={<RejectionReason />} />
                <Route path="sponsors/:SponsorName/catalog/settings" element={<CatalogSettings />} />
                <Route path="sponsor_report" element={<SponsorReport />} />
                <Route path="sponsor_view_as" element={< SponsorView/>} />
                <Route path="logout" element={<Logout />} />
              </Route>

              {/* admin */}
              <Route element={<RequireAuth allowedRoles={['admin']} />}>
                <Route path="admin_add_user" element={<AddUser isAdmin={true} />} />
                <Route path="admin_add_user/add_driver" element={<Register role='driver' />} />
                <Route path="admin_add_user/add_sponsor" element={<Register role='sponsor' />} />
                <Route path="admin_add_user/add_admin" element={<Register role='admin' />} />
                <Route path="admin_report" element={<AdminReport />} />
                <Route path="admin_list" element={<ViewAdminList />} />
                <Route path="sponsor_list" element={<ViewSponsorList />} />
                <Route path="driver_list" element={<ViewDriverList />} />
                <Route path="assign_drivers" element={<AssignSponsorDrivers />} />
                <Route path="admin_view_as" element={<AdminView />} />
                <Route path="logout" element={<Logout />} />
              </Route>

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
