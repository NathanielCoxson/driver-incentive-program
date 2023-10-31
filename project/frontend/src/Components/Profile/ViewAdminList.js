import React from 'react';
import  axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import { useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ViewAdminList(){
    const auth = useAuth();
    const [adminList, setAdminList] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        let isMounted = true;

        const fetchAdminList = async () => {
            try {
                const response = await axios.get("users/admin");
                isMounted && setAdminList(response.data);
                console.log(adminList)
            } catch (err) {
                console.error("Error fetching data:", err);
                navigate('/dashboard', { state: { from: location }, replace: true });
            }
        }
        fetchAdminList();
        return () => {
            isMounted = true;
        }
    }, []);

    return (
        <section className="hero">
            <h2>Drivers in your Organization</h2>
            <ol className="admin-list">
                {adminList.map((admin) => (
                    <li>
                        <h3>{admin.Name}</h3>
                        <h3>{admin.Username}</h3>
                    </li>
                ))}
            </ol>
        </section>
    );
}

export default ViewAdminList;