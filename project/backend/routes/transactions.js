const express = require('express');
const transactions = express.Router();

/**
 * POST to <baseurl>/api/transactions
 * Request Body: {
 *  UID: Unique Identifier,
 *  SID: Unique Identifier,
 *  TransactionDate: Date/Time,
 *  TransactionAmount: Int,
 *  Reason: String
* }
 * Create a transaction entry with the given details
 */
transactions.post('/', async (req, res) => {
    try {
        const body = req.body;
        let Transaction = { ...body };
        // Add transaction to database
        await req.app.locals.db.createTransaction(Transaction);
        // If successful, send success code
        res.status(201).send();
            
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * GET to <baseurl>/api/transactions/entries
 * Request Body: {
 *  SponsorName: String,
 *  Username: String
* }
 * Get all transaction entries associated with a given sponsor and user name
 */
transactions.post('/entries', async (req, res) => {
    try {
        const body = req.body;

        //Get sponsor and user
        const user = await req.app.locals.db.getUserByUsername(body.Username);
        const sponsor = await req.app.locals.db.getSponsorByName(body.SponsorName);

        // Check if user and sponsor were found
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        if (!sponsor) {
            res.status(404).send('Sponsor not found');
            return;
        }
        if (user.Role !== 'driver' && user.Role !== 'sponsor') {
            res.status(403).send('User is not a driver');
            return;
        }
        
        //Return transactions
        const transactions = await req.app.locals.db.getTransactions(user.UID, sponsor.SID);
        if (transactions.length === 0) {
            res.status(404).send('No transactions found.');
            return;
        }

        res.status(200).send({ transactions });

    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * GET to <baseurl>/api/transactions/points
 * Request Body: {
 *  SponsorName: String,
 *  Username: String
* }
 * Get all transaction entries associated with a given sponsor and user name
 * Returns a single column ('Points') recordset
 */
transactions.post('/points', async (req, res) => {
    try {
        const body = req.body;

        //Get sponsor and user
        const user = await req.app.locals.db.getUserByUsername(body.Username);
        const sponsor = await req.app.locals.db.getSponsorByName(body.SponsorName);

        // Check if user and sponsor were found
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        if (!sponsor) {
            res.status(404).send('Sponsor not found');
            return;
        }
        if (user.Role !== 'driver' && user.Role !== 'sponsor') {
            res.status(403).send('User is not a driver');
            return;
        }

        //Return transactions
        const points = await req.app.locals.db.getPoints(user.UID, sponsor.SID);
        if (points.length === 0) {
            res.status(404).send('No transactions found.');
            return;
        }

        res.status(200).send({ points });

    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

module.exports = transactions;