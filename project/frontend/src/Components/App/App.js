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
import Profile from '../Profile/Profile';
import BreadCrumb from '../BreadCrumb/BreadCrumb'; 
import ResetPassword from '../ResetPassword/ResetPassword';
import DriverDashboard from '../Driver_Dashboard/Driver_Dashboard';
import DriverSidebar from '../Sidebar/Driver_Sidebar';
import DriverPoint from '../Point/Driver_Point';
import DriverSponsorOrganization from '../Sponsor_Org/Driver_SponsorOrganization';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DriverCatalog from '../Catalog/Driver_Catalog';

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
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password-reset" element= {<ResetPassword />} />
          <Route path="/driver_dashboard" element= {<DriverDashboard />} />
          <Route path="/driver_point" element= {<DriverPoint />} />
          <Route path="/driver_sponsor_organization" element= {<DriverSponsorOrganization />} />
          <Route path="/driver_catalog" element= {<DriverCatalog />} />
        </Routes>
      <Footer />
    </div>
    </Router>
  );
}

export default App;
