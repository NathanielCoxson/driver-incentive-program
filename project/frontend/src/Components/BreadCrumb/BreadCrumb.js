// BreadCrumb.js
import './BreadCrumb.css';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function BreadCrumb() {
    const location = useLocation();
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    useEffect(() => {
        const path = location.pathname.split('/').filter(Boolean);
        const breadcrumbItems = path.map((segment, index) => ({
            segment,
            path: path.slice(0, index + 1).join('/'),
        }));

        setBreadcrumbs(breadcrumbItems);
    }, [location.pathname]);

    return (
        <div className="breadcrumb">
            <ul>
                {breadcrumbs.map((item, index) => (
                    <li key={index}>
                        <a href={item.path}>{item.segment}</a>
                        {index < breadcrumbs.length - 1 && <span>/</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BreadCrumb;
