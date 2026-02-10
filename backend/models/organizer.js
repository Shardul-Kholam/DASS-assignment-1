const mongoose = require('mongoose');
require('dotenv').config();

const organizer = new mongoose.Schema({
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
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate:[
            {
                validator: (v) => RegExp(process.env.EMAIL_REGEX).test(v),
                message: 'Please enter a valid email address'
            }
        ]
    }
});

module.exports = organizer;