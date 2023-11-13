import React, { useEffect, useState } from 'react';
import './Report.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

function SalesReport({ type }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [allSponsors, setAllSponsors] = useState(false);
    const [detailedView, setDetailedView] = useState(false);
    const [sponsorName, setSponsorName] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [results, setResults] = useState([]);
    const [allDrivers, setAllDrivers] = useState(false);
    const [Username, setUsername] = useState('');
    const [sponsorInvoiceResults, setSponsorInvoiceResults] = useState([]);
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

    useEffect(() => setSponsorInvoiceResults([]), []);

    function validateForm() {
        if (!startDate || !endDate) {
            setResponseMessage('Missing date range.');
            return false;
        }
        if (!allSponsors && !sponsorName) {
            setResponseMessage('Missing Sponsor Name');
            return false;
        }
        if (type === 'sales' && !allDrivers && !Username) {
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
            let response = await axiosPrivate.get(`/reports/sales?${queryString}`);
            setResults(response?.data?.sales);
        } catch (err) {
            if (process.env.NODE_ENV === 'development') console.log(err);
            if (!err?.response) setResponseMessage('No Server Response');
            if (err?.response.status === 404) setResponseMessage('No sales found.');
            if (err?.response.status === 500) setResponseMessage('Sever Error');
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

    useEffect(() => {
        if (type !== 'invoice') return;

        let sponsors = new Map();
        let drivers = new Map();
        for (let sale of results) {
            if (sponsors.has(sale.SponsorName)) sponsors.set(sale.SponsorName, [...sponsors.get(sale.SponsorName), sale]);
            else sponsors.set(sale.SponsorName, [sale]);

            if (drivers.has(sale.Username)) drivers.set(sale.Username, [...drivers.get(sale.Username), sale]);
            else drivers.set(sale.Username, [sale]);
        }
        for (let sponsor of sponsors) {
            let drivers = new Map();
            for (let sale of sponsor[1]) {
                if (drivers.has(sale.Username)) drivers.set(sale.Username, [...drivers.get(sale.Username), sale]);
                else drivers.set(sale.Username, [sale]);
            }
            sponsors.set(sponsor[0], Array.from(drivers, ([Username, sales]) => ({ Username, sales })));
        }
        setSponsorInvoiceResults(Array.from(sponsors, ([SponsorName, drivers]) => ({SponsorName, drivers})));
    }, [results, type]);

    useEffect(() => {
        setResults([]);
        setSponsorInvoiceResults([]);
    }, [type]);

    useEffect(() => console.log(sponsorInvoiceResults), [sponsorInvoiceResults])

    return (
        <div className="sales-report-container report-container">
            {type === 'sales' && <h2>Sales Report</h2>}
            {type === 'invoice' && <h2>Sponsor Invoice</h2>}

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
            {type === 'sales' && <>
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
            </>}
            
            { /* View type select */}
            {type === 'sales' && <>
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
            </>}
            
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
            {(results.length > 0 && type === 'sales') && <>
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
            {(sponsorInvoiceResults.length > 0 && type === 'invoice') && <div className='invoice-container'>
                <ul>
                    {sponsorInvoiceResults.map(sponsor => {
                        return (<>
                            <li key={sponsor.SponsorName + '-invoice-results'}>{sponsor.SponsorName} Total: ${sponsor.drivers.reduce((acc, driver) => {
                                return driver.sales.reduce((acc, sale) => {
                                    return acc + sale.total * sale.ConversionRate}
                                , 0)
                            }, 0)}</li>
                            <ul>
                                {sponsor.drivers.map(driver => {
                                    return (<>
                                        <li key={driver.Username + '-invoice-lines'}>{driver.Username} Total: ${driver.sales.reduce((acc, curr) => {
                                            return acc + curr.total * curr.ConversionRate
                                        }, 0)}
                                        </li>
                                        <ul>
                                            {driver.sales.map(sale => {
                                                return (<>
                                                    <li key={sale.OID + '-invoice-result'}>
                                                        Item Count: {sale.items.length}, {sale.total} Points, ${parseFloat(sale.ConversionRate * sale.total).toFixed(2)}
                                                    </li>
                                                    <ul>
                                                        {sale.items.map(item => {
                                                            return (<li key={sale.OID + 'item-' + item.Itemname}>
                                                                Name: {item.ItemName}, Points: {item.ItemCost}, ${parseFloat(item.ItemCost * sale.ConversionRate).toFixed(2)}
                                                            </li>)
                                                        })}
                                                    </ul>
                                                </>)
                                            })}
                                        </ul>
                                    </>)
                                })}
                            </ul>
                        </>)
                    })}
                    <li>Total: ${
                        sponsorInvoiceResults.reduce((acc, sponsor) => {
                            return acc + sponsor.drivers.reduce((acc, driver) => {
                                return acc + driver.sales.reduce((acc, sale) => acc + sale.total * sale.ConversionRate, 0)
                            }, 0)
                        }, 0)
                    }</li>
                </ul>
            </div>}
        </div>
    );
}

export default SalesReport;
