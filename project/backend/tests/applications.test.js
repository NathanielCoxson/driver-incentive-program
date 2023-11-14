const db = require('../db');
const request = require('supertest');
const baseUrl = process.env.BASE_URL || "http://localhost:3001/api";

const driverUser = {
    Username: "TestDriver"
};

const sponsorUser = {
    Username: "TestSponsor"
}

const adminUser = {
    Username: "TestAdmin"
}

const application = {
    Username: "TestDriver",
    SponsorName: "Test Sponsor",
    Reason: "test"
};

describe("POST /applications", () => {
    it ('should return 204', async () => {
        const response = await request(baseUrl).post('/applications').send(application);
        await request(baseUrl).delete(`/applications/users/${driverUser.Username}`).send({all: true});
        expect(response.statusCode).toBe(201);
    });

    it ('should return 403 for sponsor users', async () => {
        const response = await request(baseUrl).post('/applications').send({...application, Username: sponsorUser.Username});
        await request(baseUrl).delete(`/applications/users/${sponsorUser.Username}`).send({all: true});
        expect(response.statusCode).toBe(403);
    });
});

describe("GET /applications/users/:Username", () => {
    beforeAll(async () => {
        await request(baseUrl).post('/applications').send(application);
    });
    afterAll(async () => {
        await request(baseUrl).delete(`/applications/users/${driverUser.Username}`).send({all: true});
    });

    it ('should return 200', async () => {
        const response = await request(baseUrl).get(`/applications/users/${driverUser.Username}`)
        expect(response.statusCode).toBe(200);
    });
    it ('should not be empty', async () => {
        const response = await request(baseUrl).get(`/applications/users/${driverUser.Username}`)
        expect(response._body.applications.length).toBeGreaterThan(0);
    });
});

describe("DELETE /applications/:AID", () => {
    beforeEach(async () => {
        await request(baseUrl).post('/applications').send(application);
    });
    afterAll(async () => {
        await request(baseUrl).delete(`/applications/users/${driverUser.Username}`).send({all: true});
    });

    it ('should return 200', async () => {
        const response = await request(baseUrl).delete(`/applications/users/${driverUser.Username}`).send({all: true});
        expect(response.statusCode).toBe(200);
    });

    it ('should delete the application', async () => {
        await request(baseUrl).delete(`/applications/users/${driverUser.Username}`).send({all: true});
        const response = await request(baseUrl).get(`/applications/users/${driverUser.Username}`);
        expect(response.statusCode).toBe(404);
    });

    it ('should delete multiple applications', async () => {
        await request(baseUrl).delete(`/applications/users/${driverUser.Username}`).send({all: true});
        const AID1 = (await request(baseUrl).post('/applications').send({...application, SponsorName: 'None'}))._body.AID;
        const AID2 = (await request(baseUrl).post('/applications').send(application))._body.AID;
        await request(baseUrl).delete(`/applications/users/${driverUser.Username}`).send({IDs: [AID1, AID2]});
        const response = await request(baseUrl).get(`/applications/users/${driverUser.Username}`);
        expect(response.statusCode).toBe(404);
    });
});