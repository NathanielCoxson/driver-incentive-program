import React, { useState } from 'react';
import './Report.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import ReportResults from './ReportResults';

function DriverSalesReport() {
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

    const handleDownload = async () => {
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

        if (!allSponsors) {
            try {
                const response = await axiosPrivate.get(`reports/sponsors/${sponsorName}/sales/download?StartDate=${StartDate}&EndDate=${EndDate}`, { responseType: 'blob' });
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
                const response = await axiosPrivate.get(`reports/sponsors/sales/download?StartDate=${StartDate}&EndDate=${EndDate}`, { responseType: 'blob' });
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
        <div className="driverSales report-container">
            <h2>Sales by Driver</h2>

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
                {responseMessage.length > 0 && <div className='response-message'>{responseMessage}</div>}
            </div>

            {results.length > 0 &&
                <ReportResults allSponsors={allSponsors} results={results} />
            }
        </div>
    );
}

export default DriverSalesReport;
