const mongoose = require('mongoose');
const User = require('./user');
require('dotenv').config();

const organizerSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['Club', 'Council', 'Fest Team'],
        required: true
    },
    organizerName:{
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    }
});

const organizer = User.discriminator('ORGANIZER', organizerSchema);

module.exports = organizer;