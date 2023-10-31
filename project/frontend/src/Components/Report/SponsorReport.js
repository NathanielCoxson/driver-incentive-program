import React from 'react';
import './Report.css';

function SponsorReport() {
    return (
        <main>
            <section className="hero">
                <h1>Reports</h1>
                <br />

                <div className="auditLog">
                    <h2>Audit Log</h2>

                    <p>Select Date Range</p>
                    <label for="startdatepicker">Start Date:</label>
                    <input type="date" id="startdatepicker" name="startdatepicker" />
                    <label for="enddatepicker">End Date:</label>
                    <input type="date" id="enddatepicker" name="enddatepicker" />

                    <br />
                    <br />

                    <p>Select Audit Log Category</p>
                    <input type="radio" name="set2" id="driverApps" value="option2-1" />
                    <label for="driverApps">Driver Applications</label>

                    <input type="radio" name="set2" id="pointChanges" value="option2-2" />
                    <label for="pointChanges">Point Changes</label>

                    <input type="radio" name="set2" id="pwordChanges" value="option2-3" />
                    <label for="pwordChanges">Password Changes</label>

                    <input type="radio" name="set2" id="loginAttempts" value="option2-4" />
                    <label for="loginAttempts">Login Attempts</label>

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

                <br />
                <br />
                <br />

                <div className="driverPointTracking">
                    <h2>Driver Point Tracking</h2>

                    <p>Select Date Range</p>
                    <label for="startdatepicker">Start Date:</label>
                    <input type="date" id="startdatepicker" name="startdatepicker" />
                    <label for="enddatepicker">End Date:</label>
                    <input type="date" id="enddatepicker" name="enddatepicker" />

                    <br />
                    <br />
                    <p>Generate the report for all drivers in your organization or a specific driver?</p>

                    <input type="radio" name="set1" id="allDrivers" value="option1-1" />
                    <label for="allDrivers">All Drivers</label>

                    <input type="radio" name="set1" id="indDriver" value="option1-2" />
                    <label for="indDriver">Individual Driver&nbsp;&nbsp;</label>
                    <br />

                    <label for="driverUsername">Driver Username:</label>
                    <input type="text" id="driverUsername" name="driverUsername" />

                    <br />

                    <div className="row">
                        <div className="column-right">
                            <a href="#" className="cta-button">
                                View Driver Point Logs
                            </a>
                        </div>
                        <div className="column-left">
                            <a href="#" className="cta-button">
                                Download CSV
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default SponsorReport;
