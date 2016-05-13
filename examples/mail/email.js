"use strict";

const nodemailer = require("nodemailer");

const smtpHost = process.argv[2];
if(!smtpHost){
	console.log("Expected usage:");
	console.log("node email.js 192.168.99.100:32793");
	process.exit(1);
}

console.log(`Connecting to ${smtpHost}`);

const transporter = nodemailer.createTransport(`smtp://${smtpHost}`);

const email = {
	to: '"Wes Higbee" <wes@foo.com>',
	from: '"Pax" <pax@foo.com>',
	subject: 'Treats?',
	text: 'We are out of treats, please buy more, and not the ones I do not like'
}

transporter.sendMail(email, function(error, info){
	if(error){
		return console.log(error);
	}
	console.log(`Message sent: ${info.response}`);
});

