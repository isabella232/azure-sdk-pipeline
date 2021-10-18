var nodemailer = require('nodemailer');
var server = "127.0.0.1";
var isSSL = false;
var port = 1025;
var config = {
    host: server,
    secure: isSSL, // use SSL
    port: port, // port
};

var username = "codegenapp@hotmail.com";
var password = "cgaqwer1234";
if(username)
{
    config.auth = {
        user: username
    };
    if(password){
        config.auth.pass = password;
    }
}

var startTLS = false;

if (startTLS) {
    config.requireTLS = true;
    config.secure = false;
    config.tls = {
        rejectUnauthorized: false
    };
}

var subject = "CodeGen Alert";
var body = "Hello world";
var to = "sdkautomationpipeline@outlook.com";
var from = "codegenapp@hotmail.com";

var stransporter = nodemailer.createTransport(config);

function ssl() {
    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: body
    }
    // if (attachmentPath) {
    //     mailOptions.attachments = [{
    //         path: attachmentPath
    //     }];
    // }
    return mailOptions;
}

stransporter.sendMail(ssl(), function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Message sent: ' + info.response);
    }
});
