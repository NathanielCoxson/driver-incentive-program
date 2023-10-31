import React from 'react';
import './Report.css';

function AdminReport() {
    return (
        <main>
            <section className="hero">
                <h1>Reports</h1>
                <br />
                <div className="auditLog">
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
                        <label htmlFor="allSponBox">All Sponsors</label>

                        <input type="radio" name="set1" id="individualSponBox" value="option1-2" />
                        <label htmlFor="individualSponBox">Individual Sponsor&nbsp;&nbsp;</label>
                    </div>

                    <label htmlFor="indSponText">Sponsor Username:</label>
                    <input type="text" id="indSponText" name="indSponsorUser" />

                    <br />
                    <br />

                    <p>Select Audit Log Category</p>
                    <div className="radio-inline">
                        <input type="radio" name="set2" id="driverApps" value="option2-1" />
                        <label htmlFor="driverApps">Driver Applications</label>

                        <input type="radio" name="set2" id="pointChanges" value="option2-2" />
                        <label htmlFor="pointChanges">Point Changes</label>

                        <input type="radio" name="set2" id="pwordChanges" value="option2-3" />
                        <label htmlFor="pwordChanges">Password Changes</label>

                        <input type="radio" name="set2" id="loginAttempts" value="option2-4" />
                        <label htmlFor="loginAttempts">Login Attempts</label>
                    </div>

                    <div className="row">
                        <div className="column-right">
                            <a href="#" className="cta-button">View Audit Log</a>
                        </div>
                        <div className="column-left">
                            <a href="#" className="cta-button">Download CSV</a>
                        </div>
                    </div>
                </div>

                {/* Continue with other sections (sponsorInvoice, driverSales, sponsorSales) similarly */}

            </section>
        </main>
    );
}

export default AdminReport;
