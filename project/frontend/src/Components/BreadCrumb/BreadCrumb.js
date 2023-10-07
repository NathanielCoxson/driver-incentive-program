// Breadcrumb.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  return (
    <nav className="breadcrumb">
      <ul>
        <li><Link to="/">Home</Link></li>
        {pathnames.map((path, index) => (
          <li key={path}>
            {index < pathnames.length - 1 ? (
              <Link to={`/${pathnames.slice(0, index + 1).join('/')}`}>{path}</Link>
            ) : (
              path
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Breadcrumb;
