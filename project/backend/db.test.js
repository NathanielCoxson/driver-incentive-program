const db = require('./db');
const request = require('supertest');
const baseUrl = process.env.BASE_URL || "http://localhost:3000/api";

describe('GET /api/about', () => {
    it ('should return 200', async () => {
        const response = await request(baseUrl).get('/about');
        expect(response.statusCode).toBe(200);
    });
});