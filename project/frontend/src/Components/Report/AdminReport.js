import React, { useEffect, useState } from 'react';
import './Report.css';
import AdminSalesReport from './AdminSalesReport';
import AdminSponsorsReport from './AdminSponsorsReport';


function AdminReport() {
    const [type, setType] = useState('sponsor-sales');
    const reportTypes = {
        'sponsor-sales': <AdminSalesReport />,
        'sponsors': <AdminSponsorsReport />
    }

    useEffect(() => console.log(type), [type]);
    
    return (
        <section className="hero">
            <h1>Reports</h1>
            <label htmlFor='type'>Report type: </label>
            <select name='type' onChange={e => setType(e.target.value)}>
                <option name='sponsor-sales' value='sponsors'>Sponsors</option>
                <option name='sponsor-sales' value='sponsor-sales'>Sponsor Sales</option>
            </select>
            {reportTypes[type]}
        </section>
    );
}

export default AdminReport;
