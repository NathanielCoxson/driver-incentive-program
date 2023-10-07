// Main Express server file

// Dependency imports
require('dotenv').config({path: "./.env"});
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
// const swaggerDocument = require('./apiDoc.json'); // imports doc file
// const swaggerUi = require('swagger-ui-express'); // serves doc file

// Router imports
const apiRouter = require('./routes/api');

// DB import
const db = require('./db');

// App configuration
const port = process.env.PORT || '3000';
const app = express();

// Enables CORS (cross-origin resource sharing) between frontend and backend
// since they are on different ports.
app.use(cors());

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

// Use routers here
app.use('/api', apiRouter);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Default route to serve react build folder
app.get('*', async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

// Start the server listening on the defined port number.
app.listen(port, () => {
    // Attach db to app.locals object to be used
    // in route files.
    app.locals.db = db;
    console.log(`Listening on port ${port}`);
});