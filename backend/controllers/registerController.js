/** @type {import('mongoose').Model} */
const participant = require("../models/participant");
const mongoose = require("mongoose");

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

module.exports = register;