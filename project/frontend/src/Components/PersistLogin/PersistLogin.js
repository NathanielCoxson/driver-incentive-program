import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useRefreshToken from '../../hooks/uesRefreshToken';
import useAuth from '../../hooks/useAuth';
import useLogout from '../../hooks/useLogout';

function PersistLogin() {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();
    const logout = useLogout();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } 
            catch (err) {
                console.log(err);
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }

        !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted= false;
    }, []);

    return (
        <>
            {!persist 
                ? <Outlet />
                : isLoading
                    ? 
                        <main>
                            <h2>Loading...</h2> 
                        </main>
                    : <Outlet />
            }
        </>
    )
}

export default PersistLogin;