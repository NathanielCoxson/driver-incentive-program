import React from 'react';
import  axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import { useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function SponsorDriverList(){
    const {auth} = useAuth();
    const [driverList, setDrivers] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;

        const fetchSponsorDrivers = async () => {
            // Make the request
            try {
                const response = await axios.get("applications/drivers/" + auth?.sponsors[0]?.SponsorName);
                isMounted && setDrivers(response.data);
                console.log(driverList);
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
                    </li>
                ))}
            </ol>
        </section>
    );
}

export default SponsorDriverList;