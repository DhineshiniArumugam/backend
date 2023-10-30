const User = require("../models/User");
const { sendMail } = require("./sendMail");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const VerifyUser = require("../models/VerifyUser")
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config()

async function InsertVerifyUser(name, email, password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const token = generateToken(email);

        const newUser = new VerifyUser({
            name: name,
            email: email,
            password: hashedPassword,
            token: token
        })
        console.log(newUser)

        const activationLink = `https://backend-gxm0.onrender.com/signin/${token}`
        const content = `<h4> hi,there </h4>
        <h5>Welcome to the app</h5>
        <p>Thank you for signing up.Click on the below link</p>
        <a href="${activationLink}">click here</a>
        <p>Regards</p>
        <p>Team</p>`

        await newUser.save();
        sendMail(email, "VerifyUser", content)
    } catch (e) {
        console.log(e);
    }
}

function generateToken(email) {
    const token = jwt.sign(email, process.env.signup_Secret_Token)
    return token
}


async function InsertSignupUser(token) {
    try {
        const userVerify = await VerifyUser.findOne({ token: token });
        if (userVerify) {
            const newUser = new User({
                name: userVerify.name,
                email: userVerify.email,
                password: userVerify.password,
                forgetPassword: {}
            });
            await newUser.save();
            await userVerify.deleteOne({ token: token });
            const content = `<h4> Congrats </h4>
        <h5>Welcome to the app</h5>
        <p>you are successfully registered</p>
        <p>Regards</p>
        <p>Team</p>`;
            sendMail(newUser.email, "Registration sucessful", content);
            return `<h4> Congrats </h4>
        <h5>Welcome to the app</h5>
        <p>you are successfully registered</p>
        <p>Regards</p>
        <p>Team</p>`
        }
        return `<h4> Registration failed </h4>
    <p>Link expired........</p>
    <p>Regards</p>
    <p>Team</p>`
    } catch (e) {
        console.log(e)
        return `
        <html>
        <body>
        <h4> Registration failed </h4>
        <p>Unexcepted error happened....</p>
        <p>Regards</p>
        <p>Team</p>
        </body>
        </html>`
    }
}


module.exports = { InsertVerifyUser, InsertSignupUser };