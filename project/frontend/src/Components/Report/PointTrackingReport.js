import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function PointTrackingReport({ getDateRange, view, SponsorName }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [allDrivers, setAllDrivers] = useState(false);
    const [driverName, setDriverName] = useState('');
    const [results, setResults] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const axiosPrivate = useAxiosPrivate();

    function validateForm() {
        if (!startDate || !endDate) {
            setResponseMessage('Missing date range.');
            return false;
        }
        if (!allDrivers && !driverName) {
            setResponseMessage('Missing Sponsor Name');
            return false;
        }
        return true;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        setResponseMessage('');

        const { StartDate, EndDate } = getDateRange(startDate, endDate);
        
        // Construct query string
        let query = [];
        if (StartDate) query.push(`StartDate=${StartDate}`);
        if (EndDate) query.push(`EndDate=${EndDate}`);
        if (!allDrivers) query.push(`DriverName=${driverName}`);
        let queryString = query.join('&');

        try {
            const response = await axiosPrivate.get(`/reports/${SponsorName}/driverPoints?${queryString}`);
            let results = response?.data?.results;
            if (results.length === 0) setResponseMessage('No results found');
            setResults(results);
        } catch (err) {
            if (process.env.NODE_ENV === 'development') console.log(err);
            if (!err?.response) setResponseMessage('No Server Response');
            if (err?.response?.status === 404) setResponseMessage('No data found.');
            if (err?.response?.status === 500) setResponseMessage('Sever Error');
        }
    };

    const handleDownload = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        setResponseMessage('');

        const { StartDate, EndDate } = getDateRange(startDate, endDate);

        // Construct query string
        let query = [];
        if (StartDate) query.push(`StartDate=${StartDate}`);
        if (EndDate) query.push(`EndDate=${EndDate}`);
        if (!allDrivers) query.push(`DriverName=${driverName}`);
        let queryString = query.join('&');

        try {
            const response = await axiosPrivate.get(`/reports/${SponsorName}/driverPoints/download?${queryString}`, {responseType: 'blob'});
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
    }

    useEffect(() => {
        if (view === 'sponsor' && SponsorName) {
            setDriverName(SponsorName);
            setAllDrivers(false);
        }
    }, [view, SponsorName]);

    return (
        <div className="point-tracking-report-container report-container">
            <h2>Driver Point Tracking</h2>

            { /* Date range input */ }
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

            { /* All drivers or specific driver select */}
            <p>Generate the report for all drivers or a specific driver?</p>
            <div className="radio-inline">
                <input
                    type="radio"
                    name="set7"
                    id="allSponBox"
                    value="option7-1"
                    checked={allDrivers}
                    onChange={e => {
                        setAllDrivers(prev => !prev);
                        setResults([]);
                        setDriverName('');
                    }}
                />
                <label htmlFor="allSponBox" className="styled-radio">All Drivers</label>

                <input
                    type="radio"
                    name="set7"
                    id="individualSponBox"
                    value="option7-2"
                    checked={!allDrivers}
                    onChange={e => {
                        setAllDrivers(prev => !prev);
                        setResults([]);
                        setDriverName('');
                    }}
                />
                <label htmlFor="individualSponBox" className="styled-radio">Individual Driver&nbsp;&nbsp;</label>
            </div>

            { /* Specific sponsor name input */}
            {!allDrivers &&
                <>
                    <label htmlFor="indSponText">Driver Username:</label>
                    <input
                        type="text"
                        id="indSponText"
                        name="indSponsorUser"
                        onChange={e => setDriverName(e.target.value)}
                    />
                </>
            }

            { /* Submit and download buttons */ }
            <div className="row">
                <div className="column-right">
                    <button className="cta-button" onClick={handleSubmit}>
                        View Audit Log
                    </button>
                </div>
                <div className="column-left">
                    <button className="cta-button" onClick={handleDownload}>
                        Download CSV
                    </button>
                </div>
                {responseMessage.length > 0 && <div className='response-message'>{responseMessage}</div>}
            </div>

            { /* Results table */ }
            {results.length > 0 && <div className="report-list point-tracking">
                <ul>
                    {results.map(driver => {
                        return (<>
                            <li key={driver.Username+'-point-tracking'}>{driver.Username} Point History:</li>
                            <li key={driver.Username+'-point-trackig-table-container'}>
                                <table key={driver.Username+'-point-trackig-table'}>
                                    <thead>
                                        <tr>
                                            {Object.keys(driver.pointChanges[0]).map(key => <th key={key + '-header'}>{key}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {driver.pointChanges.map((result, i) => {
                                            return (
                                                <tr key={'result-' + i}>
                                                    {Object.keys(result).map((key, i) => <td key={key + '-value-' + i}>{result[key]}</td>)}
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </li>
                        </>)
                    })}
                </ul>
            </div>}
        </div>
    );
}

export default PointTrackingReport;
