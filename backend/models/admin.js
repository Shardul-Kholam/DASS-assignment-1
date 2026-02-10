const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config();

const admin =  User.discriminator('admin', new mongoose.Schema({}));

const adminUser = await new admin({
    firstName : "Shardul",
    lastName : "Kholam",
    email : process.env.ADMIN_EMAIL,
    password : process.env.ADMIN_PWD
}).save();

console.log(adminUser);

module.exports = admin;