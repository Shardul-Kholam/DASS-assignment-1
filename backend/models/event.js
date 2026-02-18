const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    Name: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    eligibility: {type: String, required: true},
    registrationDeadline: {type: Date, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    registrationLimit: {type: Number, required: true},
    registrationFee: {type: Number, required: true, default: 0},
    tags: [{type: String}],
    orgID: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    registrations: [{
        participantId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        registeredAt: {type: Date, default: Date.now},
        status: {type: String, enum: ['Registered', 'Cancelled', 'Attended'], default: 'Registered'}
    }]
}, {discriminatorKey: 'type', timestamps: true});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;