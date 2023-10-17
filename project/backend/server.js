// Main Express server file

// Dependency imports
require('dotenv').config({path: "./.env"});
const express = require('express');
const cors = require('cors'); // CORS to enable cross-origin resource sharing
const morgan = require('morgan'); // Logs requests to console
const path = require('path'); // Given to express.static to locate frontend build folder
const bodyParser = require('body-parser'); // Parses json body into js body
const swaggerDocument = require('./openapi.json'); // imports doc file
const swaggerUi = require('swagger-ui-express'); // serves doc file
const cookieParser = require('cookie-parser'); // Used to parse cookies from requests

// Email sending
const nodemailer = require('nodemailer');
// Email transport object
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cpsc4910team01@gmail.com',
        pass: process.env.EMAIL_PWD
    }
});

// Router imports
const apiRouter = require('./routes/api');

// DB import
const db = require('./db');

// App configuration
const port = process.env.PORT || '3001';
const app = express();

// Enables CORS (cross-origin resource sharing) between frontend and backend
// since they are on different ports.
// Allowed origins include localhost and our EC2 ip.
const allowedOrigins = ['http://localhost:3000', 'http://34.225.199.196'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if(!allowedOrigins.includes(origin)) {
            const msg = "The CORS policy for this site does not allow access from the specified Origin.";
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

// Middleware to log requests to the console
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'));
}

// Defines location of react build folder
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// Parses incoming request bodies and attaches them to req.body
// which is passed to the handlers.
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Parse cookies
app.use(cookieParser());

// Use routers here
app.use('/api', apiRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Default route to serve react build folder
app.get('*', async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

// Start the server listening on the defined port number.
app.listen(port, () => {
    // Attach db to app.locals object to be used
    // in route files.
    app.locals.db = db;
    app.locals.email = transporter;
    console.log(`Listening on port ${port}`);
});