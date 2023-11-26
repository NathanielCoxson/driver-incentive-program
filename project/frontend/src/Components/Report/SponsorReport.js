import React, { useEffect, useState } from 'react';
import './Report.css';
import AuditLogReport from './AuditLogReport';
import PointTrackingReport from './PointTrackingReport';
import useAuth from '../../hooks/useAuth';


function SponsorReport() {
    const [type, setType] = useState('point-tracking');
    const [SponsorName, setSponsorName] = useState('');
    const { auth } = useAuth();
    const reportTypes = {
        'point-tracking': <PointTrackingReport getDateRange={getDateRange} view='sponsor' SponsorName={SponsorName} />,
        'audit-log': <AuditLogReport getDateRange={getDateRange} view='sponsor' SponsorName={SponsorName} />,
    };
    
    function getDateRange(start, end) {
        let StartDate = new Date();
        let EndDate = new Date();
        const startDateParts = start.split('-');
        const endDateParts = end.split('-');

        StartDate.setUTCFullYear(startDateParts[0]);
        StartDate.setUTCMonth(startDateParts[1] - 1);
        StartDate.setUTCDate(Number(startDateParts[2]));
        StartDate.setUTCHours(0);
        StartDate.setUTCMinutes(0);
        StartDate.setUTCSeconds(0);
        StartDate = StartDate.toISOString().slice(0, 19).replace('T', ' ');

        EndDate.setUTCFullYear(endDateParts[0]);
        EndDate.setUTCMonth(endDateParts[1] - 1);
        EndDate.setUTCDate(Number(endDateParts[2]));
        EndDate.setUTCHours(23);
        EndDate.setUTCMinutes(59);
        EndDate.setUTCSeconds(59);
        EndDate = EndDate.toISOString().slice(0, 19).replace('T', ' ');

        return { StartDate, EndDate };
    }

    useEffect(() => {
        if (auth?.SponsorName) setSponsorName(auth?.SponsorName);
    }, [auth]);

    return (
        <section className="hero reports-section">
            <h1>Reports</h1>
            <div className='report-type-select'>
                <select name='type' onChange={e => setType(e.target.value)}>
                    <option name='point-tracking' value='point-tracking'>Point Tracking</option>
                    <option name='audit-log' value='audit-log'>Audit Log</option>
                </select>
            </div>
            {reportTypes[type]}
        </section>
    );
}

export default SponsorReport;
