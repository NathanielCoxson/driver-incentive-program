import './Login.css'
import { Link } from 'react-router-dom';


function Login() {
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
        .then(res => {
            if (res.status === 200){
                console.log('Success!')
                document.cookie = "username=" + input.username.value + "; " + 60*60*1000;
            };
        })
        .catch(err => console.log(err));
    }

    return (<main>
        <section className="login-section">
            <h2>Login</h2>
            <form className='login-form' onSubmit={handleSubmit}>
                <div>
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" required />
                </div>

                <div>
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required />
                </div>
                <button type="submit" className="cta-button">Submit</button>
            </form>
            <span>Need an account? </span>
            <Link to='/register'>Signup</Link>
        </section>
    </main>)
}

export default Login;