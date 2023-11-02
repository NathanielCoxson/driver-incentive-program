const express = require('express');
const reports = express.Router();
const validation = require('../middlewares/validation');

reports.get('/sponsors/sales', async (req, res) => {
    try {
        const sponsors = await req.app.locals.db.getSponsorSales();
        if (!sponsors) {
            res.status(404).send();
            return;
        }
        res.status(200).send({ sponsors });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

reports.get('/sponsors/:SponsorName/sales', async (req, res) => {
    try {
        const sales = await req.app.locals.db.getSponsorSalesByName(req.params.SponsorName);
        if (!sales) {
            res.status(404).send();
            return;
        }
        res.status(200).send({ sales });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

module.exports = reports;