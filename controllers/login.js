const User = require("../models/User");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const client = require("../redis");
const jwt = require("jsonwebtoken");
dotenv.config()

async function CheckUser(email) {
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return "Server Busy";
    }
}

async function AunthenticateUser(email, password) {
    try {
        const userCheck = await User.findOne({ email: email });
        console.log(userCheck)
        const validPassword = await bcrypt.compare(password, userCheck.password);
        console.log(validPassword);
        if (validPassword) {
            const token = jwt.sign({ email }, process.env.login_secrete_token);
            const response = {
                id: userCheck._id,
                name: userCheck.name,
                email: userCheck.email,
                token: token,
                status: true
            }
            await client.set(`key-${email}`, JSON.stringify(response));
            await User.findOneAndUpdate({ email: userCheck.email }, { $set: { token: token } }, { new: true });
            return response
        }
        return "Invalid User name or Password"
    } catch (e) {
        console.log(e)
        return "Server Busy"
    }
}

async function AuthorizeUser(token) {
    try {
        const decodedToken = jwt.verify(token, process.env.login_secrete_token)
        if (decodedToken) {
            const email = decodedToken.email;
            const auth = await client.get(`key-${email}`)
            if (auth) {
                const data = JSON.parse(auth)
                return data
            } else {
                const data = await User.findOne({ email: email })
                return data
            }
        } return false;
    } catch (e) {
        console.log(e)
    }
}

module.exports = { CheckUser, AunthenticateUser, AuthorizeUser }