// Main Express server file

// Dependency imports
require('dotenv').config({path: "./.env"});
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

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
app.use(morgan('tiny'));

app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// Use routers here
app.use('/api', apiRouter);

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