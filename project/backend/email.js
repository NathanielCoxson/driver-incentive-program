const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cpsc4910team01@gmail.com',
        pass: 'nard luuo nsqe rbkv'
    }
});

var mailOptions = {
    from: 'cpsc4910team01@gmail.com',
    to: 'ncoxson@clemson.edu',
    subject: 'Node.js Test Email',
    text: 'Hello World!'
};

transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Email send: " + info.response);
    }
});