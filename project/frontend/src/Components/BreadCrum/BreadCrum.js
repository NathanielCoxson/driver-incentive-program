import './BreadCrum.css';
import { useEffect, useState } from 'react';

function BreadCrumb() {
    useEffect(() => {
        // Breadcrumb update logic
        const breadcrumb = document.getElementById('breadcrumb');
        const path = window.location.pathname.split('/').filter(Boolean); // Split the URL path
        let breadcrumbHTML = '';

        // Create breadcrumb links
        for (let i = 0; i < path.length; i++) {
            breadcrumbHTML += '<a href="/' + path.slice(0, i + 1).join('/') + '">' + path[i] + '</a>';
            if (i < path.length - 1) {
                breadcrumbHTML += '<span>/</span>';
            }
        }

        if (breadcrumb) {
            breadcrumb.innerHTML = breadcrumbHTML;
        }
    }, []);

    return (
        <div>
            <div id="breadcrumb"></div>
        </div>
    );
}

export default BreadCrumb;
