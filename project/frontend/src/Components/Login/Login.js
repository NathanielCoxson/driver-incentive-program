function Login() {
    return (<main>
        <section className="login-form">
            <h2>Login</h2>
            <form action="process-login.php" method="post">
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required /><br />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required /><br />
                <button type="submit" className="cta-button">Submit</button>
            </form>
        </section>
    </main>)
}

export default Login;