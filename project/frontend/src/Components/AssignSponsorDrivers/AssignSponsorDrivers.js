import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AssignSponsorDrivers.css';
import  axios from '../../api/axios';

function AssignSponsorDrivers() {
    const [selectedDriver, setSelectedDriver] = useState('');
    const [selectedOrganization, setSelectedOrganization] = useState('');
    const [driverList, setDriverList] = useState([]);
    const [sponsorList, setSponsorList] = useState([]);
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

        const fetchSponsorList = async () => {
            try {
                const response = await axios.get("applications/sponsors");
                isMounted && setSponsorList(response.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                navigate('/dashboard', { state: { from: location }, replace: true });
            }
        }

        fetchDriverList();
        fetchSponsorList();
        return () => {
            isMounted = true;
        }
    }, []);


    const handleDriverChange = async (event) =>{
        setSelectedDriver(event.target.value);
    }
    
    const handleOrganizationChange = async (event) =>{
        setSelectedOrganization(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const input = event.target;

        try {
            await axios.post('applications/assign_driver', {DriverName: selectedDriver, SponsorName: selectedOrganization});
        } catch (err){
            console.error('Error submitting form: ', err);
        }
    }

    const defaultOrganization = 'No Sponsor'
    const defaultDriver = 'No Driver'

    return (
        <section>
            <form id='assignDriver' onSubmit={handleSubmit}>
                <label htmlFor='driverSelect'>Select Driver</label>
                <select id='driverSelect' value={selectedDriver} onChange={handleDriverChange}>
                    <option>{defaultDriver}</option>
                    {(driverList.length > 0) && driverList.map((driver) => (
                        <option key={driver.UID} value={driver.Username}>
                            {driver.Name}
                        </option>
                    ))}
                </select>
                <label htmlFor='organizationSelect'>Select Sponsor Organization</label>
                <select id='organizationSelect' value={selectedOrganization} onChange={handleOrganizationChange}>
                    <option>{defaultOrganization}</option>
                    {(sponsorList.length > 0) && sponsorList.map((sponsor) => (
                        <option key={sponsor.SID} value={sponsor.SponsorName}>
                            {sponsor.SponsorName}
                        </option>
                    ))}
                </select>
                <div>
                <button type='submit' className="cta-button" disabled={selectedDriver===defaultDriver || selectedOrganization===defaultOrganization}>Assign</button>
                </div>
            </form>
        </section>
    );
}

export default AssignSponsorDrivers;
