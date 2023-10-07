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
 *  SponsorName: String,
 *  Name: String,
 *  Role: String (either 'driver' or 'sponsor')
 *  AdminPin: String
 * }
 */
api.post('/users/register', async (req, res) => {
    try {
        const body = req.body;
        /*
            Has minimum 8 characters in length. Adjust it by modifying {8,}
            At least one uppercase English letter. You can remove this condition by removing (?=.*?[A-Z])
            At least one lowercase English letter.  You can remove this condition by removing (?=.*?[a-z])
            At least one digit. You can remove this condition by removing (?=.*?[0-9])
            At least one special character,  You can remove this condition by removing (?=.*?[#?!@$%^&*-])
        */
        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
        const adminPin = process.env.DB_PWD;

        // Bad request
        if (
            !body.Name ||
            !body.Username ||
            !body.Password ||
            (body.Role !== 'driver' && body.Role !== 'sponsor' && body.Role !== 'admin') ||
            (body.AdminPin && body.AdminPin !== adminPin) ||
            (body.Role === 'admin' && body.AdminPin !== adminPin) ||
            !passwordRegex.test(body.Password)
        ) {
            res.status(400).send();
            return;
        };

        // Check if user already exists, send conflict 
        const user = await req.app.locals.db.getUser(req.body.Username);
        if (user) {
            res.status(409).json('Username unavailable');
            return;
        }

        // Get Sponsor ID
        let sponsorName = req.body.SponsorName || 'None';
        if (body.Role === 'admin') sponsorName = 'Admins';
        const sponsor = await req.app.locals.db.getSponsorId(sponsorName);
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

// User routes
/**
 * GET <baseurl>/api/users/:Username
 * Returns the User with the given Username from the database.
 */
api.get('/users/:Username', async (req, res) => {
    try {
        // Bad request
        if (!req.params.Username) res.status(400).send();

        // Query
        const user = await req.app.locals.db.getUser(req.params.Username);

        // Success
        if (user) res.status(200).send(user);

        // Not found
        else res.status(404).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

// Sponsor routes
/**
 * GET <baseurl>/api/sponsors/:SponsorName
 * Returns the Sponsor Id of the sponsor with the given name in the database.
 */
api.get('/sponsors/:SponsorName', async (req, res) => {
    try {
        // Bad request
        if (!req.params.SponsorName) res.status(400).send();

        // Query
        const result = await req.app.locals.db.getSponsorId(req.params.SponsorName);

        // Success
        if (result) res.status(200).send(result);

        // Not found
        else res.status(404).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});


module.exports = api;