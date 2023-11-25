import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function AuditLogReport({ getDateRange }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [allSponsors, setAllSponsors] = useState(false);
    const [sponsorName, setSponsorName] = useState('');
    const [results, setResults] = useState([]);
    const [category, setCategory] = useState('applications');
    const [responseMessage, setResponseMessage] = useState('');
    const axiosPrivate = useAxiosPrivate();

    function validateForm() {
        if (!startDate || !endDate) {
            setResponseMessage('Missing date range.');
            return false;
        }
        if (!allSponsors && !sponsorName) {
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
        
        switch (category) {
            case 'applications': 
                await getApplications(StartDate, EndDate);
                break;
            default: 
                break;
        }
        if (results.length === 0) setResponseMessage('No results found');
    };

    const handleDownload = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        setResponseMessage('');

        const { StartDate, EndDate } = getDateRange(startDate, endDate);

        switch (category) {
            case 'applications':
                await downloadApplications(StartDate, EndDate);
                break;
            default:
                break;
        }
    }

    async function getApplications(startDate, endDate) {
        // Construct query string
        let query = [];
        if (startDate) query.push(`StartDate=${startDate}`);
        if (endDate) query.push(`EndDate=${endDate}`);
        let queryString = query.join('&');

        try {
            const response = await axiosPrivate.get(`/reports/audit/applications?${queryString}`);
            let applications = response?.data?.applications;
            if (!allSponsors) applications = applications.filter(app => app.SponsorName === sponsorName);
            setResults(applications);
        } catch (err) {
            if (process.env.NODE_ENV === 'development') console.log(err);
            if (!err?.response) setResponseMessage('No Server Response');
            if (err?.response.status === 404) setResponseMessage('No data found.');
            if (err?.response.status === 500) setResponseMessage('Sever Error');
        }
    }

    async function downloadApplications(startDate, endDate) {
        // Construct query string
        let query = [];
        if (startDate) query.push(`StartDate=${startDate}`);
        if (endDate) query.push(`EndDate=${endDate}`);
        let queryString = query.join('&');

        try {
            const response = await axiosPrivate.get(`reports/audit/applications/download?${queryString}`, {responseType: 'blob'});
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

    return (
        <div className="audit-log-report-container report-container">
            <h2>Audit Log</h2>

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

            { /* Category Selection */ }
            <p>Select Audit Log Category</p>
            <div className="radio-inline">
                <input 
                    type="radio" 
                    name="set2" 
                    id="applications" 
                    value="applications"
                    onChange={(e) => setCategory(e.target.value)}
                    checked={category === 'applications'}
                />
                <label htmlFor="driverApps" className="styled-radio">Driver Applications</label>

                <input 
                    type="radio" 
                    name="set2" 
                    id="points" 
                    value="points"
                    onChange={(e) => setCategory(e.target.value)}
                    checked={category === 'points'}
                />
                <label htmlFor="pointChanges" className="styled-radio">Point Changes</label>

                <input 
                    type="radio" 
                    name="set2" 
                    id="pwordChanges" 
                    value="pwordChanges"
                    onChange={(e) => setCategory(e.target.value)}
                    checked={category === 'pwordChanges'}
                />
                <label htmlFor="pwordChanges" className="styled-radio">Password Changes</label>

                <input 
                    type="radio" 
                    name="set2" 
                    id="loginAttempts" 
                    value="loginAttempts"
                    onChange={(e) => setCategory(e.target.value)}
                    checked={category === 'loginAttempts'}
                />
                <label htmlFor="loginAttempts" className="styled-radio">Login Attempts</label>
            </div>

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
            {results.length > 0 && <table>
                <thead>
                    <tr>
                        {Object.keys(results[0]).map(key => <th key={key+'Header'}>{key}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {results.map((result, i) => {
                        return (
                            <tr key={'result-'+i}>
                                {Object.keys(result).map((key, i) => <td key={key+'-value-'+i}>{result[key]}</td>)}
                            </tr>
                        )
                    })}
                </tbody>
            </table>}
        </div>
    );
}

export default AuditLogReport;