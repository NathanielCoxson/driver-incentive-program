import  axios from '../../api/axios';
import { useState, useEffect} from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

function ViewDriverList(){
    const [driverList, setDriverList] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;

        const fetchDriverList = async () => {
            try {
                const response = await axios.get("applications/drivers");
                isMounted && setDriverList(response.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                navigate('/dashboard', { state: { from: location }, replace: true });
            }
        }
        fetchDriverList();
        return () => {
            isMounted = true;
        }
    }, []);

    return (
        <section id="driver-list" className="hero">
            <h2>All Driver Users</h2>
            <ol className="list" style={{textAlign:'left'}}>
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

export default ViewDriverList;