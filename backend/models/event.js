const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    eligibility: {
        type: String,
        required: true,
    },
    registrationDeadline: {
        type: Date,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    registrationLimit: {
        type: Number,
        required: true,
    },
    registrations : {
        type: Array,
        required: true,
    },
    registrationFee: {
        type: Number,
        required: true,
    },
    orgID : {
        type: String,
        required: true,
    },
    tags : {
        type: Array,
        required: true,
    }
},{discriminatorKey : 'type', timestamps: true});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;