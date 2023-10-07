// BreadCrumb.js
import React from 'react';

function BreadCrumb() {
    // Static breadcrumb data for testing
    const staticBreadcrumbs = [
        { segment: 'Home', path: '/' },
        { segment: 'About', path: '/about' },
        // Add more static breadcrumb items as needed
    ];

    return (
        <div className="breadcrumb">
            <ul>
                {staticBreadcrumbs.map((item, index) => (
                    <li key={index}>
                        <a href={item.path}>{item.segment}</a>
                        {index < staticBreadcrumbs.length - 1 && <span>/</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BreadCrumb;
