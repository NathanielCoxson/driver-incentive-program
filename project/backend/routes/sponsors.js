const express = require('express');
const sponsors = express.Router();

// Sponsor routes
/**
 * GET <baseurl>/api/sponsors
 * Returns an object with a sponsors property that contains a list of sponsor objects.
 */
sponsors.get('/', async (req, res) => {
    try {
        const sponsors = await req.app.locals.db.getSponsors();

        if (sponsors.length === 0) {
            res.status(404).send();
            return;
        }

        res.status(200).send({ sponsors });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * GET <baseurl>/api/sponsors/:SponsorName
 * Returns the sponsor with the given sponsor name from the database.
 */
sponsors.get('/:SponsorName', async (req, res) => {
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

module.exports = sponsors;