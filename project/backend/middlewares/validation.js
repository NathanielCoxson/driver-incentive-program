require('dotenv').config({path: "../.env"});

async function validateToken(req, res, next) {
    const validationToken = process.env.DB_PWD;

    // If request is missing access token header.
    if (!req.headers.authorization) {
        res.status(401).send("Access token is missing")
    }

    // Get the token from the header here.
    const token = '';

    // Validate the token with the 
    
}

module.exports = validateToken;