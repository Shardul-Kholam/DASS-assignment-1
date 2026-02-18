const mongoose = require('mongoose');
const User = require('./user');

const admin = User.discriminator('ADMIN', new mongoose.Schema({}));

module.exports = admin;