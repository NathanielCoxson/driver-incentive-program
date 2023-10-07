import React, { useEffect } from 'react';
import './BreadCrumb.css'; // Import the breadcrumb CSS

function BreadCrumb() {
  useEffect(() => {
    // JavaScript to update breadcrumb
    function updateBreadcrumb() {
      const breadcrumb = document.getElementById('breadcrumb');
      const path = window.location.pathname.split('/').filter(Boolean);
      let breadcrumbHTML = '';

      for (let i = 0; i < path.length; i++) {
        breadcrumbHTML += '<a href="/' + path.slice(0, i + 1).join('/') + '">' + path[i] + '</a>';
        if (i < path.length - 1) {
          breadcrumbHTML += '<span>/</span>';
        }
      }

      breadcrumb.innerHTML = breadcrumbHTML;
    }

    updateBreadcrumb();
  }, []);

  return (
    <div id="breadcrumb" className="breadcrumb"></div>
  );
}

export default BreadCrumb;
