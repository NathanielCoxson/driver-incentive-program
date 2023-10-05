import './Register.css';

function Register() {
    const registerUrl = process.env.NODE_ENV === 'production' ? 
        'http://34.225.199.196/api/users/register' :
        'http://localhost:3001/api/users/register';

    const handleSubmit = (event) => {
        event.preventDefault();
        const input = event.target;
        const user = {
            Username: input.username.value,
            Password: input.password.value,
            Name: input.name.value,
            SponsorName: input.sponsorName.value,
            Role: input.role.value,
        }
        fetch(registerUrl, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user),
        })
        .catch(err => console.log(err));
    }
    return (
        <main>
            <section className="login-section">
                <h2>Register</h2>
                <form onSubmit={handleSubmit} className='register-form'>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required /><br />
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required /><br />
                    <label htmlFor="name">Name:</label>
                    <input id="name" name="name" required /><br />
                    <label htmlFor="sponsorName">Sponsor:</label>
                    <input id="sponsorName" name="sponsorName" required /><br />
                    <label htmlFor="role">Role:</label>
                    <select id="role" name="role" required>
                        <option value="driver">Driver</option>
                        <option value="sponsor">Sponsor</option>
                    </select><br />
                    <button type="submit" className="cta-button">Submit</button>
                </form>
            </section>
        </main>
    );
};

export default Register;