import './About.css';
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';

function About() {
    const [release, setRelease] = useState({});
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;

        const fetchRelease = async () => {
            // Make the GET request
            try {
                const response = await axiosPrivate.get('/about');
                isMounted && setRelease(response.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }
        fetchRelease();
        return () => {
            isMounted = true;
        }
    }, []);

    return (<main>
        <section className="hero">
            <h2>About Page</h2>
            {
                release ?
                    <div id='about-data'>
                        <p><strong>Team Number:</strong> {release.TeamNumber} </p>
                        <p><strong>Version Number:</strong> {release.VersionNumber} </p>
                        <p><strong>Release Date:</strong> {new Date(release.ReleaseDate).toLocaleString()} </p>
                        <p><strong>Product Name:</strong> {release.ProductName}</p>
                        <p><strong>Product Description:</strong> {release.ProductDescription} </p>
                    </div> :
                    <></>
            }
        </section>
    </main>)
}

export default About;