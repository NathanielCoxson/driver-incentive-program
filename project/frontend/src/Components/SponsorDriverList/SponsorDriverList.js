import React from 'react';
import  axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import { useState, useEffect, useNavigate, useLocation} from 'react';

function SponsorDriverList(){
    const auth = useAuth();
    const Username = auth.Username;

    const [drivers, setDrivers] = useState({});
    const navigate = useNavigate();
    const location = useLocation();



    useEffect(() => {
        let isMounted = true;


        const fetchSponsorDrivers = async () => {
            // Make the request
            try {
                const response = await axios.post("/users/sponsor_drivers",
                    { Username },
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true
                    }
                );
                isMounted && setDrivers(response.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                navigate('/login', { state: { from: location }, replace: true });
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