import React, { useState } from 'react';
import './Report.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

function SalesReport() {
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

    function validateForm() {
        if (!startDate || !endDate) {
            setResponseMessage('Missing date range.');
            return false;
        }
        if (!allSponsors && !sponsorName) {
            setResponseMessage('Missing Sponsor Name');
            return false;
        }
        if (!allDrivers && !Username) {
            setResponseMessage('Missing Driver Username');
            return false;
        }
        return true;
    }

    const handleSalesSubmit = async () => {
        if (!validateForm()) return;
        setResponseMessage('');
        setResults('');

        const { StartDate, EndDate } = getDateRange(startDate, endDate);

        // Construct query string
        let query = [];
        if (!allSponsors && sponsorName) query.push(`SponsorName=${sponsorName}`);
        if (!allDrivers && Username) query.push(`Username=${Username}`);
        if (StartDate && EndDate) query.push(`StartDate=${StartDate}&EndDate=${EndDate}`);
        let queryString = query.join('&');

        // Make request
        try {
            const response = await axiosPrivate.get(`/reports/sales?${queryString}`);
            setResults(response?.data?.sales);
        } catch (err) {
            if (process.env.NODE_ENV === 'development') console.log(err);
            if (!err?.response) setResponseMessage('No Server Response');
            if (err?.response.status === 404) setResponseMessage('No sales found.');
        }
    };

    const handleSalesDownload = async () => {
        if (!validateForm()) return;
        setResponseMessage('');

        const { StartDate, EndDate } = getDateRange(startDate, endDate);

        // Construct query string
        let query = [];
        if (!allSponsors && sponsorName) query.push(`SponsorName=${sponsorName}`);
        if (!allDrivers && Username) query.push(`Username=${Username}`);
        if (StartDate && EndDate) query.push(`StartDate=${StartDate}&EndDate=${EndDate}`);
        let queryString = query.join('&');

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
    };

    return (
        <div className="sponsorSales report-container">
            <h2>Sales Report</h2>

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
                        setSponsorName('');
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
                        setSponsorName('');
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
            <p>Generate the report for all drivers associated with this sponsor or a specific driver?</p>
            <div className="radio-inline">
                <input
                    type="radio"
                    name="set5"
                    id="allDriverBox"
                    value="option5-1"
                    checked={allDrivers}
                    onChange={e => {
                        setAllDrivers(prev => !prev);
                        setUsername('');
                    }}
                />
                <label htmlFor="allDriverBox" className="styled-radio">All Drivers</label>

                <input
                    type="radio"
                    name="set5"
                    id="individualDriverBox"
                    value="option5-2"
                    checked={!allDrivers}
                    onChange={e => {
                        setAllDrivers(prev => !prev);
                        setUsername('');
                    }}
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
                    <button className="cta-button" onClick={handleSalesSubmit}>Generate Report</button>
                </div>
                <div className="column-left">
                    <button className="cta-button" onClick={handleSalesDownload}>Download CSV</button>
                </div>
                {responseMessage.length > 0 && <div className='response-message'>{responseMessage}</div>}
            </div>

            { /* Resuts */}
            {results.length > 0 && <>
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Points</th>
                            <th>Item Count</th>
                            <th>Order Date</th>
                            <th>Sponsor Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(result => {
                            return (
                                <tr key={result.OID}>
                                    <td>{result.Username}</td>
                                    <td>{result.total}</td>
                                    <td>{result.items?.length}</td>
                                    <td>{result.OrderDate}</td>
                                    <td>{result.SponsorName}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </>}
        </div>
    );
}

export default SalesReport;
