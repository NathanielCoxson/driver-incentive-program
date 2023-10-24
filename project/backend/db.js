const { application } = require('express');
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

/**
 * Retrieves all sponsor objects from the database and returns
 * an array of these objects.
 * Sponsor Object {
 *  SID: String,
 *  SponsorName: String
 * }
 * @returns Array
 */
async function getSponsors() {
    try {
        // Connect
        const pool = await poolPromise;
        // Make request
        const result = await pool.request()
            .query("SELECT * FROM Sponsors WHERE SponsorName != 'Admins' AND SponsorName != 'None'");
        return result.recordset;
    } catch (err) {
        console.log(err);
    }
}

/**
 * Returns the SID of the sponsor with the given name:
 * Response: {
 *  SID: String
 *  SponsorName: String
 * }
 * @param {String} SponsorName
 */
async function getSponsorByName(SponsorName) {
    try {
        // Connect
        const pool = await poolPromise;
        // Make request
        const result = await pool.request()
            .input('name', sql.VarChar(100), SponsorName)
            .query('SELECT Sponsors.SID, Sponsors.SponsorName, Catalogs.CID, Catalogs.ConversionRate \
                    FROM Sponsors \
                    JOIN Catalogs ON Catalogs.SID = Sponsors.SID \
                    WHERE SponsorName = @name');
        return result.recordset[0];
    } catch (err) {
        console.log(err);
    }
}

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
async function getUserByUsername(Username) {
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
}

/**
 * Retrieves the user from the database with the specified email.
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
async function getUserByEmail(Email) {
    try {
        // Connect to pool
        const pool = await poolPromise;
        // Make request
        const result = await pool.request()
            .input('Email', sql.VarChar(300), Email)
            .query("SELECT UID, SID, Name, Role, Username, Password, Email FROM Users WHERE Email = @Email");
        // Return user object
        return result.recordset[0];
    } catch (err) {
        console.log(err);
    }
}

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
async function getLatestRelease() {
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

}

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
async function createUser(User) {
    try {
        // Connect to pool
        const pool = await poolPromise;
        // Make request
        let result = {};
        if (User.SID === 'NULL') {
            result = await pool.request()
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
                        NULL,\
                        @Name,\
                        @Role,\
                        @Username,\
                        @Password,\
                        @Email)");
        }
        else {
            result = await pool.request()
                .input('SID', User.SID)
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
        }
        return result.rowsAffected[0];
    } catch (err) {
        console.log(err);
    }

}

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
async function getUserPasswordResetToken(Email) {
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
}


/**
 * Sets a password reset token and timeout value for the user with the specific email 
 * in the database, as well as returns the token to be used by the caller.
 * @param {String} Email 
 */
async function generatePasswordResetToken(Email) {
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
                .input('month', sql.Int, datetime.getUTCMonth() + 1)
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
}

async function saveRefreshToken(Username, RefreshToken) {
    try {
        // Connect
        const pool = await poolPromise;

        // Make request
        try {
            const datetime = new Date();
            // Insert new token and timeout
            const update = await pool.request()
                .input('Username', sql.VarChar(50), Username)
                .input('RefreshToken', sql.UniqueIdentifier, RefreshToken)
                .input('year', sql.Int, datetime.getUTCFullYear())
                .input('month', sql.Int, datetime.getUTCMonth() + 1)
                .input('day', sql.Int, datetime.getUTCDate())
                .input('hour', sql.Int, datetime.getUTCHours())
                .input('minute', sql.Int, datetime.getUTCMinutes())
                .input('seconds', sql.Int, datetime.getUTCSeconds())
                .input('milliseconds', sql.Int, datetime.getUTCMilliseconds())
                .query("UPDATE Users \
                        SET \
                            RefreshToken = @RefreshToken, \
                            RefreshTokenExpiration = DATEADD(hour, 1, DATETIMEFROMPARTS(@year, @month, @day, @hour, @minute, @seconds, @milliseconds)) \
                        WHERE Username = @Username");
            if (!update) return false;

            return true;
        } catch (err) {
            await transaction.rollback();
            console.log(err);
            throw err;
        }

    } catch (err) {
        console.log(err);
    }
}

async function clearRefreshToken(RefreshToken) {
    try {
        // Connect
        const pool = await poolPromise;
        // Make request
        const result = await pool.request()
            .input('RefreshToken', sql.VarChar, RefreshToken)
            // Update password and wipe the reset token to prevent further changes.
            .query('UPDATE Users SET RefreshToken = NULL, RefreshTokenExpiration = NULL WHERE RefreshToken = @RefreshToken');
        return result.rowsAffected;
    } catch (err) {
        console.log(err);
    }
}

async function getUserByRefreshToken(RefreshToken) {
    try {
        // Connect
        const pool = await poolPromise;
        // Make request
        const result = await pool.request()
            .input('RefreshToken', sql.UniqueIdentifier, RefreshToken)
            // Update password and wipe the reset token to prevent further changes.
            .query('SELECT UID, SID, Name, Role, Username, Password, Email, RefreshTokenExpiration FROM Users WHERE RefreshToken = @RefreshToken');
        return result.recordset[0];
    } catch (err) {
        console.log(err);
    }
}

/**
 * Updates the password of the user with the given email.
 * @param {String} Email 
 */
async function resetUserPassword(Email, Password) {
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

/**
 * Sets PasswordResetToken and PasswordResetExpiration to NULL for the user with the given email.
 * @param {String} Email 
 */
async function clearPasswordReset(Email) {
    try {
        // Connect
        const pool = await poolPromise;
        // Make request
        const result = await pool.request()
            .input('Email', sql.VarChar(300), Email)
            // Update password and wipe the reset token to prevent further changes.
            .query('UPDATE Users \
                    SET PasswordResetToken = NULL, PasswordResetExpiration = NULL \
                    WHERE Email = @Email');
    } catch (err) {
        console.log(err);
    }
}

/**
 * Create a log entry into Logins with the given details
 * Request Body: {
 *  LoginDate: Date/Time,
 *  Username: String,
 *  Success: String
 * }
 * @param {Object} Login 
 */
async function createLogin(Login) {
    try {
        // Connect to pool
        const pool = await poolPromise;
        // Make request
        await pool.request()
            .input('LoginDate', sql.DateTime, Login.LoginDate)
            .input('Username', sql.VarChar(50), Login.Username)
            .input('Success', sql.VarChar(50), Login.Success)
            .query("\
                    INSERT INTO Logins(\
                        LID,\
                        LoginDate,\
                        Username,\
                        Success) \
                    VALUES(\
                        NEWID(),\
                        @LoginDate,\
                        @Username,\
                        @Success)");
        return;
    } catch (err) {
        console.log(err);
    }
}

/**
 * Insert's a new driver application in the Applications table
 * Application example: {
 *  Username: string,
 *  SponsorName: string,
 *  Reason: string
 * }
 * @param {Object} Application 
 */
async function createApplication(Application) {
    try {
        // Connect to pool
        const pool = await poolPromise;

        // Make request
        await pool.request()
            .input('UID', sql.UniqueIdentifier, Application.UID)
            .input('SID', sql.UniqueIdentifier, Application.SID)
            .input('Reason', sql.VarChar(100), Application.Reason)
            .query("\
                    INSERT INTO Applications(AID, UID, SID, ApplicationDate, ApplicationStatus, Reason) \
                    VALUES(NEWID(), @UID, @SID, SYSDATETIME(), 'Pending', @Reason)");
        return;
    } catch (err) {
        console.log(err);
    }
}

/**
 * Returns an array of application objects belonging to the user with
 * Username from the database.
 * Application Example: {
 *  AID: String,
 *  Username: String,
 *  SponsorName: String,
 *  ApplicationDate: String,
 *  ApplicationStatus: String,
 *  Reason: String
 * }
 * @param {String} Username 
 * @returns Array
 */
async function getUserApplications(Username) {
    try {
        // Connect to pool
        const pool = await poolPromise;

        const result = await pool.request()
            .input('Username', sql.VarChar(50), Username)
            .query(
                "SELECT \
                    Applications.AID,\
                    Users.Username,\
                    Sponsors.SponsorName,\
                    Applications.ApplicationDate,\
                    Applications.ApplicationStatus,\
                    Applications.Reason \
                FROM Applications \
                JOIN Users ON Users.UID = Applications.UID \
                JOIN Sponsors ON Sponsors.SID = Applications.SID \
                WHERE Users.Username = @Username"
            );

        return result.recordset;
    } catch (err) {
        console.log(err);
    }
}

/**
 * Deletes the application with AID and Username from the database
 * and returns 1 if successful and 0 if no record was found.
 * @param {String} AID 
 * @param {String} Username 
 * @returns Number
 */
async function deleteApplication(AID, Username) {
    try {
        // Connect to pool
        const pool = await poolPromise;

        const result = await pool.request()
            .input('Username', sql.VarChar(50), Username)
            .input('AID', sql.UniqueIdentifier, AID)
            .query("DELETE Applications FROM Applications JOIN Users ON Users.UID = Applications.UID WHERE Username = @Username AND AID = @AID");

        return result.rowsAffected[0];
    } catch (err) {
        console.log(err);
    }
}

/**
 * Deletes all of the applications with Username from the database
 * and returns the number of applications deleted.
 * @param {String} Username 
 * @returns Number
 */
async function deleteUsersApplications(Username) {
    try {
        // Connect to pool
        const pool = await poolPromise;

        const result = await pool.request()
            .input('Username', sql.VarChar(50), Username)
            .query("DELETE Applications FROM Applications JOIN Users ON Users.UID = Applications.UID WHERE Username = @Username");

        return result.rowsAffected[0];
    } catch (err) {
        console.log(err);
    }
}

/**
     * Create a password change log entry into PWChanges with the given details
     * Request Body: {
     *  UID: Unique Identifier,
     *  PWCDate: Date/Time,
     *  ChangeType: String
     * }
     */
async function createPWC(PWC) {
    try {
        // Connect to pool
        const pool = await poolPromise;
        // Make request
        const result = await pool.request()
            .input('UID', sql.UniqueIdentifier, PWC.UID)
            .input('PWCDate', sql.DateTime, PWC.PWCDate)
            .input('ChangeType', sql.VarChar(50), PWC.ChangeType)
            .query("\
                INSERT INTO PWChanges(\
                    PWCID,\
                    UID,\
                    PWCDate,\
                    ChangeType) \
                VALUES(\
                    NEWID(),\
                    @UID,\
                    @PWCDate,\
                    @ChangeType)");
        return;
    } catch (err) {
        console.log(err);
    }
}

async function getSponsorCatalog(CID) {
    try {
        // Connect to pool
        const pool = await poolPromise;
        // Make request
        const result = await pool.request()
            .input('CID', sql.UniqueIdentifier, CID)
            .query("\
                SELECT CSID, term, media, entity, limit \
                FROM CatalogSearches \
                JOIN Catalogs ON Catalogs.CID = CatalogSearches.CID \
                WHERE Catalogs.CID = @CID");
        return result.recordset;
    } catch (err) {
        console.log(err);
    }
}

async function addCatalogSearchQuery(CID, Search) {
    try {
        // Connect to pool
        const pool = await poolPromise;
        // Make request
        const result = await pool.request()
            .input('CID', sql.UniqueIdentifier, CID)
            .input('term', sql.VarChar(50), Search.term)
            .input('media', sql.VarChar(50), Search.media)
            .input('entity', sql.VarChar(50), Search.entity)
            .input('limit', sql.Int, Search.limit)
            .query("\
                INSERT INTO CatalogSearches (CID, term, media, entity, limit, CSID) \
                VALUES(@CID, @term, @media, @entity, @limit, NEWID())");
        return result.recordset;
    } catch (err) {
        console.log(err);
    }
}

async function updateSearchQuery(SID, CID, Searches) {
    try {
        // Connect to pool
        const pool = await poolPromise;
        let transaction;
        try {
            transaction = pool.transaction();
            await transaction.begin();
            await new sql.Request(transaction)
                .input("SID", sql.UniqueIdentifier, SID)
                .query("DELETE CatalogSearches \
                        FROM CatalogSearches \
                        JOIN Catalogs ON Catalogs.CID = CatalogSearches.CID \
                        JOIN Sponsors ON Sponsors.SID = Catalogs.SID \
                        WHERE Sponsors.SID = @SID");
            for (const search of Searches) {
                await pool.request()
                    .input('CID', sql.UniqueIdentifier, CID)
                    .input('term', sql.VarChar(50), search.term)
                    .input('media', sql.VarChar(50), search.media)
                    .input('entity', sql.VarChar(50), search.entity)
                    .input('limit', sql.Int, search.limit)
                    .query("\
                        INSERT INTO CatalogSearches (CID, CSID, term, media, entity, limit) \
                        VALUES(@CID, NEWID(), @term, @media, @entity, @limit)");
            }
            await transaction.commit();
            return true;
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (err) {
        console.log(err);
    }
}

async function deleteCatalogSearchQuery(CID, CSID) {
    try {
        // Connect to pool
        const pool = await poolPromise;
        // Make request
        const result = await pool.request()
            .input('CID', sql.UniqueIdentifier, CID)
            .input('CSID', sql.UniqueIdentifier, CSID)
            .query("\
                DELETE CatalogSearches \
                FROM CatalogSearches \
                JOIN Catalogs ON Catalogs.CID = CatalogSearches.CID \
                WHERE Catalogs.CID = @CID AND CSID = @CSID");
        return result.rowsAffected[0];
    } catch (err) {
        console.log(err);
    }
}

async function getUsersSponsors(UID) {
    try {
        // Connect to pool
        const pool = await poolPromise;
        // Make request
        const result = await pool.request()
            .input('UID', sql.UniqueIdentifier, UID)
            .query("SELECT Sponsors.SponsorName \
                    FROM SponsorsUsers \
                    JOIN Sponsors ON Sponsors.SID = SponsorsUsers.SID \
                    WHERE UID = @UID");
        return result.recordset;
    } catch (err) {
        console.log(err);
    }
}

/**
     * Create a transcation for the given user, sponsor, quantity, and reason
     * Request Body: {
     *  UID: Unique Identifier,
     *  SID: Unique Identifier,
     *  TransactionDate: Date/Time,
     *  TransactionAmount: Int,
     *  Reason: String
     * }
     */
async function createTransaction(Transaction){
    try {
        // Connect to pool
        const pool = await poolPromise;
        // Make request
        const result = await pool.request()
            .input('UID', sql.UniqueIdentifier, Transaction.UID)
            .input('SID', sql.UniqueIdentifier, Transaction.SID)
            .input('TransactionDate', sql.DateTime, PWC.TransactionDate)
            .input('TransactionAmount', sql.Int, Transaction.TransactionAmount)
            .input('Reason', sql.VarChar(100), PWC.ChangeType)
            .query("\
                INSERT INTO Transactions(\
                    TID,\
                    UID,\
                    SID,\
                    TransactionDate,\
                    TransactionAmount,\
                    Reason) \
                VALUES(\
                    NEWID(),\
                    @UID,\
                    @SID,\
                    @TransactionDate,\
                    @TransactionAmount,\
                    @Reason)");
        return;
    } catch (err) {
        console.log(err);
    }
}

// Write query functions here so that they are 
// exported as part of the db module.
module.exports = {
    getSponsors,
    getSponsorByName,
    getUserByUsername,
    getUserByEmail,
    getLatestRelease,
    createUser,
    getUserPasswordResetToken,
    generatePasswordResetToken,
    saveRefreshToken,
    clearRefreshToken,
    getUserByRefreshToken,
    resetUserPassword,
    clearPasswordReset,
    createLogin,
    createApplication,
    getUserApplications,
    deleteApplication,
    deleteUsersApplications,
    createPWC,
    getSponsorCatalog,
    addCatalogSearchQuery,
    updateSearchQuery,
    deleteCatalogSearchQuery,
    getUsersSponsors,
    createTransaction
}