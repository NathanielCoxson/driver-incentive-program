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
                    {/* ... (Audit Log section) */}
                </div>

                <div className="sponsorInvoice">
                    <h2>Sponsor Invoice</h2>
                    {/* ... (Sponsor Invoice section) */}
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
                        <label htmlFor="allSponBox">All Sponsors</label>

                        <input type="radio" name="set4" id="individualSponBox" value="option4-2" />
                        <label htmlFor="individualSponBox">Individual Sponsor&nbsp;&nbsp;</label>
                    </div>

                    <label htmlFor="indSponText">Sponsor Username:</label>
                    <input type="text" id="indSponText" name="indSponsorUser" />

                    <br />
                    <br />

                    <p>Generate the report for all drivers associated with this sponsor or a specific driver?</p>
                    <div className="radio-inline">
                        <input type="radio" name="set5" id="allDriverBox" value="option5-1" />
                        <label htmlFor="allDriverBox">All Drivers</label>

                        <input type="radio" name="set5" id="individualDriverBox" value="option5-2" />
                        <label htmlFor="individualDriverBox">Individual Driver&nbsp;&nbsp;</label>
                    </div>

                    <label htmlFor="indDriverText">Driver Username:</label>
                    <input type="text" id="indDriverText" name="indDriverUser" />

                    <br />
                    <br />

                    <p>Select View Type</p>
                    <div className="radio-inline">
                        <input type="radio" name="set6" id="detView" value="option6-1" />
                        <label htmlFor="detView">Detailed View</label>

                        <input type="radio" name="set6" id="sumView" value="option6-2" />
                        <label htmlFor="sumView">Summary View</label>
                    </div>

                    <div className="row">
                        <div className="column-right">
                            <a href="#" className="cta-button">View Driver Sales Report</a>
                        </div>
                        <div className="column-left">
                            <a href="#" className="cta-button">Download CSV</a>
                        </div>
                    </div>
                </div>

                <div className="sponsorSales">
                    <h2>Sales by Sponsor</h2>
                    <p>Select Date Range</p>
                    <label htmlFor="startdatepicker">Start Date:</label>
                    <input type="date" id="startdatepicker" name="startdatepicker" />
                    <label htmlFor="enddatepicker">End Date:</label>
                    <input type="date" id="enddatepicker" name="enddatepicker" />

                    <br />
                    <br />

                    <p>Generate the report for all sponsors or a specific sponsor?</p>
                    <div className="radio-inline">
                        <input type="radio" name="set7" id="allSponBox" value="option7-1" />
                        <label htmlFor="allSponBox">All Sponsors</label>

                        <input type="radio" name="set7" id="individualSponBox" value="option7-2" />
                        <label htmlFor="individualSponBox">Individual Sponsor&nbsp;&nbsp;</label>
                    </div>

                    <label htmlFor="indSponText">Sponsor Username:</label>
                    <input type="text" id="indSponText" name="indSponsorUser" />

                    <br />
                    <br />

                    <p>Select View Type</p>
                    <div className="radio-inline">
                        <input type="radio" name="set8" id="detView" value="option8-1" />
                        <label htmlFor="detView">Detailed View</label>

                        <input type="radio" name="set8" id="sumView" value="option8-2" />
                        <label htmlFor="sumView">Summary View</label>
                    </div>

                    <div className="row">
                        <div className="column-right">
                            <a href="#" className="cta-button">View Sponsor Sales Report</a>
                        </div>
                        <div className="column-left">
                            <a href="#" className="cta-button">Download CSV</a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default AdminReport;
