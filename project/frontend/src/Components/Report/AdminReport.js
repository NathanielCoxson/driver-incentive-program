import React, { useState } from 'react';
import './Report.css';
import Report from './Report';


function AdminReport() {
    const [type, setType] = useState('driver-sales');
    const reportTypes = {
        'sponsor-sales': <Report type="sponsor-sales"/>,
        'driver-sales': <Report type="driver-sales"/>
    };
    
    return (
        <section className="hero reports-section">
            <h1>Reports</h1>
            <div className='report-type-select'>
                <label htmlFor='type'>Report type: </label>
                <select name='type' onChange={e => setType(e.target.value)}>
                    <option name='driver-sales' value='driver-sales'>Driver Sales</option>
                    <option name='sponsor-sales' value='sponsor-sales'>Sponsor Sales</option>
                </select>
            </div>
            {reportTypes[type]}
        </section>
    );
}

export default AdminReport;
