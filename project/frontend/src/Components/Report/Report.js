import React, { useEffect, useState } from 'react';
import './Report.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import ReportResults from './ReportResults';

function Report(props) {
    const { type } = props;
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [allSponsors, setAllSponsors] = useState(false);
    const [detailedView, setDetailedView] = useState(false);
    const [sponsorName, setSponsorName] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [results, setResults] = useState([]);
    const [allDrivers, setAllDrivers] = useState(false);
    const [Username, setUsername] = useState('');
    const axiosPrivate = useAxiosPrivate();

    const handleSponsorSalesSubmit = async () => {
        if (!startDate || !endDate || (!allSponsors && !sponsorName)) return;
        setResponseMessage('');
        let StartDate = new Date();
        let EndDate = new Date();
        const startDateParts = startDate.split('-');
        const endDateParts = endDate.split('-');
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
        console.log(EndDate);

        if (!startDate || !endDate) {
            setResponseMessage('Missing date range.');
            return;
        }
        if (allSponsors) {
            try {
                const response = await axiosPrivate.get(`/reports/sponsors/sales?StartDate=${StartDate}&EndDate=${EndDate}`);
                setResults(response?.data?.sponsors);
            } catch (err) {
                if (process.env.NODE_ENV === 'development') console.log(err);
                if (!err?.response) setResponseMessage('No Server Response');
                if (err?.response.status === 404) setResponseMessage('No sales found.')
            }
        }
        else {
            if (!sponsorName) {
                setResponseMessage("Please input a sponsor name.");
                return;
            }
            try {
                const response = await axiosPrivate.get(`/reports/sponsors/${sponsorName}/sales?StartDate=${StartDate}&EndDate=${EndDate}`);
                setResults(response?.data?.sales);
            } catch (err) {
                if (process.env.NODE_ENV === 'development') console.log(err);
                if (!err?.response) setResponseMessage('No Server Response');
                if (err?.response.status === 404) setResponseMessage('No sales found.');
            }
        }
    };

    const handleSponsorSalesDownload = async () => {
        if (!startDate || !endDate || (!allSponsors && !sponsorName)) return;
        let StartDate = new Date();
        let EndDate = new Date();
        const startDateParts = startDate.split('-');
        const endDateParts = endDate.split('-');
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

        // Construct query string
        let query = [];
        if (!allSponsors && sponsorName) query.push(`SponsorName=${sponsorName}`);
        if (!allDrivers && Username) query.push(`Username=${Username}`);
        if (StartDate && EndDate) query.push(`StartDate=${StartDate}&EndDate=${EndDate}`);
        let queryString = query.join('&');
        console.log(queryString);

        // Make request to server
        try {
            const response = await axiosPrivate.get(`reports/sales/download?${queryString}`, {responseType: 'blob'});
            const blob = response.data;
            const fileURL = window.URL.createObjectURL(blob);
            let alink = document.createElement("a");
            alink.href = fileURL;
            alink.download = "report.csv";
            alink.click();
        } catch (err) {
            if (process.env.NODE_ENV === 'development') console.log(err);
            setResponseMessage("Error downloading report.");
        }

        // if (!allSponsors) {
        //     try {
        //         const response = await axiosPrivate.get(`reports/sponsors/${sponsorName}/sales/download?StartDate=${StartDate}&EndDate=${EndDate}`, { responseType: 'blob' });
        //         const blob = response.data;
        //         const fileURL =
        //             window.URL.createObjectURL(blob);
        //         let alink = document.createElement("a");
        //         alink.href = fileURL;
        //         alink.download = "report.csv";
        //         alink.click();
        //     } catch (err) {
        //         if (process.env.NODE_ENV === 'development') console.log(err);
        //         setResponseMessage("Error downloading report.");
        //     }
        // }
        // else {
        //     try {
        //         const response = await axiosPrivate.get(`reports/sponsors/sales/download?StartDate=${StartDate}&EndDate=${EndDate}`, { responseType: 'blob' });
        //         const blob = response.data;
        //         const fileURL =
        //             window.URL.createObjectURL(blob);
        //         let alink = document.createElement("a");
        //         alink.href = fileURL;
        //         alink.download = "report.csv";
        //         alink.click();
        //     } catch (err) {
        //         if (process.env.NODE_ENV === 'development') console.log(err);
        //         setResponseMessage("Error downloading report.");
        //     }
        // }
    };

    const handleDriverSalesSubmit = async () => {
        if (!startDate || !endDate || (!allDrivers && !Username)) return;
        setResponseMessage('');
        let StartDate = new Date();
        let EndDate = new Date();
        const startDateParts = startDate.split('-');
        const endDateParts = endDate.split('-');
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

        if (!startDate || !endDate) {
            setResponseMessage('Missing date range.');
            return;
        }
        if (allDrivers) {
            try {
                const response = await axiosPrivate.get(`/reports/sponsors/sales?StartDate=${StartDate}&EndDate=${EndDate}`);
                setResults(response?.data?.sponsors);
            } catch (err) {
                if (process.env.NODE_ENV === 'development') console.log(err);
                if (!err?.response) setResponseMessage('No Server Response');
                if (err?.response.status === 404) setResponseMessage('No sales found.')
            }
        }
        else {
            if (!Username) {
                setResponseMessage("Please input a driver name.");
                return;
            }
            try {
                const response = await axiosPrivate.get(`/reports/drivers/${Username}/sales?StartDate=${StartDate}&EndDate=${EndDate}`);
                setResults(response?.data?.sales);
            } catch (err) {
                if (process.env.NODE_ENV === 'development') console.log(err);
                if (!err?.response) setResponseMessage('No Server Response');
                if (err?.response.status === 404) setResponseMessage('No sales found.');
            }
        }
    };

    const handleDriverSalesDownload = async () => {
        console.log('Driver download');
    };

    const eventHandlers = {
        'sponsor-sales': { submit: handleSponsorSalesSubmit, download: handleSponsorSalesDownload },
        'driver-sales': {submit: handleDriverSalesSubmit, download: handleDriverSalesDownload },
    };

    return (
        <div className="sponsorSales report-container">
            {type === 'sponsor-sales' && <h2>Sales by Sponsor</h2>}
            {type === 'driver-sales' && <h2>Sales by Driver</h2>}

            { /* Date range input */}
            <p>Select Date Range</p>
            <label htmlFor="startdatepicker">Start Date:</label>
            <input
                type="date"
                id="startdatepicker"
                name="startdatepicker"
                onChange={(e) => setStartDate(e.target.value)}
            />
            <label htmlFor="enddatepicker">End Date:</label>
            <input
                type="date"
                id="enddatepicker"
                name="enddatepicker"
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
            />

            { /* All sponsors or specific sponsor select */}
            <p>Generate the report for all sponsors or a specific sponsor?</p>
            <div className="radio-inline">
                <input
                    type="radio"
                    name="set7"
                    id="allSponBox"
                    value="option7-1"
                    checked={allSponsors}
                    onChange={e => {
                        setAllSponsors(prev => !prev);
                        setResults([]);
                    }}
                />
                <label htmlFor="allSponBox" className="styled-radio">All Sponsors</label>

                <input
                    type="radio"
                    name="set7"
                    id="individualSponBox"
                    value="option7-2"
                    checked={!allSponsors}
                    onChange={e => {
                        setAllSponsors(prev => !prev);
                        setResults([]);
                    }}
                />
                <label htmlFor="individualSponBox" className="styled-radio">Individual Sponsor&nbsp;&nbsp;</label>
            </div>

            { /* Specific sponsor name input */}
            {!allSponsors &&
                <>
                    <label htmlFor="indSponText">Sponsor Username:</label>
                    <input
                        type="text"
                        id="indSponText"
                        name="indSponsorUser"
                        onChange={e => setSponsorName(e.target.value)}
                    />
                </>
            }

            { /* Driver Username Input */}
            {type === 'driver-sales' && <>
                <p>Generate the report for all drivers associated with this sponsor or a specific driver?</p>
                <div className="radio-inline">
                    <input
                        type="radio"
                        name="set5"
                        id="allDriverBox"
                        value="option5-1"
                        checked={allDrivers}
                        onChange={e => setAllDrivers(prev => !prev)}
                    />
                    <label htmlFor="allDriverBox" className="styled-radio">All Drivers</label>

                    <input
                        type="radio"
                        name="set5"
                        id="individualDriverBox"
                        value="option5-2"
                        checked={!allDrivers}
                        onChange={e => setAllDrivers(prev => !prev)}
                    />
                    <label htmlFor="individualDriverBox" className="styled-radio">Individual Driver&nbsp;&nbsp;</label>
                </div>

                {!allDrivers && <>
                    <label htmlFor="indDriverText">Driver Username:</label>
                    <input 
                        type="text" 
                        id="indDriverText" 
                        name="indDriverUser" 
                        onChange={e => setUsername(e.target.value)}
                    />
                </>}
            </>}

            { /* View type select */}
            <p>Select View Type</p>
            <div className="radio-inline">
                <input
                    type="radio"
                    name="set8"
                    id="detView"
                    value="option8-1"
                    checked={detailedView}
                    onChange={e => {
                        setDetailedView(prev => !prev);
                        setResults([]);
                    }}
                />
                <label htmlFor="detView" className="styled-radio">Detailed View</label>

                <input
                    type="radio"
                    name="set8"
                    id="sumView"
                    value="option8-2"
                    checked={!detailedView}
                    onChange={e => {
                        setDetailedView(prev => !prev);
                        setResults([]);
                    }}
                />
                <label htmlFor="sumView" className="styled-radio">Summary View</label>
            </div>

            { /* Submit and download buttons */}
            <div className="row">
                <div className="column-right">
                    <button className="cta-button" onClick={eventHandlers[type].submit}>Generate Report</button>
                </div>
                <div className="column-left">
                    <button className="cta-button" onClick={eventHandlers[type].download}>Download CSV</button>
                </div>
                {responseMessage.length > 0 && <div className='response-message'>{responseMessage}</div>}
            </div>

            { /* Resuts */}
            {results.length > 0 &&
                <ReportResults allSponsors={allSponsors} allDrivers={allDrivers} results={results} type={type} />
            }
        </div>
    );
}

export default Report;
