import './About.css';
import { useState, useEffect } from 'react';

function About() {
    const [release, setRelease] = useState({});

    const fetchRelease = async () => {
        // URL of the API endpoint
        const apiUrl = process.env.NODE_ENV === 'production' ? 'http://34.225.199.196/' : 'http://localhost:3001/api/about';
        // Make the GET request
        await fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                // Handle the JSON response data here
                setRelease(data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    useEffect(() => {
        fetchRelease();
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