import './Login.css'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';
const LOGIN_URL = '/login';



function Login() {
    const { setAuth } = useAuth();
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');

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
            const Role = response?.data?.Role;
            setAuth({ Username, Password, Role });
            setUsername('');
            setPassword('');
        } catch (err) {
    
        }
    };

    return (<main>
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