const express = require('express');
const applications = express.Router();

// Applications Routes
/**
 * POST to <baseurl>/api/applications
 * Accepts a new driver application and stores it in the database.
 * Example request body: {
 *  "Username": "JohnDoe",
 *  "SponsorName": "Test Sponsor",
 *  "Reason": "I would like to join your sponsor organization..."
 * }
 */
applications.post('/', async (req, res) => {
    const body = req.body;

    try {
        const conditions = [
            !body.Username, !body.SponsorName, !body.Reason
        ];
        if (conditions.includes(true)) {
            res.status(400).send();
            return;
        }

        // Get user and sponsor
        const user = await req.app.locals.db.getUserByUsername(body.Username);
        const sponsor = await req.app.locals.db.getSponsorByName(body.SponsorName);

        // Check if user and sponsor were found
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        if (!sponsor) {
            res.status(404).send('Sponsor not found');
            return;
        }
        if (user.Role !== 'driver' && user.Role !== 'sponsor') {
            res.status(403).send('User is not a driver');
            return;
        }

        // Make sure that user hasn't already applied to this sponsor.
        const userApplications = (await req.app.locals.db.getUserApplications(user.Username)).map(app => app.SponsorName);
        if (userApplications.includes(sponsor.SponsorName)) {
            res.status(409).send('User already has pending application with that sponsor.');
            return;
        }

        // Create the application
        await req.app.locals.db.createApplication({
            UID: user.UID,
            SID: sponsor.SID,
            Reason: body.Reason
        });
        const AID = (await req.app.locals.db.getUserApplications(user.Username)).find(app => app.SponsorName === sponsor.SponsorName).AID;
        res.status(201).send({ AID });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * GET to <baseurl>/api/applications/users/:Username
 * Retrieves the applications of the user with the provided username.
 */
applications.get('/users/:Username', async (req, res) => {
    const Username = req.params.Username;

    try {
        const applications = await req.app.locals.db.getUserApplications(Username);
        if (applications.length === 0) {
            res.status(404).send('No applications found.');
            return;
        }

        res.status(200).send({ applications });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * GET to <baseurl>/api/applications/users/:Username
 * Retrieves the applications to the Sponsor with the provided SponsorName.
 */
applications.get('/sponsors/:SponsorName', async (req, res) => {
    const SponsorName = req.params.SponsorName;

    try {
        const applications = await req.app.locals.db.getSponsorApplications(SponsorName);
        if (applications.length === 0) {
            res.status(404).send('No applications found.');
            return;
        }

        res.status(200).send({ applications });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * DELETE to <baseurl>/api/applications/users/:Username
 * Deletes some or all of the applications of the user with the given username.
 * The request body should look like: {
 *  "IDs": [
 *      "EEC8ED37-F3C0-4537-AC20-42CF9E1FD340",
 *      "544F44D9-8D86-4EB8-A2C6-687519C2FD86"
 *  ], (list of application ids for the application to be deleted)
 *  "all": false (optional flag that will delete all applications if true)
 * }
 */
applications.delete('/users/:Username', async (req, res) => {
    try {
        // Delete all of a user's applications
        if (req.body.all) {
            const result = await req.app.locals.db.deleteUsersApplications(req.params.Username);
            if (result === 0) {
                res.status(404).send();
                return;
            }
            res.status(200).send();
        }

        // Delete applications with provided ids.
        else if (req.body.IDs) {
            console.log(req.body.IDs);
            for (let id of req.body.IDs) {
                await req.app.locals.db.deleteApplication(id, req.params.Username);
            }
            res.status(200).send();
        }

        else res.status(400).send();

    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * POST to <baseurl>/api/applications/process
 * Accepts or rejects the application with a specific AID
 * Request body: {
 *      AID: UniqueIdentifier
 *      ApplicationStatus: String
 * }
 */
applications.post('/process', async(req, res) => {
    try {
        const body = req.body;

        //Make sure ApplicationStatus conforms to status types
        if(body.ApplicationStatus != 'Accept' && body.ApplicationStatus != 'Reject'){
            res.status(403).send(body);
        }

        //Make sure that the application exists
        const app = await req.app.locals.db.getApplication(body.AID);

        if(!app){
            res.status(404).send('Application was not found');
            return;
        }

        //Get user for UID
        const user = await req.app.locals.db.getUserByUsername(app.Username);
        if(!user){
            res.status(404).send('User was not found');
            return;
        }

        //Get sponsor for SID
        const sponsor = await req.app.locals.db.getSponsorByName(app.SponsorName);
        if(!sponsor){
            res.status(404).send('Sponsor was not found');
            return;
        }

        // Update application with the given information
        await req.app.locals.db.processApplication(body.AID, body.ApplicationStatus);

        //If process is accepted, create an entry in SponsorsUsers
        if(body.ApplicationStatus === 'Accept'){
            await req.app.locals.db.addSponsorsUsers(user.UID, sponsor.SID);
        }

        //Remove application after processing
        await req.app.locals.db.deleteApplication(body.AID, app.Username);

        // If successful, send success code
        res.status(201).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/**
 * GET <baseurl>/api/sponsors/drivers/:SponsorName
 * Returns the list of drivers in the given sponsor organization
 */
applications.get('/drivers/:SponsorName', async (req, res) => {
    try {
        // Bad request
        if (!req.params.SponsorName) res.status(400).send();
        
        // Query for sponsor
        const sponsor = await req.app.locals.db.getSponsorByName(req.params.SponsorName);
        console.log("Sponsor: ", sponsor);

        if(sponsor){
            // Query for drivers
            const result = await req.app.locals.db.getSponsorsDrivers(sponsor.SID);
            console.log(result);

            if (result.length === 0) {
                res.status(404).send();
                return;
            }
            res.status(200).send(result);
        }
        else res.status(404).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

/*
*/
applications.get('/admin', async (req, res) => {
    try {
        const admin = await req.app.locals.db.getAllAdmin();
        return res.status(200).send(admin);
    } catch (err){
        console.log(err);
        res.status(500).send();
    }
});

module.exports = applications;