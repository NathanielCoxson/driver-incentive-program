import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useRefreshToken from '../../hooks/uesRefreshToken';
import useAuth from '../../hooks/useAuth';

function PersistLogin() {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } 
            catch (err) {
                console.log(err);
            }
            finally {
                setIsLoading(false);
            }
        }

        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
    }, []);

    // useEffect(() => {
    //     console.log(`isLoading: ${isLoading}`);
    //     console.log(`authToken: ${JSON.stringify(auth?.accessToken)}`);
    // }, [isLoading, auth.accessToken]);

    return (
        <>
            {isLoading
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