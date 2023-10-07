import './App.css';
import Home from '../Home/Home';
import Navbar from '../Navbar/Navbar';
import About from '../About/About';
import Catalog from '../Catalog/Catalog';
import Contact from '../Contact/Contact';
import Rewards from '../Rewards/Rewards';
import Login from '../Login/Login';
import Footer from '../Footer/Footer';
import Register from '../Register/Register';
import Profile from '../Profile/Profile';
import BreadCrum from '../BreadCrum/BreadCrum';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
    <div className="App">
      <Navbar />
      <BreadCrum />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </div>
    </Router>
  );
}

export default App;
