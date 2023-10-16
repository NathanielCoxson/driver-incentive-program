import './App.css';
import Home from '../Home/Home';
import About from '../About/About';
import Catalog from '../Catalog/Catalog';
import Contact from '../Contact/Contact';
import Rewards from '../Rewards/Rewards';
import Login from '../Login/Login';
import Register from '../Register/Register';
import Profile from '../Profile/Profile';
import ResetPassword from '../ResetPassword/ResetPassword';
import Layout from '../Layout/Layout';
import RequireAuth from '../RequireAuth/RequireAuth';
import { Route, Routes } from 'react-router-dom';

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

        {/* private */}
        <Route element={<RequireAuth />}>
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/rewards" element={<Rewards />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
