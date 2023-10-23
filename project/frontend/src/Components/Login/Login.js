import './Login.css'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';

function Login() {
    const { setAuth, persist, setPersist } = useAuth();
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const LOGIN_URL = '/users/login';

    const handleSubmit = async (event) => {
        event.preventDefault();

        
    
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({Username, Password}),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            setAuth(response?.data);
            setUsername('');
            setPassword('');
            if (from === '/') navigate('/dashboard', { replace: true });
            else navigate(from, { replace: true });
            let loginDate = new Date();
            let LoginAttempt = {
                LoginDate: loginDate.getUTCDate(),
                Username: Username,
                Success: true
            }
            fetch(`${baseURL}/api/users/loginattempt`, {
                method: 'POST',
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(LoginAttempt)
              })
              .catch((err) => console.log(err));
        } catch (err) {
            if (!err?.response) {
                setResponseMessage('No Server Response');
            }
            else if (err.response?.status === 400) {
                setResponseMessage('Missing username or password');
            }
            else if (err.response?.status === 401) {
                setResponseMessage('Incorrect password');
            }
            else if (err.response?.status === 404) {
                setResponseMessage('User not found');
            }
            else {
                setResponseMessage('Login Failed');
            }
            let loginDate = new Date();
            let LoginAttempt = {
                LoginDate: loginDate.getUTCDate(),
                Username: Username,
                Success: false
            }
            fetch(`${baseURL}/api/users/loginattempt`, {
                method: 'POST',
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(LoginAttempt)
              })
              .catch((err) => console.log(err));
        }
    };

    const togglePersist = () => {
        setPersist(prev => !prev);
    };

    useEffect(() => {
        localStorage.setItem('persist', persist);
    }, [persist]);

    return (
    <main>
        <section className="login-section">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className='login-form'>
                <label htmlFor="username">Username:</label>
                <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    required 
                    onChange={event => setUsername(event.target.value)}
                    value={Username}
                />
                <br />
                <label htmlFor="password">Password:</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    required 
                    onChange={event => setPassword(event.target.value)}
                    value={Password}
                />
                <br />
                <button type="submit" className="cta-button">Submit</button>

                <div className="response" id="response">{responseMessage}</div>
                <div className="persistCheck">
                    <label htmlFor='persist'>Trust This Device?</label>
                    <input 
                        type="checkbox"
                        id="persist"
                        onChange={togglePersist}
                        checked={persist}
                    />
                </div>
                
            </form>
           
            <div>
                <div>
                    <span>Need an account? </span>
                    <Link to='/register'>Signup</Link>
                </div>
                <Link to='/password-reset'>Forgot Password?</Link> 
            </div>   
        </section>
    </main>)
}

export default Login;