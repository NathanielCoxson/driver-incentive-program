import React from 'react';
import  axios from '../../api/axios';
import { useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ViewAdminList(){
    const [adminList, setAdminList] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        let isMounted = true;

        const fetchAdminList = async () => {
            try {
                const response = await axios.get("applications/admin");
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
            <h2>All Admin Users</h2>
            <ol className="admin-list" style={{textAlign:'left'}}>
                {adminList.map((admin) => (
                    <li>
                        <h3>Name: <em>{admin.Name}</em></h3>
                        <h3>Username: <em>{admin.Username}</em></h3>
                    </li>
                ))}
            </ol>
        </section>
    );
}

export default ViewAdminList;