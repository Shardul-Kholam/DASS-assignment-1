const mongoose = require('mongoose');

const formFieldSchema = new mongoose.Schema({
    label: {type: String, required: true},
    fieldType: {
        type: String,
        enum: ['text', 'number', 'dropdown', 'checkbox', 'file'],
        required: true
    },
    required: {type: Boolean, default: false},
    options: [{type: String}], // For dropdowns/checkboxes
    order: {type: Number, default: 0}
});

const eventSchema = new mongoose.Schema({
    // PDF Section 8: Event Attributes
    Name: {type: String, required: true},
    description: {type: String, required: true},
    eligibility: {type: String, required: true},
    registrationDeadline: {type: Date, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    registrationLimit: {type: Number, required: true},
    registrationFee: {type: Number, required: true, default: 0},
    tags: [{type: String}],
    orgID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customForm: [formFieldSchema],
    registrations: [{
        participantId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        registeredAt: {type: Date, default: Date.now},
        status: {
            type: String,
            enum: ['Registered', 'Cancelled', 'Attended', 'Waitlisted'],
            default: 'Registered'
        },
        formResponses: {type: Map, of: mongoose.Schema.Types.Mixed}
    }]
}, {discriminatorKey: 'type', timestamps: true});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;