// Router for <baseURL>/api
const express = require('express'); // express server
const api = express.Router(); // express router

// Endpoint routers
const users = require('./users');
const sponsors = require('./sponsors');
const applications = require('./applications');
const about = require('./about');
const catalogs = require('./catalogs');

api.use('/users', users);
api.use('/sponsors', sponsors);
api.use('/applications', applications);
api.use('/about', about);
api.use('/catalogs', catalogs);

module.exports = api;