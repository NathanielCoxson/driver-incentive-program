// Main Express server file

// Imports
const express = require('express');
const cors = require('cors');
require('dotenv').config;

// Router imports
const indexRouter = require('./routes/index');

const port = process.env.PORT || '3001';
const app = express();

// Enables CORS (cross-origin resource sharing) between fronend and backend
// since they are on different ports.
app.use(cors());

// Use routers here
app.use("/", indexRouter);

// Starts the server listening on the defined port.
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});