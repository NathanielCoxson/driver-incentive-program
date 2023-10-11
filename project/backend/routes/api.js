// Router for <baseURL>/api
const express = require('express'); // express server
const bcrypt = require('bcrypt'); // password encrypting
const api = express.Router(); // express router

// About routes
// GET
api.get('/about', async (req, res) => {
    try {
        // Make db request
        const info = await req.app.locals.db.getLatestRelease();
        res.status(200).json(info);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

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
api.post('/users/register', async (req, res) => {
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
        const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        const adminPin = process.env.DB_PWD;
        const conditions = [
            !body.Name, !body.Username, !body.Password, !body.Role, !body.Email, // Required fields
            (body.Role !== 'driver' && body.Role !== 'sponsor' && body.Role !== 'admin'), // Role validation
            !passwordRegex.test(body.Password), // Password validation
            !emailRegex.test(body.Email), // Email validation
            (query.AdminPin && query.AdminPin !== adminPin), // AdminPin is correct if provided
            (body.Role === 'admin' && query.AdminPin !== adminPin), // Admin role has correct pin
            (query.SponsorName === 'Admins' || query.SponsorName === 'None') // Restricted sponsor names
        ]

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
        let sponsorName = '';
        if (body.Role === 'admin') sponsorName = 'Admins';
        else sponsorName = query.SponsorName || 'None';
        const sponsor = await req.app.locals.db.getSponsorByName(sponsorName);
        if (!sponsor) {
            res.status(400).send();
            return;
        };

        // Create new user if username is available.
        // Start by hashing the password
        bcrypt.hash(req.body.Password, 12)
            // After hashing, create new user object
            .then(hash => {
                let newUser = {
                    ...body,
                    Password: hash,
                    SID: sponsor.SID,
                }
                res.status(201).send();
                // Add user to database
                req.app.locals.db.createUser(newUser)
                    // If successful, send success code
                    .then(() => {
                        res.status(201).send();
                    })
            })
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * GET <baseurl>/api/users/:Username
 * Returns the user with the given Username from the database.
 */
api.get('/users/:Username', async (req, res) => {
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

api.put('/users/password', async (req, res) => {
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
            if (!user) {
                res.status(404).send('Password reset request not found.');
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

// Sponsor routes
/**
 * GET <baseurl>/api/sponsors/:SponsorName
 * Returns the sponsor with the given sponsor name from the database.
 */
api.get('/sponsors/:SponsorName', async (req, res) => {
    try {
        // Bad request
        if (!req.params.SponsorName) res.status(400).send();

        // Query
        const result = await req.app.locals.db.getSponsorByName(req.params.SponsorName);

        // Success
        if (result) res.status(200).send(result);

        // Not found
        else res.status(404).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

// User routes
/**
 * POST to <baseurl>/api/users/login
 * Request Body {
 *  LoginDate: Date/Time
 *  Username: String,
 *  Success: String
 * }
 */
api.post('/users/login', async (req, res) => {
    try {
        const body = req.body;

        let newLogin = {...body}
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

module.exports = api;