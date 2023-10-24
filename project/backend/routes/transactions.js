const express = require('express');
const transactions = express.Router();

/**
 * POST to <baseurl>/api/transactions/createtransaction
 * Request Body: {
 *  UID: Unique Identifier,
 *  SID: Unique Identifier,
 *  TransactionDate: Date/Time,
 *  TransactionAmount: Int,
 *  Reason: String
* }
 * Create a transaction entry with the given details
 */
users.post('/createtransaction', async (req, res) => {
    try {
        const body = req.body;

        let Transaction = { ...body }
        .then(() => {
            // Add transaction to database
            req.app.locals.db.createTransaction(Transaction)
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

module.exports = transactions;