import  axios from '../../api/axios';
import { useState, useEffect} from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

function ViewSponsorList(){
    const [sponsorList, setSponsorList] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;

        const fetchSponsorList = async () => {
            try {
                const response = await axios.get("applications/sponsors");
                isMounted && setSponsorList(response.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                navigate('/dashboard', { state: { from: location }, replace: true });
            }
        }
        fetchSponsorList();
        return () => {
            isMounted = true;
        }
    }, []);

    return (
        <section id="sponsor-list" className="hero">
            <h2>All Admin Users</h2>
            <ol className="list" style={{textAlign:'left'}}>
                {sponsorList.map((sponsor) => (
                    <li key={sponsor.SID}>
                        <p><strong>Name: </strong><em>{sponsor.SponsorName}</em></p>
                        <Link to="/dashboard/sponsor_driver_list" state={{sponsor: sponsor.SponsorName}}>List of Drivers</Link>
                    </li>
                ))}
            </ol>
        </section>
    );
}

export default ViewSponsorList;