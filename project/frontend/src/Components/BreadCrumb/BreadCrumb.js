// BreadCrumb.js
import './BreadCrumb.css';
import React, { useEffect } from 'react';

function BreadCrumb() {
    useEffect(() => {
        const breadcrumb = document.getElementById('breadcrumb');
        const path = window.location.pathname.split('/').filter(Boolean);
        let breadcrumbHTML = '';

        for (let i = 0; i < path.length; i++) {
            breadcrumbHTML += `<a href="${path.slice(0, i + 1).join('/')}">${path[i]}</a>`;
            if (i < path.length - 1) {
                breadcrumbHTML += '<span>/</span>';
            }
        }

        breadcrumb.innerHTML = breadcrumbHTML;
    }, []);

    return (
        <div id="breadcrumb" className="breadcrumb"></div>
    );
}

export default BreadCrumb;
