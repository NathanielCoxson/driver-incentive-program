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

// DB config
const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER_NAME,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // for azure
        trustServerCertificate: false // change to true for local dev / self-signed certs
    }
}
const appPool = new sql.ConnectionPool(sqlConfig);

// Enables CORS (cross-origin resource sharing) between fronend and backend
// since they are on different ports.
app.use(cors());

// Use routers here
app.use('/', indexRouter);
app.use('/about', aboutRouter);

// Starts the server listening on the defined port when the database pool has
// finished connecting.
appPool.connect().then(pool => {
    app.locals.db = pool;
    const server = app.listen(port, () => {
        const host = server.address().address;
        const port = server.address().port;
        console.log(`App listening at http://${host}:${port}}`);
    });
});