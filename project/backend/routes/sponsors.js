const express = require('express');
const sponsors = express.Router();
const validation = require('../middlewares/validation');

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

/**
 * POST <baseurl>/api/sponsors
 * Creates a new sponsor organization
 */
sponsors.post('/', async (req, res) => {
    try {
        if (!req.body.SponsorName) {
            res.status(400).send();
            return;
        }
        const sponsors = await req.app.locals.db.getSponsorByName(req.body.SponsorName);
        if (sponsors) {
            res.status(409).send();
            return;
        }
        const result = await req.app.locals.db.createSponsor(req.body.SponsorName);
        if (!result) {
            res.status(500).send();
            return;
        }
        res.status(201).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * DELETE <baseurl>/api/sponsors/:SponsorName
 * Deletes the given sponsor from the database.
 */
sponsors.delete('/:SponsorName', async (req, res) => {
    try {
        const result = await req.app.locals.db.deleteSponsor(req.params.SponsorName);
        if (result < 1) {
            res.status(404).send();
            return;
        }
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * PUT <baseurl>/api/sponsors/:SponsorName
 * Updates the sponsor with the given name with the provided new data.
 */
sponsors.put('/:SponsorName', async (req, res) => {
    try {
        if (!req.body.SponsorName) {
            res.status(400).send();
            return;
        }
        const result = await req.app.locals.db.updateSponsor(req.params.SponsorName, { SponsorName: req.body.SponsorName });
        if (!result) {
            res.status(404).send();
            return;
        }
        res.status(204).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}); 


module.exports = sponsors;