import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function RequireAuth({ allowedRoles }) {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        // Current role is in allowed role
        auth?.Role && allowedRoles.includes(auth.Role)
            ? <Outlet /> // Outlet to target destination
            : auth?.Username // If use doesn't have correct role, check if they are logged in
                ? <Navigate to="/unauthorized" state={{ from: location }} replace /> // Show unauthorized if logged in
                : <Navigate to="/login" state={{ from: location }} replace /> // Ask them to log in
    );
};

export default RequireAuth;