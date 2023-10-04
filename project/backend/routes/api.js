// Routes for the about route "/about"
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
// POST
api.post('/users/register', async (req, res) => {
    try {
        const body = req.body;

        // Bad request
        if (
            !body.SponsorName ||
            !body.Name ||
            !body.Username ||
            !body.Password
        ) {
            res.status(400).send();
            return;
        };

        // Check if user already exists, send conflict 
        const user = await req.app.locals.db.getUser(req.body.Username);
        console.log(user);
        if (user) {
            res.status(409).send('Username unavailable');
            return;
        }

        // Get Sponsor ID
        const sponsor = await req.app.locals.db.getSponsorId(req.body.SponsorName);
        if (!sponsor) {
            res.status(400).send()
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
// GET
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
// GET 
api.get('/sponsors', async (req, res) => {
    try {
        // Bad request
        if (!req.body.SponsorName) res.status(400).send();

        // Query
        const result = await req.app.locals.db.getSponsorId(req.body.SponsorName);

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