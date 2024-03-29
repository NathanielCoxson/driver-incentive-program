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


async function getDrivers() {
    try {
        // Connect
        const pool = await poolPromise;
        // Make request
        const result = await pool.request()
            .query("SELECT * FROM Users WHERE Role = 'driver'");
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
            .input('SponsorName', sql.VarChar(100), SponsorName)
            .query("SELECT Sponsors.SID, Sponsors.SponsorName, Catalogs.CID, Catalogs.ConversionRate \
                    FROM Sponsors \
                    LEFT JOIN Catalogs ON Catalogs.SID = Sponsors.SID \
                    WHERE SponsorName = @SponsorName");
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
            .query("SELECT\
                        Users.UID,\
                        Sponsors.SponsorName,\
                        Users.Name,\
                        Users.Role,\
                        Users.Username,\
                        Users.Password,\
                        Users.Email\
                    FROM\
                        (Users LEFT JOIN SponsorsUsers ON Users.UID = SponsorsUsers.UID) LEFT JOIN Sponsors ON SponsorsUsers.SID = Sponsors.SID\
                    WHERE\
                        Users.Username = @username");
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
            .query("SELECT\
                        Users.UID,\
                        Sponsors.SponsorName,\
                        Users.Name,\
                        Users.Role,\
                        Users.Username,\
                        Users.Password,\
                        Users.Email\
                    FROM\
                        (Users LEFT JOIN SponsorsUsers ON Users.UID = SponsorsUsers.UID) LEFT JOIN Sponsors ON SponsorsUsers.SID = Sponsors.SID\
                    WHERE\
                        Users.Email = @Email");
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
*  Role: String,
*  Vehicle: String,
*  PhoneNumber: String
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
                .input('VehicleInfo', sql.VarChar(50), User.VehicleInfo)
                .input('PhoneNumber', sql.VarChar(50), User.PhoneNumber)
                .query("DECLARE @usid uniqueidentifier;\
                        SET @usid = NEWID();\
                        INSERT INTO Users(\
                                        UID,\
                                        Name,\
                                        Role,\
                                        Username,\
                                        Password,\
                                        Email)\
                                    VALUES(\
                                        @usid,\
                                        @Name,\
                                        @Role,\
                                        @Username,\
                                        @Password,\
                                        @Email);\
                        INSERT INTO Profiles VALUES(\
                                        NEWID(),\
                                        @usid,\
                                        @VehicleInfo,\
                                        @PhoneNumber);");
                        
        }
        else {
            result = await pool.request()
                .input('SID', User.SID)
                .input('Name', sql.VarChar(100), User.Name)
                .input('Role', User.Role)
                .input('Username', sql.VarChar(50), User.Username)
                .input('Password', sql.VarChar(100), User.Password)
                .input('Email', sql.VarChar(300), User.Email)
                .input('VehicleInfo', sql.VarChar(50), User.VehicleInfo)
                .input('PhoneNumber', sql.VarChar(50), User.PhoneNumber)
                .query("DECLARE @usid uniqueidentifier;\
                        SET @usid = NEWID();\
                        INSERT INTO Users(\
                                        UID,\
                                        Name,\
                                        Role,\
                                        Username,\
                                        Password,\
                                        Email)\
                                    VALUES(\
                                        @usid,\
                                        @Name,\
                                        @Role,\
                                        @Username,\
                                        @Password,\
                                        @Email);\
                        INSERT INTO SponsorsUsers VALUES (CAST(@SID AS uniqueidentifier), @usid);\
                        INSERT INTO Profiles VALUES(\
                                        NEWID(),\
                                        @usid,\
                                        @VehicleInfo,\
                                        @PhoneNumber);");
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
            .query('SELECT Users.UID, Sponsors.SID, Users.Name, Users.Role, Users.Username, Users.Password, Users.Email, Users.RefreshTokenExpiration FROM (Users LEFT JOIN SponsorsUsers ON Users.UID = SponsorsUsers.UID) LEFT JOIN Sponsors ON SponsorsUsers.SID = Sponsors.SID WHERE RefreshToken = @RefreshToken');
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
        if (result.rowsAffected === 0) throw new Error('Failed to update password');
        
        // Get user
        let user = await pool.request()
            .input('Email', sql.VarChar(300), Email)
            .query('SELECT UID FROM Users WHERE Email = @Email');
        user = user.recordset[0];
        
        // Add record for password changes audit log
        const PWC = {
            UID: user.UID,
            ChangeType: 'reset'
        }
        await createPWC(PWC);
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
 * Returns the application with the given AID
 * @param {UniqueIdentifier} AID 
 * @returns Array
 */
async function getApplication(AID) {
    try {
        // Connect to pool
        const pool = await poolPromise;

        const result = await pool.request()
            .input('AID', sql.UniqueIdentifier, AID)
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
                WHERE Applications.AID = @AID"
            );

        return result.recordset[0];
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
 * Returns an array of application objects belonging to the sponsor with
 * the given Sponsor name
 * Application Example: {
 *  AID: String,
 *  Username: String,
 *  SponsorName: String,
 *  ApplicationDate: String,
 *  ApplicationStatus: String,
 *  Reason: String
 * }
 * @param {String} SponsorName
 * @returns Array
 */
async function getSponsorApplications(SponsorName) {
    try {
        // Connect to pool
        const pool = await poolPromise;

        const result = await pool.request()
            .input('SponsorName', sql.VarChar(100), SponsorName)
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
                WHERE Sponsors.SponsorName = @SponsorName"
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
 * Accepts or rejects the application with the given AID, returns the number of rows updated
 * @param {UniqueIdentifier} AID
 * @param {String} ApplicationStatus
 * @returns Number
 */
async function processApplication(AID, ApplicationStatus) {
    try {
        // Connect to pool
        const pool = await poolPromise;

        const result = await pool.request()
            .input('AID', sql.UniqueIdentifier, AID)
            .input('ApplicationStatus', sql.VarChar(100), ApplicationStatus)
            .query("UPDATE Applications \
                    SET ApplicationStatus = @ApplicationStatus \
                    WHERE AID = @AID");

        return result.rowsAffected[0];
    } catch (err) {
        console.log(err);
    }
}

/**
 * Adds an entry to SponsorsUsers, returns rows updated
 * @param {UniqueIdentifier} UID 
 * @param {UniqueIdentifier} SID 
 * @returns Number
 */
async function addSponsorsUsers(UID, SID){
    try {
        // Connect to pool
        const pool = await poolPromise;
        // Make request
        const result = await pool.request()
            .input('UID', sql.UniqueIdentifier, UID)
            .input('SID', sql.UniqueIdentifier, SID)
            .query("\
                INSERT INTO SponsorsUsers(\
                    UID,\
                    SID) \
                VALUES(\
                    @UID,\
                    @SID)");
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
                    SYSDATETIME(),\
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
                SELECT CSID, term, media, entity, limit, Catalogs.ConversionRate \
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

async function updateSearchQuery(SID, CID, Searches, conversionRate) {
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
            await new sql.Request(transaction)
                .input("ConversionRate", sql.Float, conversionRate)
                .input("SID", sql.UniqueIdentifier, SID)
                .query("UPDATE Catalogs SET ConversionRate = @ConversionRate WHERE SID = @SID");

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
            .query("SELECT Sponsors.SponsorName, Sponsors.SID \
                    FROM SponsorsUsers \
                    JOIN Sponsors ON Sponsors.SID = SponsorsUsers.SID \
                    WHERE UID = @UID");
        return result.recordset;
    } catch (err) {
        console.log(err);
    }
}

/**
 * Get the list of drivers for a given SID
 * @param {UniqueIdentifier} SID
 * @Return Array
 */
async function getSponsorsDrivers(SID) {
    try {
        // Connect to pool
        const pool = await poolPromise;
        // Make request
        const result = await pool.request()
            .input('SID', sql.UniqueIdentifier, SID)
            .query("SELECT Users.UID, Users.Name, Users.Role, Users.Username, Email, ISNULL(SUM(Transactions.TransactionAmount), 0) as Points\
                    FROM Users INNER JOIN SponsorsUsers ON Users.UID = SponsorsUsers.UID LEFT JOIN Transactions ON Users.UID = Transactions.UID AND SponsorsUsers.SID = Transactions.SID\
                    WHERE SponsorsUsers.SID = @SID AND Users.Role = 'driver'\
                    GROUP BY Users.UID, Users.Name, Users.Role, Users.Username, Email");
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
async function createTransaction(Transaction) {
    try {
        // Connect to pool
        const pool = await poolPromise;
        // Make request
        const result = await pool.request()
            .input('UID', sql.UniqueIdentifier, Transaction.UID)
            .input('SID', sql.UniqueIdentifier, Transaction.SID)
            .input('TransactionDate', sql.DateTime, Transaction.TransactionDate)
            .input('TransactionAmount', sql.Int, Transaction.TransactionAmount)
            .input('Reason', sql.VarChar(100), Transaction.Reason)
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

/**
 * Return all transactions associated with a given user and sponsor
 * Results are sorted by descending date
 * Request Body: {
 *  UID: Unique Identifier,
 *  SID: Unique Identifier
 * }
 * @param {UniqueIdentifier} UID
 * @param {UniqueIdentifier} SID
 */
async function getTransactions(UID, SID){
    try {
        // Connect to pool
        const pool = await poolPromise;
        // Make request
        const result = await pool.request()
            .input('UID', sql.UniqueIdentifier, UID)
            .input('SID', sql.UniqueIdentifier, SID)
            .query("\
                SELECT\
                    TID,\
                    TransactionDate,\
                    TransactionAmount,\
                    Reason\
                FROM\
                    Transactions\
                WHERE\
                    UID = @UID AND SID = @SID\
                ORDER BY\
                    TransactionDate DESC");
        return result.recordset;
    } catch (err) {
        console.log(err);
    }
}

/**
 * Return the total points for a given user and sponsor
 * Request Body: {
 *  UID: Unique Identifier,
 *  SID: Unique Identifier
 * }
 * @param {UniqueIdentifier} UID
 * @param {UniqueIdentifier} SID
 */
async function getPoints(UID, SID){
    try {
        // Connect to pool
        const pool = await poolPromise;
        // Make request
        const result = await pool.request()
            .input('UID', sql.UniqueIdentifier, UID)
            .input('SID', sql.UniqueIdentifier, SID)
            .query("\
                SELECT\
                    SUM(TransactionAmount) AS Points\
                FROM\
                    Transactions\
                WHERE\
                    UID = @UID AND SID = @SID\
                GROUP BY\
                    UID");
        return result.recordset;
    } catch (err) {
        console.log(err);
    }
}


/**
 * Edit the Profile information for the user with the given UID, returns the number of rows affected
 * @param {UniqueIdentifier} UID
 * @param {String} Vehicle
 * @param {String} PhoneNumber
 * @returns Number
 */
async function updateProfile(UID, Vehicle, PhoneNumber) {
    try {
        // Connect to pool
        const pool = await poolPromise;

        const result = await pool.request()
            .input('@UID', sql.UniqueIdentifier, UID)
            .input('@Vehicle'.sql.VarChar(50), Vehicle)
            .input('@PhoneNumber'.sql.VarChar(50), PhoneNumber)
            .query("UPDATE Profiles \
                    SET Vehicle = @Vehicle, PhoneNumber = @PhoneNumber \
                    WHERE UID = @UID");

        return result.rowsAffected[0];
    } catch (err) {
        console.log(err);
    }
}

/**
 * Adds a new sponsor to the database with the given name.
 * @param {String} SponsorName 
 */
async function createSponsor(SponsorName, UID) {
    try {
        // Connect to pool
        const pool = await poolPromise;

        // Transaction
        let transaction;
        try {
            transaction = pool.transaction();
            await transaction.begin();

            // Insert new sponsor
            const sponsor = await new sql.Request(transaction)
                .input("SponsorName", sql.VarChar(50), SponsorName)
                .query("INSERT INTO Sponsors (SID, SponsorName) OUTPUT INSERTED.* VALUES(NEWID(), @SponsorName)");
            if (!sponsor.recordset[0]) throw new Error('Failed to insert sponsor.');

            // Insert catalog for new sponsor
            const catalog = await new sql.Request(transaction)
                .input("SID", sql.UniqueIdentifier, sponsor?.recordset[0]?.SID)
                .query("INSERT INTO Catalogs (CID, SID, ConversionRate) OUTPUT INSERTED.* VALUES(NEWID(), @SID, 0.01)");
            if (!catalog.recordset[0]) throw new Error('Failed to create catalog.');

            // Add the user who created the sponsor organization to the new organization
            const user = await new sql.Request(transaction)
                .input("UID", sql.UniqueIdentifier, UID)
                .input("SID", sql.UniqueIdentifier, sponsor?.recordset[0]?.SID)
                .query("INSERT INTO SponsorsUsers (SID, UID) OUTPUT INSERTED.* VALUES(@SID, @UID)");
            if (!user.recordset[0]) throw new Error('Failed to add user to new organization.');

            await transaction.commit();
            return true;
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

/**
 * Deletes the given sponsor from the database.
 * @param {String} SponsorName 
 * @returns Number
 */
async function deleteSponsor(SponsorName) {
    try {
        // Connect to pool
        const pool = await poolPromise;

        const result = await pool.request()
            .input('SponsorName', sql.VarChar(50), SponsorName)
            .query("DELETE FROM Sponsors WHERE SponsorName = @SponsorName");

        return result.rowsAffected[0];
    } catch (err) {
        console.log(err);
    }
}

/**
 * Updates the existing information for the given sponsor.
 * @param {String} SponsorName 
 * @param {Object} Update 
 * @returns 
 */
async function updateSponsor(SponsorName, Update) {
    try {
        // Connect to pool
        const pool = await poolPromise;
        const result = await pool.request()
            .input('SponsorName', sql.VarChar(50), SponsorName)
            .input('NewName', sql.VarChar(50), Update.SponsorName)
            .query("UPDATE Sponsors SET SponsorName = @NewName OUTPUT inserted.* WHERE SponsorName = @SponsorName");
        return result.recordset[0];
    } catch (err) {
        console.log(err);
    }
}

/**
 * Creates a new order for the given user with the provided list of items and sponsor id.
 * This includes inserting an order into the orders table, a new transaction to reflect the point deduction
 * into the transactions table, and individual rows in the OrderLines table for each order item.
 * @param {Array} items 
 * @param {String} UID 
 * @param {String} SID 
 */
async function createOrder(items, UID, SID) {
    try {
        
        // Connect to pool
        const pool = await poolPromise;
        let transaction;
        try {
            transaction = pool.transaction();
            await transaction.begin();
            const datetime = (new Date()).toISOString().slice(0, 19).replace('T', ' ');
            const amount = items.reduce((acc, curr) => acc += curr.itemPrice, 0);

            // Insert new order
            const order = await new sql.Request(transaction)
                .input("UID", sql.UniqueIdentifier, UID)
                .input("datetime", sql.DateTime, datetime)
                .input("SID", sql.UniqueIdentifier, SID)
                .query("INSERT INTO Orders (OID, UID, OrderDate, SID) OUTPUT INSERTED.* \
                        VALUES(NEWID(), @UID, @datetime, @SID)");
            if (!order.recordset[0]) throw new Error("Failed to create new order.");

            const pointTransaction = await new sql.Request(transaction)
                .input('SID', sql.UniqueIdentifier, SID)
                .input('UID', sql.UniqueIdentifier, UID)
                .input('datetime', sql.DateTime, datetime)
                .input('amount', sql.Float, amount * -1)
                .query("INSERT INTO Transactions(TID, UID, SID, TransactionDate, TransactionAmount, Reason) OUTPUT INSERTED.*\
                        VALUES(NEWID(), @UID, @SID, @datetime, @amount, 'Order')");
            if (!pointTransaction.recordset[0]) throw new Error("Failed in insert order transaction.");

            let count = 0;
            for(let i of items) {
                let description = i.itemDescription;
                if (i.itemDescription === '') description = 'NULL';

                const item = await new sql.Request(transaction)
                    .input("itemPrice", sql.Float, i.itemPrice)
                    .input("itemDescription", sql.Text, description)
                    .input("itemName", sql.VarChar(100), i.itemName)
                    .input("OID", sql.UniqueIdentifier, order.recordset[0].OID)
                    .input("number", sql.Int, count)
                    .query("INSERT INTO OrderLines (OLID, OID, OrderLineNumber, ItemCost, ItemName, ItemDescription) OUTPUT INSERTED.* \
                            VALUES(NEWID(), @OID, @number, @itemPrice, @itemName, @itemDescription)")
                if (!item.recordset[0]) throw new Error("Failed to insert new item.");
                count++;
            }

            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (err) {
        console.log(err);
    }
}

/**
 * Returns the total points of a driver for the provided sponsor.
 * @param {String} UID 
 * @param {String} SID 
 */
async function getDriverPoints(UID, SID) {
    try {
        // Connect to pool
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UID', sql.UniqueIdentifier, UID)
            .input('SID', sql.UniqueIdentifier, SID)
            .query("SELECT SUM(TransactionAmount) AS Points FROM Transactions WHERE UID = @UID AND SID = @SID");
        return result.recordset[0].Points;
    } catch (err) {
        console.log(err);
    }
}

/**
 * Returns a list of order objects for the given user.
 * @param {String} UID 
 */
async function getUsersOrders(UID) {
    try {
        // Connect to pool
        const pool = await poolPromise;
        
        let transaction;
        let result = [];
        try {
            transaction = pool.transaction();
            await transaction.begin();

            let orders = await new sql.Request(transaction)
                .input("UID", sql.UniqueIdentifier, UID)
                .query("SELECT OID, UID, Sponsors.SID, Sponsors.SponsorName, ShippingAddress, BillingAddress, OrderDate, ArrivalDate \
                        FROM Orders \
                        JOIN Sponsors ON Orders.SID = Sponsors.SID \
                        WHERE UID = @UID");
            if (!orders) throw new Error("Error retrieving orders.");
            orders = orders.recordset;

            for (let order of orders) {
                let items = await new sql.Request(transaction)
                    .input("OID", sql.UniqueIdentifier, order.OID)
                    .query("SELECT * FROM OrderLines WHERE OID = @OID");
                result.push({ ...order, items: items.recordset, total: items.recordset.reduce((acc, curr) => acc += curr.ItemCost, 0) });
            }
            await transaction.commit();
            return result;
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

/**
 * Edit the Profile information for the user with the given UID, returns the number of rows affected
 * @param {UniqueIdentifier} UID
 * @param {String} Vehicle
 * @param {String} PhoneNumber
 * @returns Number
 */
async function updateUser(UID, Password, Name, Email, PhoneNumber){
    try {
        // Connect to pool
        const pool = await poolPromise;

        const result = await pool.request()
            .input('UID', sql.UniqueIdentifier, UID)
            .input('Name', sql.VarChar(100), Name)
            .input('Password', sql.VarChar(100), Password)
            .input('Email', sql.VarChar(300), Email)
            .query("UPDATE Users \
                    SET Name = @Name, Password = @Password, Email = @Email \
                    WHERE UID = @UID");

        return result.rowsAffected[0];
    } catch (err) {
        console.log(err);
    }
}

async function getAllAdmin() {
    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .query("SELECT * FROM USERS WHERE Role='admin'");
        return result.recordset;
    } catch (err) {
        console.log(err)
    }
}

/**
 * Returns a list of all sponsor objects including a list of each of their sales.
 * Sorted by date range.
 */
async function getSponsorSales(StartDate, EndDate) {
    try {
        const pool = await poolPromise;

        let transaction;
        let result = [];
        try {
            transaction = pool.transaction();
            await transaction.begin();

            let sponsors = await new sql.Request(transaction)
                .query("SELECT SponsorName, Sponsors.SID, Catalogs.ConversionRate \
                        FROM Sponsors \
                        JOIN Catalogs ON Catalogs.SID = Sponsors.SID");
            if (!sponsors) throw new Error("Error retrieving sponsors.");

            for (let sponsor of sponsors.recordset) {
                let sales = [];
                let orders = await new sql.Request(transaction)
                    .input("SID", sql.UniqueIdentifier, sponsor.SID)
                    .input("StartDate", sql.DateTime, StartDate)
                    .input("EndDate", sql.DateTime, EndDate)
                    .query("SELECT \
                                OID, \
                                Users.UID, \
                                Sponsors.SID, \
                                Sponsors.SponsorName, \
                                ShippingAddress, \
                                BillingAddress, \
                                OrderDate, \
                                ArrivalDate, \
                                Users.Username \
                            FROM Orders \
                            JOIN Sponsors ON Orders.SID = Sponsors.SID \
                            JOIN Users ON Users.UID = Orders.UID \
                            WHERE Sponsors.SID = @SID AND OrderDate >= @StartDate AND OrderDate <= @EndDate");
                if (!orders) throw new Error("Error retrieving orders.");
                orders = orders.recordset;

                for (let order of orders) {
                    let items = await new sql.Request(transaction)
                        .input("OID", sql.UniqueIdentifier, order.OID)
                        .query("SELECT * FROM OrderLines WHERE OID = @OID");
                    sales.push({ 
                        ...order, 
                        items: items.recordset, 
                        total: items.recordset.reduce((acc, curr) => acc += curr.ItemCost, 0),
                        ConversionRate: sponsor.ConversionRate,
                    });
                }
                result.push({ SponsorName: sponsor.SponsorName, sales });
            }

            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }

        return result;
    } catch (err) {
        console.log(err);
    }
}

/**
 * Returns a list of all sponsor objects including a list of each of their sales.
 */
async function getAllSales() {
    try {
        const pool = await poolPromise;

        let transaction;
        let result = [];
        try {
            transaction = pool.transaction();
            await transaction.begin();

            let sponsors = await new sql.Request(transaction)
                .query("SELECT SponsorName, Sponsors.SID, Catalogs.ConversionRate \
                        FROM Sponsors \
                        JOIN Catalogs ON Catalogs.SID = Sponsors.SID");
            if (!sponsors) throw new Error("Error retrieving sponsors.");

            for (let sponsor of sponsors.recordset) {
                let sales = [];
                let orders = await new sql.Request(transaction)
                    .input("SID", sql.UniqueIdentifier, sponsor.SID)
                    .query("SELECT \
                                OID, \
                                Users.UID, \
                                Sponsors.SID, \
                                Sponsors.SponsorName, \
                                ShippingAddress, \
                                BillingAddress, \
                                OrderDate, \
                                ArrivalDate, \
                                Users.Username, \
                                Catalogs.ConversionRate \
                            FROM Orders \
                            JOIN Sponsors ON Orders.SID = Sponsors.SID \
                            JOIN Catalogs ON Catalogs.SID = Sponsors.SID \
                            JOIN Users ON Users.UID = Orders.UID \
                            WHERE Sponsors.SID = @SID");
                if (!orders) throw new Error("Error retrieving orders.");
                orders = orders.recordset;
                console.log(orders);

                for (let order of orders) {
                    let items = await new sql.Request(transaction)
                        .input("OID", sql.UniqueIdentifier, order.OID)
                        .query("SELECT * FROM OrderLines WHERE OID = @OID");
                    sales.push({ 
                        ...order, 
                        items: items.recordset, 
                        total: items.recordset.reduce((acc, curr) => acc += curr.ItemCost, 0) 
                    });
                }
                result.push({ SponsorName: sponsor.SponsorName, sales });
            }

            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
        return result;
    } catch (err) {
        console.log(err);
    }
}

async function getSponsorSalesByName(SponsorName, StartDate, EndDate) {
    try {
        const pool = await poolPromise;

        let transaction;
        let result = [];
        try {
            transaction = pool.transaction();
            await transaction.begin();

            let sponsor = await new sql.Request(transaction)
                .input("SponsorName", sql.VarChar(50), SponsorName)
                .query("SELECT * \
                        FROM Sponsors \
                        JOIN Catalogs ON Catalogs.SID = Sponsors.SID \
                        WHERE SponsorName = @SponsorName");
            sponsor = sponsor.recordset[0];
            let ConversionRate = sponsor.ConversionRate;
            if (!sponsor) throw new Error("Error retrieving sponsor.");

            let sales = [];
            let orders = await new sql.Request(transaction)
                .input("SID", sql.UniqueIdentifier, sponsor.SID)
                .input("StartDate", sql.DateTime, StartDate)
                .input("EndDate", sql.DateTime, EndDate)
                .query("SELECT \
                            OID, \
                            Users.UID, \
                            Sponsors.SID, \
                            Sponsors.SponsorName, \
                            ShippingAddress, \
                            BillingAddress, \
                            OrderDate, \
                            ArrivalDate, \
                            Users.Username \
                        FROM Orders \
                        JOIN Sponsors ON Orders.SID = Sponsors.SID \
                        JOIN Users ON Users.UID = Orders.UID \
                        WHERE Sponsors.SID = @SID AND OrderDate >= @StartDate AND OrderDate <= @EndDate");
            if (!orders) throw new Error("Error retrieving orders.");
            orders = orders.recordset;

            for (let order of orders) {
                let items = await new sql.Request(transaction)
                    .input("OID", sql.UniqueIdentifier, order.OID)
                    .query("SELECT * FROM OrderLines WHERE OID = @OID");
                sales.push({ 
                    ...order, 
                    items: items.recordset, 
                    total: items.recordset.reduce((acc, curr) => acc += curr.ItemCost, 0),
                    ConversionRate: ConversionRate,
                });
            }

            await transaction.commit();
            return sales;
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (err) {
        console.log(err);
    }
}

/**
 * Returns a list of applications between the given dates.
 * @param {String} StartDate 
 * @param {String} EndDate 
 * @returns {Array} a list of applications
 */
async function getAllApplications(StartDate, EndDate) {
    try {
        // Connect to pool
        const pool = await poolPromise;
        // Make request
        let result;
        if (StartDate && EndDate) {
            result = await pool.request()
            .input("StartDate", sql.DateTime, StartDate)
            .input("EndDate", sql.DateTime, EndDate)
            .query("\
                SELECT \
                    Users.Username,\
                    Sponsors.SponsorName,\
                    ApplicationDate,\
                    ApplicationStatus,\
                    Reason \
                FROM Applications \
                JOIN Users ON Users.UID = Applications.UID \
                JOIN Sponsors ON Sponsors.SID = Applications.SID\
                WHERE Applications.ApplicationDate >= @StartDate AND Applications.ApplicationDate <= @EndDate\
            ");
        }
        else {
            result = await pool.request()
            .query("\
                SELECT \
                    Users.Username,\
                    Sponsors.SponsorName,\
                    ApplicationDate,\
                    ApplicationStatus,\
                    Reason \
                FROM Applications \
                JOIN Users ON Users.UID = Applications.UID \
                JOIN Sponsors ON Sponsors.SID = Applications.SID\
            ");
        }
        return result.recordset;
    } catch (err) {
        console.log(err);
    }
}

/**
 * Returns a list of point transactions within the given date range.
 * @param {String} StartDate 
 * @param {String} EndDate 
 * @returns {Array} a list of point transactions
 */
async function getAllTransactions(StartDate, EndDate) {
    try {
        // Connect to pool
        const pool = await poolPromise;
        // Make request
        let result;
        if (StartDate && EndDate) {
            result = await pool.request()
            .input("StartDate", sql.DateTime, StartDate)
            .input("EndDate", sql.DateTime, EndDate)
            .query("\
                SELECT \
                    Users.Username, \
                    Sponsors.SponsorName, \
                    Transactions.TransactionDate, \
                    Transactions.TransactionAmount, \
                    Transactions.Reason \
                FROM Transactions \
                JOIN Users ON Users.UID = Transactions.UID \
                JOIN Sponsors ON Sponsors.SID = Transactions.SID \
                WHERE Transactions.TransactionDate >= @StartDate AND Transactions.TransactionDate <= @EndDate\
            ");
        }
        else {
            result = await pool.request()
            .query("\
                SELECT \
                    Users.Username, \
                    Sponsors.SponsorName, \
                    Transactions.TransactionDate, \
                    Transactions.TransactionAmount, \
                    Transactions.Reason \
                FROM Transactions \
                JOIN Users ON Users.UID = Transactions.UID \
                JOIN Sponsors ON Sponsors.SID = Transactions.SID\
            ");
        }
        return result.recordset;
    } catch (err) {
        console.log(err);
    }
}

/**
 * Returns a list of password changes within the given date range.
 * @param {String} StartDate 
 * @param {String} EndDate 
 * @returns {Array} a list of password changes 
 */
async function getAllPWChanges(StartDate, EndDate) {
    try {
        // Connect to pool
        const pool = await poolPromise;
        // Make request
        let result;
        if (StartDate && EndDate) {
            result = await pool.request()
            .input("StartDate", sql.DateTime, StartDate)
            .input("EndDate", sql.DateTime, EndDate)
            .query("\
                SELECT \
                    Users.Username, \
                    PWChanges.PWCDate AS Date, \
                    PWChanges.ChangeType \
                FROM PWChanges \
                JOIN Users ON Users.UID = PWChanges.UID \
                WHERE PWChanges.PWCDate >= @StartDate AND PWChanges.PWCDate <= @EndDate\
            ");
        }
        else {
            result = await pool.request()
            .query("\
                SELECT \
                    Users.Username, \
                    PWChanges.PWCDate AS Date, \
                    PWChanges.ChangeType \
                FROM PWChanges \
                JOIN Users ON Users.UID = PWChanges.UID\
            ");
        }
        return result.recordset;
    } catch (err) {
        console.log(err);
    }
}

/**
 * Returns a list of password changes within the given date range for users associated with
 * the given sponsor.
 * @param {String} StartDate 
 * @param {String} EndDate 
 * @param {String} SponsorName 
 * @returns {Array} a list of password changes
 */
async function getAllPWChangesBySponsor(StartDate, EndDate, SponsorName) {
    try {
        // Connect to pool
        const pool = await poolPromise;
        // Make request
        let result;
        if (StartDate && EndDate) {
            result = await pool.request()
            .input("StartDate", sql.DateTime, StartDate)
            .input("EndDate", sql.DateTime, EndDate)
            .input("SponsorName", sql.VarChar(50), SponsorName)
            .query("\
                SELECT \
                    Users.Username, \
                    PWChanges.PWCDate AS Date, \
                    PWChanges.ChangeType \
                FROM PWChanges \
                JOIN Users ON Users.UID = PWChanges.UID \
                JOIN SponsorsUsers ON SponsorsUsers.UID = PWChanges.UID \
                JOIN Sponsors ON Sponsors.SID = SponsorsUsers.SID \
                WHERE PWChanges.PWCDate >= @StartDate AND PWChanges.PWCDate <= @EndDate AND Sponsors.SponsorName = @SponsorName\
            ");
        }
        else {
            result = await pool.request()
            .query("\
                SELECT \
                    Users.Username, \
                    PWChanges.PWCDate AS Date, \
                    PWChanges.ChangeType \
                FROM PWChanges \
                JOIN Users ON Users.UID = PWChanges.UID \
                JOIN SponsorsUsers ON SponsorsUsers.UID = PWChanges.UID \
                JOIN Sponsors ON Sponsors.SID = SponsorsUsers.SID \
                WHERE Sponsors.SponsorName = @SponsorName\
            ");
        }
        return result.recordset;
    } catch (err) {
        console.log(err);
    }
}

/**
 * Returns a list of login attempts within the given date range.
 * @param {String} StartDate 
 * @param {String} EndDate 
 * @returns {Array} a list of login attempts
 */
async function getAllLoginAttempts(StartDate, EndDate) {
    try {
        // Connect to pool
        const pool = await poolPromise;
        // Make request
        let result;
        if (StartDate && EndDate) {
            result = await pool.request()
            .input("StartDate", sql.DateTime, StartDate)
            .input("EndDate", sql.DateTime, EndDate)
            .query("\
                SELECT \
                    Username, \
                    LoginDate AS Date, \
                    Success \
                FROM Logins \
                WHERE LoginDate >= @StartDate AND LoginDate <= @EndDate\
            ");
        }
        else {
            result = await pool.request()
            .query("\
                SELECT \
                    Username, \
                    LoginDate AS Date, \
                    Success \
                FROM Logins\
            ");
        }
        return result.recordset;
    } catch (err) {
        console.log(err);
    }
}

/**
 * Returns a list of login attempts within the given date range for users associated
 * with the given sponsor.
 * @param {String} StartDate 
 * @param {String} EndDate 
 * @param {String} SponsorName
 * @returns {Array} a list of login attempts
 */
async function getAllLoginAttemptsBySponsor(StartDate, EndDate, SponsorName) {
    try {
        // Connect to pool
        const pool = await poolPromise;
        // Make request
        let result;
        if (StartDate && EndDate) {
            result = await pool.request()
            .input("StartDate", sql.DateTime, StartDate)
            .input("EndDate", sql.DateTime, EndDate)
            .input("SponsorName", sql.VarChar(50), SponsorName)
            .query("\
                SELECT \
                    Users.Username, \
                    Logins.LoginDate AS Date, \
                    Logins.Success \
                FROM Logins \
                JOIN Users ON Users.Username = Logins.Username \
                JOIN SponsorsUsers ON SponsorsUsers.UID = Users.UID \
                JOIN Sponsors ON Sponsors.SID = SponsorsUsers.SID \
                WHERE Logins.LoginDate >= @StartDate AND Logins.LoginDate <= @EndDate AND Sponsors.SponsorName = @SponsorName\
            ");
        }
        else {
            result = await pool.request()
            .query("\
                SELECT \
                    Users.Username, \
                    Logins.LoginDate AS Date, \
                    Logins.Success \
                FROM Logins \
                JOIN Users ON Users.Username = Logins.Username \
                JOIN SponsorsUsers ON SponsorsUsers.UID = Users.UID \
                JOIN Sponsors ON Sponsors.SID = SponsorsUsers.SID \
                WHERE Sponsors.SponsorName = @SponsorName\
            ");
        }
        return result.recordset;
    } catch (err) {
        console.log(err);
    }
}

// Write query functions here so that they are 
// exported as part of the db module.
module.exports = {
    getSponsors,
    getDrivers,
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
    createTransaction,
    processApplication,
    getSponsorApplications,
    updateProfile,
    getSponsorsDrivers,
    updateUser,
    createSponsor,
    deleteSponsor,
    updateSponsor,
    createOrder,
    getDriverPoints,
    getUsersOrders,
    getTransactions,
    getPoints,
    addSponsorsUsers,
    getApplication,
    getAllAdmin,
    getSponsorSales,
    getAllSales,
    getSponsorSalesByName,
    getAllApplications,
    getAllTransactions,
    getAllPWChanges,
    getAllPWChangesBySponsor,
    getAllLoginAttempts,
    getAllLoginAttemptsBySponsor
}