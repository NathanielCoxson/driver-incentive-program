const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
require('dotenv').config();

const config = {
    server: "team01-rds.cobd8enwsupz.us-east-1.rds.amazonaws.com",
    options: {},
    authentication: {
        type: 'default',
        options: {
            userName: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        }
    }
}

const connection = new Connection(config);

connection.on('connect', err => {
    console.log('Attempting to connect');
    if (err) {
        console.log(err);
    }
    else {
        console.log('Connected');
    }
});

connection.connect();