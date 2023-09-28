const Connection = require('tedious').Connection;
const Request = require('tedious').Request;

const config = {
    server: 'localhost',
    authentication: {
        type: 'default',
        options: {
            userName: 'user',
            password: 'password'
        }
    }
}

const connection = new Connection(config);

connection.on('connect', err => {
    if (err) {
        console.log(err);
    }
})