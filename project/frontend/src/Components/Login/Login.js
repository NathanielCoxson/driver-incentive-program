import './Login.css'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';

function Login() {
    const { setAuth } = useAuth();
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
            console.log(response.data);
            setAuth(response?.data);
            setUsername('');
            setPassword('');
            navigate(from, { replace: true });
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
        }
    };

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
                <div class="response" id="response">{responseMessage}</div>
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