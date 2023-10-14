const db = require('../db');
const request = require('supertest');
const baseUrl = process.env.BASE_URL || "http://localhost:3000/api";

const user = {
    Username: "TestDriver"
};

const application = {
    Username: "TestDriver",
    SponsorName: "Test Sponsor",
    "Reason": "test"
};

describe("POST /applications", () => {

});