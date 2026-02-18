const mongoose = require('mongoose');
const User = require('./user');
require('dotenv').config();

const organizerSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['Club', 'Council', 'Fest Team'],
        required: true
    },
    organizerName: {type: String, required: true},
    description: {type: String, required: true},
    contactNumber: {type: Number, required: true},
    contactEmail: {
        type: String,
        required: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address'
        ]
    }
});

const Organizer = User.discriminator('ORGANIZER', organizerSchema);

module.exports = Organizer;