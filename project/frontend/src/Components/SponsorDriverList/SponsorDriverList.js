import React from 'react';
import  axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import { useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

function SponsorDriverList(){
    const [driverList, setDrivers] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const {sponsor} = location.state;

    useEffect(() => {
        let isMounted = true;

        const fetchSponsorDrivers = async () => {
            // Make the request
            try {
                const response = await axios.get("applications/drivers/" + sponsor);
                isMounted && setDrivers(response.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                navigate('/dashboard', { state: { from: location }, replace: true });
            }
        }
        fetchSponsorDrivers();
        return () => {
            isMounted = true;
        }
    }, []);

    return (
        <section className="hero">
            <h2>Drivers in your Organization</h2>
            <ol className="driver-list" style={{textAlign: 'left'}}>
                {driverList.map((driver) => (
                    <li key={driver.UID}>
                        <p><strong>Name: </strong><em>{driver.Name}</em></p>
                        <p><strong>Username: </strong><em>{driver.Username}</em></p>
                        <Link to="/dashboard/profile" state={{ user: driver }}>View Profile</Link>
                    </li>
                ))}
            </ol>
        </section>
    );
}

export default SponsorDriverList;