const express = require('express');
const about = express.Router();

// About routes
/**
 * GET to <baseurl>/api/about
 * Returns an object containing the latest release from the database: {
 * }
 */
about.get('/', async (req, res) => {
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