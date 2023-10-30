const express = require('express');
const orders = express.Router();

// About routes
/**
 * POST to <baseurl>/api/orders/users/:Username
 * Adds a user's order to the database.
 */
orders.post('/users/:Username', async (req, res) => {
    try {
        if (!req.body.SponsorName || !req.body.items) {
            res.status(400).send();
            return;
        }

        const user = await req.app.locals.db.getUserByUsername(req.params.Username);
        if (!user) {
            res.status(404).send();
            return;
        }
        
        const sponsors = await req.app.locals.db.getUsersSponsors(user.UID);
        const sponsor = sponsors.find(s => s.SponsorName === req.body.SponsorName);
        if (!sponsor) {
            res.status(404).send();
            return;
        }

        const points = (await req.app.locals.db.getDriverPoints(user.UID, sponsor.SID)) || 0;
        const cost = req.body.items.reduce((acc, curr) => acc += curr.itemPrice, 0);
        if (points < cost) {
            res.status(409).send();
            return;
        }
        
        await req.app.locals.db.createOrder(req.body.items, user.UID, sponsor.SID);
        res.status(201).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

module.exports = orders;