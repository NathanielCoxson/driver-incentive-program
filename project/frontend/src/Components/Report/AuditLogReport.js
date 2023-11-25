import { useState } from "react";

function AuditLogReport({ getDateRange }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [allSponsors, setAllSponsors] = useState(false);
    const [sponsorName, setSponsorName] = useState('');
    const [results, setResults] = useState([]);
    const [category, setCategory] = useState('applications');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { StartDate, EndDate } = getDateRange(startDate, endDate);
        console.log(category, StartDate, EndDate);
    };

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

            <div className="row">
                <div className="column-right">
                    <button className="cta-button" onClick={handleSubmit}>
                        View Audit Log
                    </button>
                </div>
                <div className="column-left">
                    <button className="cta-button">
                        Download CSV
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AuditLogReport;