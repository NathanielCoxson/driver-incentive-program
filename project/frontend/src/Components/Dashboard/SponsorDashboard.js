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
                    });
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
        [SponsorName, joinRequests]);

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
            <h2>Welcome to Your Dashboard</h2>
            <p>Welcome to your sponsor dashboard. Here you can access various features and information.</p>
            <Link to='/password-reset'>Forgot Password?</Link>

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
        </section>
    );
}

export default SponsorDashboard;
