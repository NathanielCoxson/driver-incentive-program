import './Login.css'
import { Link, Navigate } from 'react-router-dom';
import { useState } from 'react';

function Login() {
    const [valid, setValid] = useState(false);
    const [dashboardURL, setDashURL] = useState("");

    const baseURL = process.env.NODE_ENV === 'production' ?
        'http://34.225.199.196/api/users/login' :
        'http://localhost:3001/api/users/login';

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const input = event.target;
        let user = {
            Username: input.username.value,
            Password: input.password.value,
        };

        let url = baseURL;
        // Post to /api/users/register
        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log('Success! - ' + data.Username + ' has logged in')
            document.cookie = "username=" + data.Username + "; " + 60*60*1000;
            setDashURL("/" + data.Role + "_dashboard")
            setValid(true)
        })
        .catch(err => {
            console.log(err);
            setValid(false)
        });
    }

    return (<main>
        <section className="login-section">
            <h2>Login</h2>
            <form className='login-form' onSubmit={handleSubmit}>
                {valid && (<Navigate to={dashboardURL}/>)}
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required />
                </div>

                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />
                </div>
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