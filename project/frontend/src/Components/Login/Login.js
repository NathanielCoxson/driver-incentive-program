import './Login.css'
import { Link } from 'react-router-dom';

function Login() {
    return (<main>
        <section className="login-section">
            <h2>Login</h2>
            <form action="process-login.php" method="post" className='login-form'>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required /><br />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required /><br />
                <button type="submit" className="cta-button">Submit</button>
            </form>
            <span>Need an account? </span>
            <Link to='/register'>Signup</Link>
        </section>
    </main>)
}

export default Login;