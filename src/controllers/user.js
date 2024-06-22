const User = require("../models/UserModel");
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

exports.signUp = async (req, res) => {
    try {
        const { email_id, password, name, phone } = req.body;
        const ExistingUser = await User.findOne({ email_id: email_id });
        let response = {};
        if (ExistingUser) {
            response = { status: false, message: "Already player Registered", data: "" };
        } else {
            const pass = await hashPassword(password);
            if (!pass) {
                response.status = false;
                response.message = "Internal server error !!";
            }
            else {
                const newUser = new User({
                    email_id: email_id,
                    password: pass,
                    name: name,
                    phone: phone
                });
                const token = await generateToken(newUser._id);
                if (!token) {
                    response = { status: false, message: "Internal Server Error!!!!" }
                }
                else {
                    newUser.auth_token = token;
                    await newUser.save();
                    response = { status: true, message: "User Registered successfully!!!!", data: { auth_token: newUser.auth_token } };
                }
            }
        }
        res.status(200).json(response);
    } catch (error) {
        console.log(`---------error: ${error}`);
    }
}

exports.login = async (req, res) => {
    try {
        const { email_id, password } = req.body;
        const ExistingUser = await User.findOne({ email_id: email_id });
        let response = {};
        if (!ExistingUser) {
            response = { status: false, message: "player not registered!!" };
        } else {
            const matchPass = await verifyPassword(ExistingUser.password)
            if (!matchPass) {
                response.status = false;
                response.message = "Internal server error!!!";
            }
            else {
                if (matchPass !== password) {
                    response.status = false;
                    response.message = "Invalid Password !!!!";
                }
                else {
                    const token = await generateToken(ExistingUser._id);
                    if (!token) {
                        response.status = false;
                        response.message = "Internal server error !!!!";
                    }
                    else {
                        ExistingUser.auth_token = token;
                        await ExistingUser.save();
                        response = { status: true, message: "User Login successfully!!!!", data: { auth_token: ExistingUser.auth_token } };
                    }
                }
            }
        }
        res.status(200).json(response);
    } catch (error) {
        console.log(`---------error: ${error.message}`);
    }
}
exports.viewProfile = async (req, res) => {
    try {
        const { email_id, _id } = req.body;
        const ExistingUser = await User.findOne({ _id: _id, email_id: email_id }, { _id: 0 });
        let response = {};
        if (!ExistingUser) {
            response = { status: false, message: "User not authorized !!!!" };
        } else {
            let pass = await verifyPassword(ExistingUser.password);
            ExistingUser.password = pass;
            response = { status: true, message: "Player profile found", data: ExistingUser };
        }
        res.status(200).json(response);
    } catch (error) {
        console.log(`---------error: ${error.message}`);
    }
}
exports.updateProfile = async (req, res) => {
    try {
        const { _id } = req.body;
        const ExistingUser = await User.findOne({ _id: _id }, { _id: 0 });
        let response = {};
        if (!ExistingUser) {
            response = { status: false, message: "Invalid user !!!!" };
        } else {
            if (req.password) {
                let pass = await hashPassword(req.body.password);
                req.body.password = pass;
            }
            const updatedProfile = await User.findByIdAndUpdate(_id, req.body, { new: true })
            response = { status: true, message: "Player profile found", data: updatedProfile };
        }
        res.status(200).json(response);
    } catch (error) {
        console.log(`---------error: ${error.message}`);
    }
}


async function generateToken(id) {
    try {
        return jwt.sign({ id }, process.env.SECRET_KEY);
    } catch (error) {
        console.log(`---------error: ${error.message}`);
    }
}

async function hashPassword(password) {
    const cipher = crypto.createCipher(process.env.ALGO, process.env.SECRET_KEY);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted
}

async function verifyPassword(encrypted) {
    const decipher = crypto.createDecipher(process.env.ALGO, process.env.SECRET_KEY);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted
}

