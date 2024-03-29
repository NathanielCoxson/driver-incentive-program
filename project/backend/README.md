## Setup
Install required modules to run the server.

### `npm install`

If you are running the server locally, you need to\
make sure that the EC2 instance allows inbound traffic from\
your local ip.\
You will also need to create a .env file with the\
following environment variables defined:

### `DB_USER`
    Database username
### `DB_PWD`
    Database password
### `DB_NAME`
    Name of database to use
### `DB_SERVER_NAME`
    RDS server endpoint
### `PORT(optional)`
    Port to use for the server, defaults to 3000

## Running the Server
Run the server locally using:

### `node server.js`

To run the server on EC2 you need to daemonize the server
so that it is a process running in the background on the machine.\
This prevents the server from stopping when no one is logged into the machine.\
This is accomplished using the node package PM2: https://www.npmjs.com/package/pm2

Start the server as a process:

### `pm2 start server.js`

View all running processes with:

### `pm2 list`

Stop the process using:

### `pm2 stop <app_name|namespace|id|'all'|json_conf>`

Or delete the process using:

### `pm2 delete <app_name|namespace|id|'all'|json_conf>`

You can also restart the process with:

### `pm2 restart <app_name|namespace|id|'all'|json_conf>`