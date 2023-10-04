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
    } catch(err) {
        console.log(err);
        res.status(500).send();
    }
});

// Register routes
// POST
api.post('/register', async (req, res) => {
    try {
        
    } catch(err) {
        console.log(err);
        res.status(500).send();
    }
});

// User routes
// GET
api.get('/user', async (req, res) => {
    try {
        // Bad request
        if (!req.body.Username) res.status(400).send();

        // Query
        const user = await req.app.locals.db.getUser(req.body.Username);
        
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
api.get('/sponsor', async (req, res) => {
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