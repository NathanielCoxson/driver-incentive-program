// Routes for the base route "/"
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json("Hello World!");
});

module.exports = router;