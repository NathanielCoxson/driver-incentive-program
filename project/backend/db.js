const sql = require('mssql');
require('dotenv').config({path: "./.env"});

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
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}

// Await this promise when creating a new pool.
const poolPromise = new sql.ConnectionPool(sqlConfig)
    .connect()
    .then(pool => {
        return pool;
    })
    .catch(err => console.log(err));

module.exports = {
    /**
     * Returns the most recent entry in the Releases table as an object of the form:
     * {
     *  RID: <unique identifier from dbms>
     *  TeamNumber: 1
     *  VersionNumber: 3,
     *  ReleaseDate: 2023-09-25T22:45:44.567Z,
     *  ProductName: "Team01 Good Driver Incentive Program",
     *  ProductDescription: "Team01: FIFO Good Driver Incentive Program for Sprint 3",
     * }
     * @returns Object
     */
    getLatestRelease: async () => {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT TOP 1 * FROM Releases ORDER BY ReleaseDate DESC');
        return result.recordset[0];
    },
}