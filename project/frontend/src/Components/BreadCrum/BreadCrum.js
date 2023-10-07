import './Breadcrumb.css'
import { Link } from 'react-router-dom';

// JavaScript to update breadcrumb
function updateBreadcrumb() {
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

    breadcrumb.innerHTML = breadcrumbHTML;
}

// Call the updateBreadcrumb function when the page loads
window.onload = function () {
    updateBreadcrumb();
};
