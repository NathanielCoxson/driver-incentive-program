const express = require('express');
const users = express.Router();

// User routes
/**
 * POST to <baseurl>/api/users/register
 * Request Body {
 *  Username: String,
 *  Password: String,
 *  Name: String,
 *  Role: String, (either 'driver', 'sponsor', or 'admin')
 *  Email: String
 * }
 * Query Parameters {
 *  AdminPin: string // Required if Role is admin
 *  SponsorName: string // Optional, default is None
 * }
 */
users.post('/register', async (req, res) => {
    try {
        const body = req.body;
        const query = req.query;
        /*
            Has minimum 8 characters in length. Adjust it by modifying {8,}
            At least one uppercase English letter. You can remove this condition by removing (?=.*?[A-Z])
            At least one lowercase English letter.  You can remove this condition by removing (?=.*?[a-z])
            At least one digit. You can remove this condition by removing (?=.*?[0-9])
            At least one special character,  You can remove this condition by removing (?=.*?[#?!@$%^&*-])
        */
        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
        const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        const adminPin = process.env.DB_PWD;
        const conditions = [
            !body.Name, !body.Username, !body.Password, !body.Role, !body.Email, // Required fields
            (body.Role !== 'driver' && body.Role !== 'sponsor' && body.Role !== 'admin'), // Role validation
            !passwordRegex.test(body.Password), // Password validation
            !emailRegex.test(body.Email), // Email validation
            (body.Role === 'admin' && query.AdminPin !== adminPin), // Admin role has correct pin
            (query.SponsorName === 'Admins' || query.SponsorName === 'None') // Restricted sponsor names
        ]

        if(query.AdminPin && query.AdminPin !== adminPin) {
            res.status(403).send();
            return;
        }
        // Bad request
        if (conditions.includes(true)) {
            res.status(400).send();
            return;
        };

        // Check if user already exists, send conflict 
        const username = await req.app.locals.db.getUserByUsername(req.body.Username);
        const email = await req.app.locals.db.getUserByEmail(req.body.Email);
        if (username) {
            res.status(409).json('Username already taken');
            return;
        }
        else if (email) {
            res.status(409).json('Email already taken');
            return;
        }

        // Get Sponsor ID
        let sponsor = {};
        if (body.SponsorName) {
            sponsor = await req.app.locals.db.getSponsorByName(body.SponsorName);
            if (!sponsor) {
                res.status(400).send();
                return;
            }
        };

        // Create new user if username is available.
        // Start by hashing the password
        bcrypt.hash(req.body.Password, 12)
            // After hashing, create new user object
            .then(hash => {
                let newUser = {
                    ...body,
                    Password: hash,
                    SID: body.SponsorName ? sponsor.SID : 'NULL',
                }
                // Add user to database
                req.app.locals.db.createUser(newUser)
                    // If successful, send success code
                    .then(result => {

                        if (result === 1) {
                            console.log(result, 'asdfasdf');
                            res.status(201).send();
                            return;
                        }
                        else {
                            res.status(500).send();
                            return;
                        }
                    })
            });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * POST <baseurl>/api/users/login
 * Request body: {
 *  Username: String,
 *  Password: String
 * }
 * Returns an object of the user with the given user info if 
 * the provided password is correct.
 */
users.post("/login", async (req, res) => {
    try {
        const user = await req.app.locals.db.getUserByUsername(req.body.Username);

        if (user) {
            bcrypt.compare(req.body.Password, user.Password, async (err, valid) => {
                if (err) {
                    console.log(err);
                    res.status(500).send();
                    return;
                }
                if (valid) {
                    const { error, accessToken, refreshToken } = await validation.generateJWT(user);
                    const saved = await req.app.locals.db.saveRefreshToken(user.Username, refreshToken);
                    if (error || !saved) {
                        console.log('Error creating jwt.');
                        res.status(500).send();
                        return;
                    }
                    else {
                        res.cookie('refreshToken', refreshToken, { maxAge: 60 * 60 * 1000, httpOnly: true });
                        delete user.Password;
                        res.status(201).send({ ...user, accessToken });
                        return;
                    }
                }
                else {
                    res.status(401).send();
                    return;
                }
            });
        } else {
            res.status(404).send();
        }
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * POST to <baseurl>/api/users/login
 * Request Body {
 *  LoginDate: Date/Time
 *  Username: String,
 *  Success: String
 * }
 */
users.post('/login', async (req, res) => {
    try {
        const body = req.body;

        let newLogin = { ...body }
        // Add user to database
        req.app.locals.db.createLogin(newLogin)
            // If successful, send success code
            .then(() => {
                res.status(201).send();
            })
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * POST <baseurl>/api/users/logout
 * Logs a user out by clearing their refresh token.
 */
users.post("/logout", async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.refreshToken) return res.sendStatus(204);
        const refreshToken = cookies.refreshToken;

        const user = await req.app.locals.db.clearRefreshToken(refreshToken);
        res.clearCookie('refreshToken', { httpOnly: true });
        res.status(204).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * GET <baseurl>/api/users/refresh
 * Refreshes a user's access token and cycles their refresh token assuming that
 * the refresh token cookie is still valid.
 * Response body: {
 *  ...User object (Similar to GET /users/:Username),
 *  accessToken: String
 * }
 */
users.get("/refresh", async (req, res) => {
    try {
        // Check if refreshToken is present
        if (!req.cookies.refreshToken) {
            res.status(401).send();
            return;
        }

        // Get refresh token
        const refreshToken = req.cookies.refreshToken;
        // Get user with refresh token
        const user = await req.app.locals.db.getUserByRefreshToken(refreshToken);

        // No user with refresh token in db
        if (!user) {
            console.log('invalid refresh token');
            res.status(401).send();
            return;
        }
        // Check expiration of refresh token
        let expiration = new Date(user.RefreshTokenExpiration);
        let now = new Date();
        // Valid expiration date
        if (now.getTime() < expiration.getTime()) {
            const newToken = await validation.generateJWT(user);
            // Error creating token
            if (newToken.error) {
                console.log('Error creating jwt on refresh.');
                res.status(500).send();
            }
            // Token created
            else {
                // Save refresh token in db and cookies and send back access token
                await req.app.locals.db.saveRefreshToken(user.Username, newToken.refreshToken);
                console.log(`New refresh token: ${newToken.refreshToken}`);
                res.cookie('refreshToken', newToken.refreshToken, { maxAge: 60 * 60 * 1000, httpOnly: true });
                delete user.Password;
                delete user.RefreshTokenExpiration;
                res.status(200).send({ ...user, accessToken: newToken.accessToken });
            }
        }
        // Invalid expiration date
        else {
            res.status(401).send();
        }
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * GET <baseurl>/api/users/:Username
 * Returns the user with the given Username from the database.
 */
users.get('/:Username', async (req, res) => {
    try {
        // Bad request
        if (!req.params.Username) res.status(400).send();

        // Query
        const user = await req.app.locals.db.getUserByUsername(req.params.Username);

        // Success
        if (user) res.status(200).send(user);

        // Not found
        else res.status(404).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * PUT to <baseurl>/api/users/password
 * Used to request an email for resetting a user's password.
 * Provde the user's email in the request body: {
 *  "Email": "example@example.com"
 * }
 * When only the email is provided, an email will be sent to this
 * email address with a link to reset the user's password.
 * 
 * To update the user's password send a request body like this: {
 *  "Email": String,
 *  "Password": String,
 *  "Token": String
 * }
 * The password is the new password the user has entered and the token
 * should be taken from the 'token' parameter in the query string of the link 
 * provided by the previous email request. If the token is invalid, the update
 * will not occur and a 403 Forbidden status code will be sent back.
 */
users.put('/password', async (req, res) => {
    try {
        // Request condition checking
        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
        const conditions = [
            !req.body.Email,
            req.body.Token && !req.body.Password,
            req.body.Password && !req.body.Token,
            req.body.Password && !passwordRegex.test(req.body.Password)
        ];
        if (conditions.includes(true)) {
            res.status(400).send();
            return;
        }

        // Determine if user is sending new password, or requesting a reset email
        // Sending new password and token
        if (req.body.Token) {
            // Pull user password reset token and expiration from DB.
            const user = await req.app.locals.db.getUserPasswordResetToken(req.body.Email);

            // If no user or no reset token is found, then send 404.
            if (!user || !user.PasswordResetToken) {
                res.status(404).send('User or password reset request not found.');
                return;
            }

            // Compare now with expiration date.
            let expiration = new Date(user.PasswordResetExpiration);
            let now = new Date();

            // Hash the new password and store it if expiration hasn't passed and token is correct.
            if (now.getTime() < expiration.getTime() && user.PasswordResetToken === req.body.Token) {
                bcrypt.hash(req.body.Password, 12, async (err, hash) => {
                    await req.app.locals.db.resetUserPassword(req.body.Email, hash);
                    res.status(204).send();
                    return;
                });
            }
            // Forbidden request if expiration has passed or token is invalid.
            else {
                // Wipe any reset request from the database if forbidden request is made.
                await req.app.locals.db.clearPasswordReset(req.body.Email);
                res.status(403).send();
                return;
            }
        }
        // Requesting email
        else {
            const token = await req.app.locals.db.generatePasswordResetToken(req.body.Email);
            if (!token) {
                res.status(404).send("Email not found");
                return;
            }

            // Construct email
            const link = process.env.NODE_ENV === 'production' ?
                `http://34.225.199.196/password-reset?token=${token}` :
                `http://localhost:3000/password-reset?token=${token}`;
            const resetEmail = {
                from: 'cpsc4910team01@gmail.com',
                to: req.body.Email,
                subject: 'Driver Incentive Program Password Reset Request',
                text: `Please click this link in order to reset your account's password. If you did not request to reset your password, please disregard this email. \n\n${link}`
            };

            // Send email
            req.app.locals.email.sendMail(resetEmail, (err, info) => {
                if (err) {
                    console.log(`Failed to send reset email to: ${req.body.Email}`);
                    res.status(500).send("Failed to send email.");
                    return;
                }
                else {
                    res.status(202).send();
                    return;
                }
            });
        }
        return;
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

module.exports = users;