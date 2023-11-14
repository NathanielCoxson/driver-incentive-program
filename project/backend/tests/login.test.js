const db = require('../db');
const request = require('supertest');
const baseUrl = process.env.BASE_URL || "http://localhost:3001/api";

const driverUser = {
    Username: "TestDriver"
};

const sponsorUser = {
    Username: "TestSponsor"
};

const adminUser = {
    Username: "TestAdmin"
};

const password = "FIFO-admin-01&";

describe('GET /api/about', () => {
    it ('Verify driver login', async () => {
        const login = {Username: driverUser.Username, Password: password};
        const response = await request(baseUrl).post('/users/login').send(login);
        expect(response.statusCode).toBe(201);
    });
    it ('Verify sponsor login', async () => {
        const login = {Username: sponsorUser.Username, Password: password};
        const response = await request(baseUrl).post('/users/login').send(login);
        expect(response.statusCode).toBe(201);
    });
    it ('Verify admin login', async () => {
        const login = {Username: adminUser.Username, Password: password};
        const response = await request(baseUrl).post('/users/login').send(login);
        expect(response.statusCode).toBe(201);
    });
});