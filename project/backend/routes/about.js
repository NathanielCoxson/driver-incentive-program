// Routes for the about route "/about"
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const info = await req.app.locals.db.getLatestRelease();
        res.status(200).json(info);
    } catch(err) {
        console.log(err);
        res.status(500).send();
    }
    
});

module.exports = router;