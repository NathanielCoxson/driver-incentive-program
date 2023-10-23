const express = require('express');
const catalogs = express.Router();
const validation = require('../middlewares/validation');

catalogs.get('/:SponsorName', async (req, res) => {
    try {
        const result = await req.app.locals.db.getSponsorCatalog(req.params.SponsorName);
        if (result.length === 0) {
            res.status(404).send();
            return;
        }
        res.status(200).send({ searches: result });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

catalogs.post('/:SponsorName', async (req, res) => {
    try {
        const body = req.body;
        const conditions = [
            !body?.term,
            body?.media !== 'music' && body?.media !== 'movie' && body?.media !== 'audiobook',
            body?.entity !== 'musicTrack' && body?.entity !== 'album' && body?.entity !== 'musicArtist' &&
            body?.entity !== 'movie' && body?.entity !== 'movieArtist' &&
            body?.entity !== 'audiobook' && body?.entity !== 'audiobookAuthor',
            !(body?.media === 'music' && (body?.entity === 'musicTrack' || body?.entity === 'album' || body?.entity === 'musicArtist')),
            !(body?.media === 'movie' && (body?.entity === 'movie' || body?.entity === 'movieArtist')),
            !(body?.media === 'audiobook' && (body?.entity === 'audiobook' || body?.entity === 'audiobookAuthor')),
            !(body?.limit > 0 && body?.limit <= 50)
        ]
        if (conditions.includes(true)) {
            res.status(400).send();
            return;
        }
        const sponsor = await req.app.locals.db.getSponsorByName(req.params.SponsorName);
        if (!sponsor) {
            res.status(404).send();
            return;
        }
        await req.app.locals.db.addCatalogSearchQuery(sponsor.CID, req.body);
        res.status(201).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

catalogs.put('/:SponsorName', async (req, res) => {
    try {
        if (!req.body?.searches) {
            res.status(400).send();
            return;
        }
        const sponsor = await req.app.locals.db.getSponsorByName(req.params.SponsorName);
        if (!sponsor) {
            res.status(404).send();
            return;
        }
        const result = await req.app.locals.db.updateSearchQuery(sponsor.SID, sponsor.CID, req.body.searches);
        if (!result) {
            res.status(500).send();
            return;
        }
        res.status(204).send({ searches: result });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

catalogs.delete('/:SponsorName', async (req, res) => {
    try {
        if (!req.body?.searches) {
            res.status(400).send();
            return;
        }
        const sponsor = await req.app.locals.db.getSponsorByName(req.params.SponsorName);
        if (!sponsor) {
            res.status(404).send();
            return;
        }
        for (const CSID of req.body.searches) {
            await req.app.locals.db.deleteCatalogSearchQuery(sponsor.CID, CSID);
        }
        res.status(200).send();
    } catch (err) { 
        console.log(err);
        res.status(500).send();
    }
});

module.exports = catalogs;