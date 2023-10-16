import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function RequireAuth({ allowedRoles }) {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.Role && allowedRoles.includes(auth.Role)
            ? <Outlet />
            : auth?.Username
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default RequireAuth;