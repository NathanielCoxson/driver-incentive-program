import React, { useState } from 'react';
import './Report.css';
import SalesReport from './SalesReport';


function AdminReport() {
    const [type, setType] = useState('sales');
    const reportTypes = {
        'sales': <SalesReport />,
    };
    
    return (
        <section className="hero reports-section">
            <h1>Reports</h1>
            <div className='report-type-select'>
                <select name='type' onChange={e => setType(e.target.value)}>
                    <option name='sales' value='sales'>Sales</option>
                </select>
            </div>
            {reportTypes[type]}
        </section>
    );
}

export default AdminReport;
