require('dotenv').config({path: "../.env"});
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const secret = process.env.DB_PWD;

async function validateToken(req, res, next) {
    // If request is missing access token header.
    if (!req.headers.authorization) {
        res.status(401).send("Access token is missing.")
    }

    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    // Validate the token
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            res.status(401).send();
        }
        else {
            req.User = decoded;
            next();
        }
    });
}

async function generateJWT(User) {
    try {
        const payload = User;
        const accessToken = jwt.sign(payload, secret, {expiresIn: "5m"});
        return { error: false, accessToken, refreshToken: uuidv4() };
    } catch (err) {
        console.log(err);
        return { error: true }
    }
}

module.exports = {validateToken, generateJWT};