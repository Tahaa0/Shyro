const Datauri = require('datauri');
const path = require('path');

const cloudinary = require('../config/cloudinary');
//const sgMail = require('@sendgrid/mail');

//sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const mailgun = require("mailgun-js");

const mg = mailgun({apiKey: process.env.MG_API_KEY, domain: process.env.MG_DOMAIN});

function uploader(req) {
    return new Promise((resolve, reject) => {
        const dUri = new Datauri();
        let image = dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

        cloudinary.uploader.upload(image.content, (err, url) => {
            if (err) return reject(err);
            return resolve(url);
        })
    });
}

function sendEmail(mailOptions) {
    return new Promise((resolve, reject) => {
        mg.messages().send(mailOptions, (error, result) => {
            if (error) return reject(error);
            return resolve(result);
        });
    });
}

module.exports = { uploader, sendEmail };