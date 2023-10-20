const express = require('express');
const catalogs = express.Router();
const validation = require('../middlewares/validation');

catalogs.get('/', async (req, res) => {
    res.status(200).send({
        searches: [
            {
                term: 'c418',
                media: 'music',
                limit: 5
            },
            {
                term: 'bts',
                media: 'music',
                limit: 5
            }
        ]
    })
}); 

module.exports = catalogs;