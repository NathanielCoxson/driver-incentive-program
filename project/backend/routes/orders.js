const express = require('express');
const orders = express.Router();

// About routes
/**
 * POST to <baseurl>/api/orders/users/:Username
 * Adds a user's order to the database.
 */
orders.post('/users/:Username', async (req, res) => {
    try {
        // Make db request
        const info = await req.app.locals.db.getLatestRelease();
        res.status(200).json(info);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

module.exports = about;