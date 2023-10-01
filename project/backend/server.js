// Main Express server file

// Dependency imports
require('dotenv').config({path: "./.env"});
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Router imports
const indexRouter = require('./routes/index');
const aboutRouter = require('./routes/about');

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

// Use routers here
app.use('/', indexRouter);
app.use('/about', aboutRouter);

// Start the server listening on the defined port number.
app.listen(port, () => {
    // Attach db to app.locals object to be used
    // in route files.
    app.locals.db = db;
    console.log(`Listening on port ${port}`);
});