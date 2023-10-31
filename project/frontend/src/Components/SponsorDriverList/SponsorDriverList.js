import React from 'react';
import  axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import { useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function SponsorDriverList(){
    const {auth} = useAuth();

    const [drivers, setDrivers] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();



    useEffect(() => {
        let isMounted = true;

        const fetchSponsorDrivers = async () => {
            // Make the request
            try {
                const response = await axios.get("applications/drivers/" + auth?.sponsors[0]?.SponsorName);
                isMounted && setDrivers(response.data);
                console.log(drivers)
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
            <ol className="driver-list">
                {drivers.map((driver) => (
                    <li>
                        <h3>{driver.Name}</h3>
                        <h3>{driver.Username}</h3>
                    </li>
                ))}
            </ol>
        </section>
    );
}

export default SponsorDriverList;