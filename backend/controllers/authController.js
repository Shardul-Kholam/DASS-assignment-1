/** @type {import('mongoose').Model} */
const User = require('../models/user');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
/** @type {import('mongoose').Model} */
const participant = require("../models/participant");
const logger = require("../utils/logger");

const verifyUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({error: "Required fields are missing"});
        }

        const user = await User.findOne({email}).select('+password');
        const authError = "Invalid email or password";

        if (!user) {
            // Log generic attempt without revealing which part failed
            logger.warn(`Failed login attempt for email: ${email}`);
            return res.status(401).json({error: authError});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn(`Failed login attempt (password mismatch) for email: ${email}`);
            return res.status(401).json({error: authError});
        }

        const userID = user._id.toString();

        const tokenPayload = {
            userID,
            email: user.email,
            role: user.role
        }

        if (!process.env.JWT_SECRET) {
            logger.error("JWT_SECRET is missing in environment");
            return res.status(500).json({error: "Server configuration error"});
        }

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {expiresIn: '7d'});

        // FIX: Ensure secure cookies in production
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        logger.info(`User logged in: ${userID}`);

        return res.status(200).json({
            msg: "Successfully Logged In",
            token, // Kept for frontend compatibility, though cookie is preferred
            redirectUrl: `/user/${userID}/dashboard`
        });
    } catch (err) {
        logger.error("Login Error", {error: err.message});
        return res.status(500).json({error: "Authentication failed"});
    }
}

const register = async (req, res) => {
    try {
        const {firstName, lastName, email, password, participantType, phone, orgName} = req.body;

        if (!firstName || !lastName || !email || !password || !phone || !orgName || !participantType) {
            return res.status(400).json({msg: "All fields are required"});
        }

        if (!['IIIT', 'Non-IIIT'].includes(participantType)) {
            return res.status(400).json({msg: "Invalid participant type"});
        }

        const contactNumber = Number(String(phone).replace(/\D/g, ''));

        if (isNaN(contactNumber) || contactNumber <= 0) {
            return res.status(400).json({msg: "Invalid phone number"});
        }

        const trimmedOrgName = orgName.trim();

        if (!trimmedOrgName.length) {
            return res.status(400).json({msg: "Organization name cannot be empty"});
        }

        const newUser = new participant({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            password,
            participantType,
            contactNumber,
            OrgName: trimmedOrgName
        });

        const savedUser = await newUser.save();
        logger.info(`New user registered: ${savedUser._id}`);

        return res.status(201).json({
            msg: "Participant successfully registered",
            user: {
                id: savedUser._id,
                email: savedUser.email,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                role: savedUser.role
            }
        });
    } catch (err) {
        logger.error("Signup error", {error: err.message});

        if (err.code === 11000) {
            return res.status(400).json({msg: "Email already exists"});
        }

        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({msg: messages.join(', ')});
        }

        return res.status(500).json({msg: "Registration failed"});
    }
}

module.exports = {verifyUser, register};