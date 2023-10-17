import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useEffect } from 'react';

function RequireAuth({ allowedRoles }) {
    const { auth } = useAuth();
    const location = useLocation();
    useEffect(() => {
        console.log(auth);
    }, [auth])

    return (
        auth?.Role && allowedRoles.includes(auth.Role)
            ? <Outlet />
            : auth?.Username
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default RequireAuth;