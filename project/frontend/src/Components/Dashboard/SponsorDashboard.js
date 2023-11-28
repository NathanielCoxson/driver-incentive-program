import React, { useEffect, useState } from 'react';
import './SponsorDashboard.css';
import { Link } from 'react-router-dom';
import  axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';

function SponsorDashboard() {
    const [joinRequests, setJoinRequests] = useState([]);
    const { auth } = useAuth();
    const SponsorName = auth?.Name;

    useEffect(() => {
        const setApps = async () => {
            try{
                const response = await axios.get(`/applications/sponsors/${SponsorName}`);
                if(response){
                    const apps = response.data.applications.map((res) => {
                        let curApp = {
                            AID: res.AID,
                            driverName: res.Username,
                            requestReason: res.Reason,
                            status: res.ApplicationStatus
                        };
                        return curApp;
                    }).filter(app => app.status === 'Pending');
                    setJoinRequests(apps);
                }
            }
            catch(err){
                if (process.env.NODE_ENV === 'development');
                    console.log("Error retrieving applications: ",err);
            }
        };
        setApps();
        },
        [SponsorName]);

    const acceptOrRejectRequest = async (driverName,AID, accepted) => {
        const updatedRequests = joinRequests.map((request) => {
            if (request.driverName === driverName) {
                return { ...request, status: accepted};
            }
            return request;
        });
        setJoinRequests(updatedRequests);

        try{
            const req = {
                AID: AID,
                ApplicationStatus: accepted
            }
            await axios.post('/applications/process', req);
        }
        catch(err){
            if (process.env.NODE_ENV === 'development');
                    console.log("Error processing application: ",err);
        }
    };

    return (
        <section className="hero">
            {(auth?.view != auth?.Role) ? 
            <>
            {/* Default for view as */}
                <p style={{color: 'yellow'}}>{auth?.view} view</p>
                <h2>Welcome to Your Dashboard</h2>
                <p>Welcome to your sponsor dashboard. Here you can access various features and information.</p>
                <Link to="/dashboard" className="cta-button">
                    Explore
                </Link>

                <div className="join-request-section">
                    <h3>Join Requests</h3>
                    <div key='1' className="join-request">
                        <p>
                            <strong>Driver:</strong> John Smith
                        </p>
                        <p>
                            <strong>Reason:</strong> I'd like to earn rewards
                        </p>
                        <>
                            <button className="cta-button">
                                Accept
                            </button>
                            <button className="cta-button">
                                Reject
                            </button>
                        </>
                    </div>
                    <div key='2' className="join-request">
                        <p>
                            <strong>Driver:</strong> Jane Scott
                        </p>
                        <p>
                            <strong>Reason:</strong> I'm a great driver!
                        </p>
                        <>
                            <button className="cta-button">
                                Accept
                            </button>
                            <button className="cta-button">
                                Reject
                            </button>
                        </>
                    </div>
                </div>
            </>

            :

            <>
                <h2>Welcome to Your Dashboard</h2>
                <p>Welcome to your sponsor dashboard. Here you can access various features and information.</p>
                <Link to="/dashboard" className="cta-button">
                    Explore
                </Link>

                <div className="join-request-section">
                    <h3>Join Requests</h3>
                    {joinRequests.map((request, index) => (
                        <div key={index} className="join-request">
                            <p>
                                <strong>Driver:</strong> {request.driverName}
                            </p>
                            <p>
                                <strong>Reason:</strong> {request.requestReason}
                            </p>
                            {request.status === 'Accept' ? (
                                <p>Accepted</p>
                            ) : request.status === 'Reject' ? (
                                <p>Rejected</p>
                            ) : (
                                <>
                                    <button onClick={() => acceptOrRejectRequest(request.driverName, request.AID, 'Accept')} className="cta-button">
                                        Accept
                                    </button>
                                    <button onClick={() => acceptOrRejectRequest(request.driverName, request.AID, 'Reject')} className="cta-button">
                                        Reject
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </>
            }
        </section>
    );
}

export default SponsorDashboard;
