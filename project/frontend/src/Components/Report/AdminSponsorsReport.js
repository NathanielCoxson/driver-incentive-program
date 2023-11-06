import React, { useEffect, useState } from 'react';
import './Report.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import ReportResults from './ReportResults';

function AdminSponsorsReport() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [allSponsors, setAllSponsors] = useState(false);
    const [detailedView, setDetailedView] = useState(false);
    const [sponsorName, setSponsorName] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [results, setResults] = useState([]);
    const axiosPrivate = useAxiosPrivate();

    const handleSponsorSales = async () => {
        setResponseMessage('');
        const StartDate = (new Date()).toISOString().slice(0, 19).replace('T', ' ');
        const EndDate = new Date();
        const startDateParts = startDate.split('-');
        const endDateParts = endDate.split('-');
        EndDate.setUTCFullYear(endDateParts[0]);
        EndDate.setUTCMonth(endDateParts[1]-1);
        EndDate.setUTCDate(Number(endDateParts[2]));
        EndDate.setUTCHours(0);
        EndDate.setUTCMinutes(0);
        EndDate.setUTCSeconds(0);
        console.log(endDate, '|', EndDate.toISOString().slice(0, 19).replace('T', ' '));
        console.log(endDateParts);
        
        if (!startDate || !endDate) {
            setResponseMessage('Missing date range.');
            return;
        }
        if (allSponsors) {
            try {
                const response = await axiosPrivate.get('/reports/sponsors/sales');
                setResults(response?.data?.sponsors);
            } catch (err) {
                if (process.env.NODE_ENV === 'development') console.log(err);
                if (!err?.response) setResponseMessage('No Server Response');
                if (err?.response.status === 404) setResponseMessage('No sales found.')
            }
        }
        else {
            try {
                const response = await axiosPrivate.get(`/reports/sponsors/${sponsorName}/sales`);
                setResults(response?.data?.sales);
            } catch (err) {
                if (process.env.NODE_ENV === 'development') console.log(err);
                if (!err?.response) setResponseMessage('No Server Response');
                if (err?.response.status === 404) setResponseMessage('No sales found.');
            }
        }
    };

    const handleDownload = async () => {
        if (!allSponsors) {
            try {
                const response = await axiosPrivate.get(`reports/sponsors/${sponsorName}/sales/download`, { responseType: 'blob' });
                const blob = response.data;
                const fileURL =
                    window.URL.createObjectURL(blob);
                let alink = document.createElement("a");
                alink.href = fileURL;
                alink.download = "report.csv";
                alink.click();
            } catch (err) {
                if (process.env.NODE_ENV === 'development') console.log(err);
                setResponseMessage("Error downloading report.");
            }
        }
        else {
            try {
                const response = await axiosPrivate.get('reports/sponsors/sales/download', { responseType: 'blob' });
                const blob = response.data;
                const fileURL =
                    window.URL.createObjectURL(blob);
                let alink = document.createElement("a");
                alink.href = fileURL;
                alink.download = "report.csv";
                alink.click();
            } catch (err) {
                if (process.env.NODE_ENV === 'development') console.log(err);
                setResponseMessage("Error downloading report.");
            }
        }
    };

    return (
        <div>
            {/* <div className="auditLog">
                <h2>Audit Log</h2>

                <p>Select Date Range</p>
                <label htmlFor="startdatepicker">Start Date:</label>
                <input type="date" id="startdatepicker" name="startdatepicker" />
                <label htmlFor="enddatepicker">End Date:</label>
                <input type="date" id="enddatepicker" name="enddatepicker" />

                <br />
                <br />

                <p>Generate the report for all sponsors or a specific sponsor?</p>
                <div className="radio-inline">
                    <input type="radio" name="set1" id="allSponBox" value="option1-1" />
                    <label htmlFor="allSponBox" className="styled-radio">All Sponsors</label>

                    <input type="radio" name="set1" id="individualSponBox" value="option1-2" />
                    <label htmlFor="individualSponBox" className="styled-radio">Individual Sponsor&nbsp;&nbsp;</label>
                </div>

                <label htmlFor="indSponText">Sponsor Username:</label>
                <input type="text" id="indSponText" name="indSponsorUser" />

                <br />
                <br />

                <p>Select Audit Log Category</p>
                <div className="radio-inline">
                    <input type="radio" name="set2" id="driverApps" value="option2-1" />
                    <label htmlFor="driverApps" className="styled-radio">Driver Applications</label>

                    <input type="radio" name="set2" id="pointChanges" value="option2-2" />
                    <label htmlFor="pointChanges" className="styled-radio">Point Changes</label>

                    <input type="radio" name="set2" id="pwordChanges" value="option2-3" />
                    <label htmlFor="pwordChanges" className="styled-radio">Password Changes</label>

                    <input type="radio" name="set2" id="loginAttempts" value="option2-4" />
                    <label htmlFor="loginAttempts" className="styled-radio">Login Attempts</label>
                </div>

                <div className="row">
                    <div className="column-right">
                        <a href="#" className="cta-button">
                            View Audit Log
                        </a>
                    </div>
                    <div className="column-left">
                        <a href="#" className="cta-button">
                            Download CSV
                        </a>
                    </div>
                </div>
            </div>

            <div className="sponsorInvoice">
                <h2>Sponsor Invoice</h2>

                <p>Select Date Range</p>
                <label htmlFor="startdatepicker">Start Date:</label>
                <input type="date" id="startdatepicker" name="startdatepicker" />
                <label htmlFor="enddatepicker">End Date:</label>
                <input type="date" id="enddatepicker" name="enddatepicker" />

                <br />
                <br />

                <p>Generate the report for all sponsors or a specific sponsor?</p>
                <div className="radio-inline">
                    <input type="radio" name="set3" id="allSponBox" value="option3-1" />
                    <label htmlFor="allSponBox" className="styled-radio">All Sponsors</label>

                    <input type="radio" name="set3" id="individualSponBox" value="option3-2" />
                    <label htmlFor="individualSponBox" className="styled-radio">Individual Sponsor&nbsp;&nbsp;</label>
                </div>

                <label htmlFor="indSponText">Sponsor Username:</label>
                <input type="text" id="indSponText" name="indSponsorUser" />

                <br />

                <div className="row">
                    <div className="column-right">
                        <a href="#" className="cta-button">View Sponsor Invoice</a>
                    </div>
                    <div className="column-left">
                        <a href="#" className="cta-button">Download CSV</a>
                    </div>
                </div>
            </div>

            <div className="driverSales">
                <h2>Sales by Driver</h2>

                <p>Select Date Range</p>
                <label htmlFor="startdatepicker">Start Date:</label>
                <input type="date" id="startdatepicker" name="startdatepicker" />
                <label htmlFor="enddatepicker">End Date:</label>
                <input type="date" id="enddatepicker" name="enddatepicker" />

                <br />
                <br />

                <p>Generate the report for all sponsors or a specific sponsor?</p>
                <div className="radio-inline">
                    <input type="radio" name="set4" id="allSponBox" value="option4-1" />
                    <label htmlFor="allSponBox" className="styled-radio">All Sponsors</label>

                    <input type="radio" name="set4" id="individualSponBox" value="option4-2" />
                    <label htmlFor="individualSponBox" className="styled-radio">Individual Sponsor&nbsp;&nbsp;</label>
                </div>

                <label htmlFor="indSponText">Sponsor Username:</label>
                <input type="text" id="indSponText" name="indSponsorUser" />

                <br />
                <br />

                <p>Generate the report for all drivers associated with this sponsor or a specific driver?</p>
                <div className="radio-inline">
                    <input type="radio" name="set5" id="allDriverBox" value="option5-1" />
                    <label htmlFor="allDriverBox" className="styled-radio">All Drivers</label>

                    <input type="radio" name="set5" id="individualDriverBox" value="option5-2" />
                    <label htmlFor="individualDriverBox" className="styled-radio">Individual Driver&nbsp;&nbsp;</label>
                </div>
                <label htmlFor="indDriverText">Driver Username:</label>
                <input type="text" id="indDriverText" name="indDriverUser" />

                <br />
                <br />

                <p>Select View Type</p>
                <div className="radio-inline">
                    <input type="radio" name="set6" id="detView" value="option6-1" />
                    <label htmlFor="detView" className="styled-radio">Detailed View</label>

                    <input type="radio" name="set6" id="sumView" value="option6-2" />
                    <label htmlFor="sumView" className="styled-radio">Summary View</label>
                </div>

                <div className="row">
                    <div className="column-right">
                        <a href="#" className="cta-button">View Driver Sales Report</a>
                    </div>
                    <div className="column-left">
                        <a href="#" className="cta-button">Download CSV</a>
                    </div>
                </div>
            </div> */}

            <div className="sponsorSales">
                <h2>Sponsors</h2>

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

                <br />
                <br />

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

                <br />
                <br />

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

                <div className="row">
                    <div className="column-right">
                        <button className="cta-button" onClick={handleSponsorSales}>View Sponsor Sales Report</button>
                    </div>
                    <div className="column-left">
                        <button className="cta-button" onClick={handleDownload}>Download CSV</button>
                    </div>
                    <div className='response-message'>{responseMessage}</div>
                </div>
            </div>

            {results.length > 0 &&
                <ReportResults allSponsors={allSponsors} results={results} />
            }

        </div>
    );
}

export default AdminSponsorsReport;
