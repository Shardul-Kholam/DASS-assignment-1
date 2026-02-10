/** @type {import('mongoose').Model} */
const User = require('../models/user');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
/** @type {import('mongoose').Model} */
const participant = require("../models/participant");
const mongoose = require("mongoose");

const verifyUser = async (req,res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({error:"Required fields are missing"});
        }

        const user = await User.findOne({email}, '+password', null);
        const authError = "Invalid email or password";

        if(!user){
            return res.status(401).json({error: authError});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({error : authError});
        }

        const userID = user._id.toString();

        const tokenPayload = {
            userID,
            email : user.email
        }

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {expiresIn : '1h'});

        return res.status(200).json({
            msg : "Successfully Logged In",
            token,
            redirectUrl : `/user/${userID}/dashboard`
        });
    } catch(err) {
        console.error("Login Error", err);
        return res.status(500).json({error : err.message});
    }
}

const register = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const {firstName, lastName, email, password, participantType} = req.body;

        const newUser = new participant({
            firstName,
            lastName,
            email,
            password,
            participantType
        });

        const savedUser = await newUser.save({session});

        await session.commitTransaction();
        await session.endSession();

        return res.status(200).json({
            msg: "Participant successfully registered",
            user: savedUser
        });
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();

        if(err.code === 11000) {
            return res.status(400).json({msg: "Email already exists"});
        }
        return res.status(500).json({msg: err.message});
    }
}

module.exports = {verifyUser, register};