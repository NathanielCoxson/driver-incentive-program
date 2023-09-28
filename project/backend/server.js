// Main Express server file

// Imports
const express = require('express');
const cors = require('cors');
const sql = require('mssql');
require('dotenv').config;

// Router imports
const indexRouter = require('./routes/index');
const aboutRouter = require('./routes/about');

const port = process.env.PORT || '3001';
const app = express();

// DB import
const db = require('./db');

// Enables CORS (cross-origin resource sharing) between fronend and backend
// since they are on different ports.
app.use(cors());

// Use routers here
app.use('/', indexRouter);
app.use('/about', aboutRouter);

// Starts the server listening on the defined port number.
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});