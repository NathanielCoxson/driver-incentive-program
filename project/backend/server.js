// Main Express server file

// Imports
require('dotenv').config({path: "./.env"});
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Router imports
const indexRouter = require('./routes/index');
const aboutRouter = require('./routes/about');

const port = process.env.PORT || '3000';
const app = express();

// DB import
const db = require('./db');

// Enables CORS (cross-origin resource sharing) between fronend and backend
// since they are on different ports.
app.use(cors());

app.use(morgan('tiny'));

// Use routers here
app.use('/', indexRouter);
app.use('/about', aboutRouter);

// Starts the server listening on the defined port number.
app.listen(port, () => {
    app.locals.db = db;
    console.log(`Listening on port ${port}`);
});