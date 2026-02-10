const User = require('../models/User');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

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

        const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn : '1h'});

        res.redirect(`/user/${user.id}/dashboard`);

        return res.status(200).json({
            msg : "Successfully Logged In",
            token
        });
    } catch(err) {
        console.error("Login Error", err);
        return res.status(500).json({error : err.message});
    }
}

module.exports = verifyUser;