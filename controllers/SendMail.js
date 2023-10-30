const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {

        user: process.env.NodeMailer_User,
        pass: process.env.NodeMailer_Password,
    }
});

function sendMail(toEmail, subject, content) {
    const mailOptions = {
        from: process.env.NodeMailer_User,
        to: toEmail,
        subject: subject,
        html: content
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log("Error Ocured", err)
        } else {
            console.log("Email send:", info.response)
        }
    });
}

module.exports = { sendMail }