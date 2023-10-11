const sql = require('mssql');
require('dotenv').config({ path: "./.env" });

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

// Write query functions here so that they are 
// exported as part of the db module.
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
        try {
            // Await the pool connection here
            const pool = await poolPromise;
            // After connection, make requests
            const result = await pool.request()
                .query('SELECT TOP 1 * FROM Releases ORDER BY ReleaseDate DESC');
            return result.recordset[0];
        } catch (err) {
            console.log(err);
        }

    },

    /**
     * Creates a user in the database with the given crednetials.
     * Request Body: {
     *  Username: String,
     *  Password: String,
     *  SID: String,
     *  Name: String,
     *  Role: String
     * }
     */
    createUser: async (User) => {
        try {
            // Connect to pool
            const pool = await poolPromise;
            // Make request
            const result = await pool.request()
                .input('SID', sql.UniqueIdentifier, User.SID)
                .input('Name', sql.VarChar(100), User.Name)
                .input('Role', User.Role)
                .input('Username', sql.VarChar(50), User.Username)
                .input('Password', sql.VarChar(100), User.Password)
                .input('Email', sql.VarChar(300), User.Email)
                .query("\
                    INSERT INTO Users(\
                        UID,\
                        SID,\
                        Name,\
                        Role,\
                        Username,\
                        Password,\
                        Email) \
                    VALUES(\
                        NEWID(),\
                        @SID,\
                        @Name,\
                        @Role,\
                        @Username,\
                        @Password,\
                        @Email)");
            return;
        } catch (err) {
            console.log(err);
        }

    },

    /**
     * Retrieves the user from the database with the specified username.
     * Response: {
     *  UID: String,
     *  SID: String,
     *  Name: String,
     *  Role: String,
     *  Username: String,
     *  Password: String,
     *  Email: String
     * }
     * @param {String} Username 
     */
    getUserByUsername: async (Username) => {
        try {
            // Connect to pool
            const pool = await poolPromise;
            // Make request
            const result = await pool.request()
                .input('username', Username)
                .query("SELECT UID, SID, Name, Role, Username, Password, Email FROM Users WHERE Username = @username");
            // Return user object
            return result.recordset[0];
        } catch (err) {
            console.log(err);
        }
    },

    /**
     * Retrieves the user from the database with the specified username.
     * Response: {
     *  UID: String,
     *  SID: String,
     *  Name: String,
     *  Role: String,
     *  Username: String,
     *  Password: String,
     *  Email: String
     * }
     * @param {String} Username 
     */
    getUserPasswordResetToken: async (Email) => {
        try {
            // Connect to pool
            const pool = await poolPromise;
            // Make request
            const result = await pool.request()
                .input('email', sql.VarChar(300), Email)
                .query("SELECT PasswordResetToken, PasswordResetExpiration FROM Users WHERE Email = @email");
            // Return user object
            return result.recordset[0];
        } catch (err) {
            console.log(err);
        }
    },
    
    /**
     * Returns the SID of the sponsor with the given name:
     * Response: {
     *  SID: String
     *  SponsorName: String
     * }
     * @param {String} SponsorName
     */
    getSponsorByName: async (SponsorName) => {
        try {
            // Connect
            const pool = await poolPromise;
            // Make request
            const result = await pool.request()
                .input('name', sql.VarChar(100), SponsorName)
                .query('SELECT * FROM Sponsors WHERE SponsorName = @name');
            return result.recordset[0];
        } catch (err) {
            console.log(err);
        }
    },

    /**
     * Sets a password reset token and timeout value for the user with the specific email 
     * in the database, as well as returns the token to be used by the caller.
     * @param {String} Email 
     */
    generatePasswordResetToken: async (Email) => {
        try {
            // Connect
            const pool = await poolPromise;
            
            // Make request
            let transaction;
            try {
                transaction = pool.transaction();
                await transaction.begin();
                const datetime = new Date();
                // Insert new token and timeout
                const insert = await new sql.Request(transaction)
                    .input('Email', sql.VarChar(300), Email)
                    .input('year', sql.Int, datetime.getUTCFullYear())
                    .input('month', sql.Int, datetime.getUTCMonth()+1)
                    .input('day', sql.Int, datetime.getUTCDate())
                    .input('hour', sql.Int, datetime.getUTCHours())
                    .input('minute', sql.Int, datetime.getUTCMinutes())
                    .input('seconds', sql.Int, datetime.getUTCSeconds())
                    .input('milliseconds', sql.Int, datetime.getUTCMilliseconds())
                    .query("UPDATE Users \
                            SET \
                                PasswordResetToken = NEWID(), \
                                PasswordResetExpiration = DATEADD(hour, 1, DATETIMEFROMPARTS(@year, @month, @day, @hour, @minute, @seconds, @milliseconds)) \
                            WHERE Email = @Email");
                if (!insert) return {};

                // Get newly generated token
                const result = await new sql.Request(transaction)
                    .input('Email', sql.VarChar(300), Email)
                    .query("SELECT PasswordResetToken FROM Users WHERE Email = @Email");

                if (!result || result.recordset.length === 0) throw new Error("Failed to insert password reset token into database.");

                // Commit and return new token
                await transaction.commit();
                return result.recordset[0].PasswordResetToken;
            } catch (err) {
                await transaction.rollback();
                console.log(err);
                throw err;
            }
            
        } catch (err) {
            console.log(err);
        }
    },

    /**
     * Updates the password of the user with the given email.
     * @param {String} Email 
     */
    resetUserPassword: async (Email, Password) => {
        try {
            // Connect
            const pool = await poolPromise;
            // Make request
            const result = await pool.request()
                .input('Email', sql.VarChar(300), Email)
                .input('Password', sql.VarChar(100), Password)
                // Update password and wipe the reset token to prevent further changes.
                .query('UPDATE Users \
                        SET Password = @Password, PasswordResetToken = NULL, PasswordResetExpiration = NULL \
                        WHERE Email = @Email');
        } catch (err) {
            console.log(err);
        }
    }
}